import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RecipeEntity } from '../entities/recipe.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipesRepository: Repository<RecipeEntity>,
  ) {}

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
