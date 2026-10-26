import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { RecipeIngredientEntity } from './recipe-ingredient.entity.js';
import type { UserEntity } from './user.entity.js';

@Entity('recipes')
export class RecipeEntity {
  @PrimaryGeneratedColumn({ name: 'recipe_id' })
  id!: number;

  @ManyToOne('UserEntity', (user: UserEntity) => user.recipes, {
    nullable: false,
  })
  @JoinColumn({ name: 'author_id' })
  author!: UserEntity;

  @Column({ length: 150 })
  title!: string;

  @Column({ name: 'prep_time_mins', type: 'int' })
  prepTimeMins!: number;

  // El admin modera: pending → approved o rejected
  @Column({
    name: 'moderation_status',
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  moderationStatus!: 'pending' | 'approved' | 'rejected';

  @OneToMany(
    'RecipeIngredientEntity',
    (ingredient: RecipeIngredientEntity) => ingredient.recipe,
  )
  ingredients!: RecipeIngredientEntity[];
}
