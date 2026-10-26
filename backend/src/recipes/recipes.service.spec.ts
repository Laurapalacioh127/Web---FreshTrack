import { jest } from '@jest/globals';
import type { Repository } from 'typeorm';
import type { RecipeEntity } from '../entities/recipe.entity';
import { RecipesService } from './recipes.service';

describe('RecipesService', () => {
  it('should query only approved recipes', async () => {
    const find = jest.fn<() => Promise<RecipeEntity[]>>().mockResolvedValue([]);

    const recipesRepository = {
      find,
    } as unknown as Repository<RecipeEntity>;

    const service = new RecipesService(recipesRepository);

    await service.findApproved();

    expect(find).toHaveBeenCalledWith({
      where: {
        moderationStatus: 'approved',
      },
      relations: {
        ingredients: {
          masterProduct: true,
        },
      },
    });
  });
});
