import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { DonationOfferEntity } from './donation-offer.entity';
import type { InventoryEntity } from './inventory.entity';

@Entity('donation_items')
export class DonationItemEntity {
  @PrimaryGeneratedColumn({ name: 'donation_item_id' })
  id!: number;

  @ManyToOne(
    'DonationOfferEntity',
    (donation: DonationOfferEntity) => donation.items,
    { nullable: false },
  )
  @JoinColumn({ name: 'donation_id' })
  donation!: DonationOfferEntity;

  @ManyToOne('InventoryEntity', (item: InventoryEntity) => item.donationItems, {
    nullable: false,
  })
  @JoinColumn({ name: 'inventory_id' })
  inventory!: InventoryEntity;

  @Column({ type: 'int' })
  quantity!: number;
}
