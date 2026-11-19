import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterCatalogEntity } from '../entities/master-catalog.entity';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(MasterCatalogEntity)
    private readonly catalogRepository: Repository<MasterCatalogEntity>,
  ) {}

  findAll(): Promise<MasterCatalogEntity[]> {
    return this.catalogRepository.find({
      order: { category: 'ASC', productName: 'ASC' },
    });
  }
}