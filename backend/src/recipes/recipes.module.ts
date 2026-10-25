import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterCatalogEntity } from '../entities/master-catalog.entity';
import { RecipeIngredientEntity } from '../entities/recipe-ingredient.entity';
import { RecipeEntity } from '../entities/recipe.entity';
import { UserEntity } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecipeEntity,
      RecipeIngredientEntity,
      MasterCatalogEntity,
      UserEntity,
    ]),
  ],
})
export class RecipesModule {}