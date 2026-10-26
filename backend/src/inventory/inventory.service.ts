import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryEntity } from '../entities/inventory.entity';
import { MasterCatalogEntity } from '../entities/master-catalog.entity';
import { UserEntity } from '../entities/user.entity';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { ExpiringInventoryQueryDto } from './dto/expiring-inventory-query.dto';
import { FilterInventoryQueryDto } from './dto/filter-inventory-query.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { InventoryRulesService } from './inventory-rules.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryEntity)
    private readonly inventoryRepository: Repository<InventoryEntity>,

    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    @InjectRepository(MasterCatalogEntity)
    private readonly catalogRepository: Repository<MasterCatalogEntity>,

    private readonly inventoryRulesService: InventoryRulesService,
  ) {}

  async create(
    dto: CreateInventoryItemDto & { userId: number },
  ): Promise<InventoryEntity> {
    const user = await this.usersRepository.findOneBy({ id: dto.userId });

    if (!user) {
      throw new NotFoundException(`User ${dto.userId} not found`);
    }

    const masterProduct = await this.catalogRepository.findOneBy({
      id: dto.masterProductId,
    });

    if (!masterProduct) {
      throw new NotFoundException(
        `Catalog product ${dto.masterProductId} not found`,
      );
    }

    const item = this.inventoryRepository.create({
      user,
      masterProduct,
      quantity: dto.quantity,
      expirationDate: dto.expirationDate,
    });

    return this.inventoryRepository.save(item);
  }

  async findByUser(query: FilterInventoryQueryDto): Promise<InventoryEntity[]> {
    return this.inventoryRepository.find({
      where: { user: { id: query.userId } },
      relations: { masterProduct: true },
      order: { expirationDate: 'ASC' },
    });
  }

  async findExpiring(query: ExpiringInventoryQueryDto & { userId: number }) {
    const items = await this.findByUser({ userId: query.userId });

    return items
      .map((item) => ({
        id: item.id,
        product: item.masterProduct.productName,
        quantity: item.quantity,
        expirationDate: item.expirationDate,
        daysUntilExpiration:
          this.inventoryRulesService.getDaysUntilExpiration(item),
        status: this.inventoryRulesService.getExpirationStatus(
          item,
          query.days,
        ),
      }))
      .filter((item) => item.status !== 'fresh');
  }

  async findOne(id: number, userId: number): Promise<InventoryEntity> {
    const item = await this.inventoryRepository.findOne({
      where: { id, user: { id: userId } },
      relations: { masterProduct: true },
    });

    if (!item) {
      throw new NotFoundException(`Inventory item ${id} not found`);
    }

    return item;
  }

  async update(
    id: number,
    dto: UpdateInventoryItemDto,
    userId: number,
  ): Promise<InventoryEntity> {
    const item = await this.findOne(id, userId);

    this.inventoryRepository.merge(item, dto);

    return this.inventoryRepository.save(item);
  }

  async remove(id: number, userId: number): Promise<InventoryEntity> {
    const item = await this.findOne(id, userId);

    return this.inventoryRepository.remove(item);
  }
}
