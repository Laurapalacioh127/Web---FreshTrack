import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { InventoryEntity } from './inventory.entity.ts';
import type { RecipeIngredientEntity } from './recipe-ingredient.entity.ts';

@Entity('master_catalog')
export class MasterCatalogEntity {
  @PrimaryGeneratedColumn({ name: 'master_product_id' })
  id!: number;

  @Column({ name: 'product_name', length: 120, unique: true })
  productName!: string;

  @Column({ length: 80 })
  category!: string;

  @Column({ name: 'avg_shelf_life_days', type: 'int' })
  avgShelfLifeDays!: number;

  @OneToMany('InventoryEntity', (item: InventoryEntity) => item.masterProduct)
  inventoryItems!: InventoryEntity[];

  @OneToMany(
    'RecipeIngredientEntity',
    (ingredient: RecipeIngredientEntity) => ingredient.masterProduct,
  )
  recipeIngredients!: RecipeIngredientEntity[];
}