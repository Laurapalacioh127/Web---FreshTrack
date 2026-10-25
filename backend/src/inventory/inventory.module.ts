import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryEntity } from '../entities/inventory.entity';
import { MasterCatalogEntity } from '../entities/master-catalog.entity';
import { UserEntity } from '../entities/user.entity';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { InventoryRulesService } from './inventory-rules.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryEntity, MasterCatalogEntity, UserEntity]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService,InventoryRulesService],
})
export class InventoryModule {}