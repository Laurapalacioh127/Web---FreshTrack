import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { DonationOfferEntity } from './donation-offer.entity.ts';
import type { InventoryEntity } from './inventory.entity.ts';
import type { RecipeEntity } from './recipe.entity.ts';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id!: number;

  @Column({ name: 'full_name', length: 100 })
  fullName!: string;

  @Column({ unique: true, length: 150 })
  email!: string;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  role!: 'user' | 'admin';

  @Column({ name: 'total_rescued_kg', type: 'float', default: 0 })
  totalRescuedKg!: number;

  @OneToMany('InventoryEntity', (item: InventoryEntity) => item.user)
  inventoryItems!: InventoryEntity[];

  @OneToMany('RecipeEntity', (recipe: RecipeEntity) => recipe.author)
  recipes!: RecipeEntity[];

  @OneToMany('DonationOfferEntity', (donation: DonationOfferEntity) => donation.donor)
  donations!: DonationOfferEntity[];
}