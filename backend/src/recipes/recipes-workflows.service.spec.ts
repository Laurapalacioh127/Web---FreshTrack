import { jest } from '@jest/globals';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import type { Repository } from 'typeorm';

import { RecipeEntity } from '../entities/recipe.entity';
import { RecipeIngredientEntity } from '../entities/recipe-ingredient.entity';
import { MasterCatalogEntity } from '../entities/master-catalog.entity';
import type { UserEntity } from '../entities/user.entity';
import { RecipesService } from './recipes.service';
import { RecipesRulesService } from './recipes-rules.service';

function setup() {
  const author = {
    id: 7,
    role: 'admin',
  } as UserEntity;

  const product = {
    id: 3,
    productName: 'Arroz',
  } as MasterCatalogEntity;

  const recipe = {
    id: 9,
    author,
    title: 'Arroz con verduras',
    prepTimeMins: 25,
    moderationStatus: 'pending',
  } as RecipeEntity;

  const users = {
    findOneBy: jest.fn(async () => author),
  };

  const catalog = {
    find: jest.fn(async () => [product]),
  };

  const recipesTx = {
    create: jest.fn((data: Partial<RecipeEntity>) => data),
    save: jest.fn(async (data: Partial<RecipeEntity>) => ({
      ...data,
      id: 9,
    })),
    findOne: jest.fn(async () => recipe),
    findOneOrFail: jest.fn(async () => recipe),
  };

  const ingredientsTx = {
    create: jest.fn((data: object) => data),
    save: jest.fn(async (data: object[]) => data),
  };

  const txManager = {
    getRepository: jest.fn((entity: unknown) => {
      if (entity === RecipeEntity) return recipesTx;
      if (entity === RecipeIngredientEntity) return ingredientsTx;
      throw new Error('Unexpected repository');
    }),
  };

  const transaction = jest.fn(
    async (work: (manager: typeof txManager) => Promise<RecipeEntity>) =>
      work(txManager),
  );

  const recipesRepository = {
    manager: {
      getRepository: jest.fn((entity: unknown) => {
        if (entity === MasterCatalogEntity) return catalog;
        throw new Error('Unexpected repository');
      }),
      transaction,
    },
  };

  const service = new RecipesService(
    recipesRepository as unknown as Repository<RecipeEntity>,
    users as unknown as Repository<UserEntity>,
    new RecipesRulesService(),
  );

  return {
    service,
    author,
    product,
    recipe,
    users,
    catalog,
    recipesTx,
    ingredientsTx,
    transaction,
  };
}

describe('RecipesService workflows', () => {
  it('creates a pending recipe with ingredients', async () => {
    const mock = setup();

    const result = await mock.service.create(
      {
        title: 'Arroz con verduras',
        prepTimeMins: 25,
        masterProductIds: [3],
      },
      7,
    );

    expect(result.id).toBe(9);
    expect(mock.transaction).toHaveBeenCalledTimes(1);

    expect(mock.recipesTx.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Arroz con verduras',
        moderationStatus: 'pending',
        author: mock.author,
      }),
    );

    expect(mock.ingredientsTx.save).toHaveBeenCalledWith([
      expect.objectContaining({
        masterProduct: mock.product,
        recipe: expect.objectContaining({ id: 9 }),
      }),
    ]);
  });

  it('rejects nonexistent ingredients', async () => {
    const mock = setup();
    mock.catalog.find.mockResolvedValueOnce([]);

    await expect(
      mock.service.create(
        {
          title: 'Receta inválida',
          prepTimeMins: 20,
          masterProductIds: [99],
        },
        7,
      ),
    ).rejects.toThrow(NotFoundException);

    expect(mock.transaction).not.toHaveBeenCalled();
  });

  it('allows an admin to approve a pending recipe', async () => {
    const mock = setup();

    const result = await mock.service.moderate(
      9,
      { moderationStatus: 'approved' },
      7,
    );

    expect(result.moderationStatus).toBe('approved');
    expect(mock.recipesTx.save).toHaveBeenCalled();
    expect(mock.recipesTx.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        lock: { mode: 'pessimistic_write' },
      }),
    );
  });

  it('rejects moderation by a regular user', async () => {
    const mock = setup();
    mock.author.role = 'user';

    await expect(
      mock.service.moderate(9, { moderationStatus: 'approved' }, 7),
    ).rejects.toThrow(ForbiddenException);

    expect(mock.transaction).not.toHaveBeenCalled();
  });

  it('prevents moderating an approved recipe again', async () => {
    const mock = setup();
    mock.recipe.moderationStatus = 'approved';

    await expect(
      mock.service.moderate(9, { moderationStatus: 'rejected' }, 7),
    ).rejects.toThrow(ConflictException);

    expect(mock.recipesTx.save).not.toHaveBeenCalled();
  });
});
