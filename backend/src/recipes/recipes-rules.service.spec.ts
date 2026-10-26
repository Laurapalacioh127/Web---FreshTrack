import { ForbiddenException, ConflictException } from '@nestjs/common';

import type { UserEntity } from '../entities/user.entity';
import type { RecipeEntity } from '../entities/recipe.entity';
import { RecipesRulesService } from './recipes-rules.service';

describe('RecipesRulesService', () => {
  const rulesService = new RecipesRulesService();

  it('should reject users who are not admins', () => {
    const user = { role: 'user' } as UserEntity;

    expect(() => rulesService.validateAdmin(user)).toThrow(ForbiddenException);
  });

  it('should reject moderation of an approved recipe', () => {
    const recipe = {
      moderationStatus: 'approved',
    } as RecipeEntity;

    expect(() => rulesService.validatePending(recipe)).toThrow(
      ConflictException,
    );
  });

  it('should allow moderation of a pending recipe', () => {
    const recipe = {
      moderationStatus: 'pending',
    } as RecipeEntity;

    expect(() => rulesService.validatePending(recipe)).not.toThrow();
  });
});
