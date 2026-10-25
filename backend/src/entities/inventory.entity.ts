import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { DonationItemEntity } from './donation-item.entity.ts';
import type { MasterCatalogEntity } from './master-catalog.entity';
import type { UserEntity } from './user.entity';

@Entity('inventory')
export class InventoryEntity {
  @PrimaryGeneratedColumn({ name: 'inventory_id' })
  id!: number;

  @ManyToOne('UserEntity', (user: UserEntity) => user.inventoryItems, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @ManyToOne(
    'MasterCatalogEntity',
    (product: MasterCatalogEntity) => product.inventoryItems,
    { nullable: false },
  )
  @JoinColumn({ name: 'master_product_id' })
  masterProduct!: MasterCatalogEntity;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ name: 'expiration_date', type: 'date' })
  expirationDate!: string;

  @OneToMany('DonationItemEntity', (item: DonationItemEntity) => item.inventory)
  donationItems!: DonationItemEntity[];
}