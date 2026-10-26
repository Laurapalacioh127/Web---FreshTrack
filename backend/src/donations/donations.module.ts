import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationItemEntity } from '../entities/donation-item.entity';
import { DonationOfferEntity } from '../entities/donation-offer.entity';
import { InventoryEntity } from '../entities/inventory.entity';
import { UserEntity } from '../entities/user.entity';

import { DonationsController } from './donations.controller';
import { DonationsService } from './donations.service';
import { DonationsRulesService } from './donations-rules.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DonationOfferEntity,
      DonationItemEntity,
      InventoryEntity,
      UserEntity,
    ]),
  ],
  controllers: [DonationsController],
  providers: [DonationsService, DonationsRulesService],
})
export class DonationsModule {}
