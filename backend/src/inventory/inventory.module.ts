import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryEntity } from '../entities/inventory.entity';
import { MasterCatalogEntity } from '../entities/master-catalog.entity';
import { UserEntity } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryEntity, MasterCatalogEntity, UserEntity]),
  ],
})
export class InventoryModule {}