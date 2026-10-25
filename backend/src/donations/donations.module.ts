import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationItemEntity } from '../entities/donation-item.entity';
import { DonationOfferEntity } from '../entities/donation-offer.entity';
import { InventoryEntity } from '../entities/inventory.entity';
import { UserEntity } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DonationOfferEntity,
      DonationItemEntity,
      InventoryEntity,
      UserEntity,
    ]),
  ],
})
export class DonationsModule {}