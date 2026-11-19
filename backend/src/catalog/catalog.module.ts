import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterCatalogEntity } from '../entities/master-catalog.entity';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

@Module({
  imports: [TypeOrmModule.forFeature([MasterCatalogEntity])],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}