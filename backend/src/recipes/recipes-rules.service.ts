import {
  ForbiddenException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import type { UserEntity } from '../entities/user.entity';
import type { RecipeEntity } from '../entities/recipe.entity';

@Injectable()
export class RecipesRulesService {
  validateAdmin(user: UserEntity): void {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admins can moderate recipes');
    }
  }

  validatePending(recipe: RecipeEntity): void {
    if (recipe.moderationStatus !== 'pending') {
      throw new ConflictException('Only pending recipes can be moderated');
    }
  }
}
