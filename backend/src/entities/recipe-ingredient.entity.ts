import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { MasterCatalogEntity } from './master-catalog.entity';
import type { RecipeEntity } from './recipe.entity';

@Entity('recipe_ingredients')
export class RecipeIngredientEntity {
  @PrimaryGeneratedColumn({ name: 'ingredient_id' })
  id!: number;

  @ManyToOne('RecipeEntity', (recipe: RecipeEntity) => recipe.ingredients, {
    nullable: false,
  })
  @JoinColumn({ name: 'recipe_id' })
  recipe!: RecipeEntity;

  @ManyToOne(
    'MasterCatalogEntity',
    (product: MasterCatalogEntity) => product.recipeIngredients,
    { nullable: false },
  )
  @JoinColumn({ name: 'master_product_id' })
  masterProduct!: MasterCatalogEntity;
}