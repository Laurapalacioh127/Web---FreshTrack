import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { DonationItemEntity } from './donation-item.entity.ts';
import type { UserEntity } from './user.entity';

@Entity('donation_offers')
export class DonationOfferEntity {
  @PrimaryGeneratedColumn({ name: 'donation_id' })
  id!: number;

  @ManyToOne('UserEntity', (user: UserEntity) => user.donations, {
    nullable: false,
  })
  @JoinColumn({ name: 'donor_id' })
  donor!: UserEntity;

  // pending → el admin la acepta (accepted) o la rechaza (rejected)
  @Column({
    name: 'donation_status',
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  donationStatus!: 'pending' | 'accepted' | 'rejected';

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany('DonationItemEntity', (item: DonationItemEntity) => item.donation)
  items!: DonationItemEntity[];
}