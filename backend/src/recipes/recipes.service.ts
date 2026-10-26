import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MasterCatalogEntity } from '../entities/master-catalog.entity';
import { RecipeEntity } from '../entities/recipe.entity';
import { UserEntity } from '../entities/user.entity';
import { RecipeIngredientEntity } from '../entities/recipe-ingredient.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { ModerateRecipeDto } from './dto/moderate-recipe.dto';
import { RecipesRulesService } from './recipes-rules.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipesRepository: Repository<RecipeEntity>,

    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly recipesRulesService: RecipesRulesService,
  ) {}

  private async findAuthor(authorId: number): Promise<UserEntity> {
    const author = await this.usersRepository.findOneBy({
      id: authorId,
    });

    if (!author) {
      throw new NotFoundException(`User ${authorId} not found`);
    }

    return author;
  }

  private async findProducts(
    productIds: number[],
  ): Promise<MasterCatalogEntity[]> {
    const catalogRepository =
      this.recipesRepository.manager.getRepository(MasterCatalogEntity);

    const products = await catalogRepository.find({
      where: {
        id: In(productIds),
      },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException(
        'One or more recipe ingredients do not exist',
      );
    }

    return products;
  }

  async create(dto: CreateRecipeDto, authorId: number): Promise<RecipeEntity> {
    // autor exite
    const author = await this.findAuthor(authorId);

    // q los ingredientes existen
    const products = await this.findProducts(dto.masterProductIds);

    // guardar la receta e ingredientess
    return this.recipesRepository.manager.transaction(async (manager) => {
      const recipeRepository = manager.getRepository(RecipeEntity);
      const ingredientRepository = manager.getRepository(
        RecipeIngredientEntity,
      );

      const recipe = await recipeRepository.save(
        recipeRepository.create({
          author,
          title: dto.title,
          prepTimeMins: dto.prepTimeMins,
          moderationStatus: 'pending',
        }),
      );

      const ingredients = products.map((product) =>
        ingredientRepository.create({
          recipe,
          masterProduct: product,
        }),
      );

      await ingredientRepository.save(ingredients);

      return recipeRepository.findOneOrFail({
        where: { id: recipe.id },
        relations: {
          ingredients: {
            masterProduct: true,
          },
        },
      });
    });
  }

  async moderate(
    id: number,
    dto: ModerateRecipeDto,
    adminId: number,
  ): Promise<RecipeEntity> {
    const admin = await this.findAuthor(adminId);
    this.recipesRulesService.validateAdmin(admin);

    return this.recipesRepository.manager.transaction(async (manager) => {
      const repository = manager.getRepository(RecipeEntity);

      const recipe = await repository.findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!recipe) {
        throw new NotFoundException(`Recipe ${id} not found`);
      }

      this.recipesRulesService.validatePending(recipe);

      recipe.moderationStatus = dto.moderationStatus;

      await repository.save(recipe);

      return repository.findOneOrFail({
        where: { id },
        relations: {
          ingredients: {
            masterProduct: true,
          },
        },
      });
    });
  }

  findApproved(): Promise<RecipeEntity[]> {
    return this.recipesRepository.find({
      where: {
        moderationStatus: 'approved',
      },
      relations: {
        ingredients: {
          masterProduct: true,
        },
      },
    });
  }
}
