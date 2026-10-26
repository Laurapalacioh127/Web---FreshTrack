import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DonationOfferEntity } from '../entities/donation-offer.entity';
import { DonationItemEntity } from '../entities/donation-item.entity';
import { InventoryEntity } from '../entities/inventory.entity';
import { UserEntity } from '../entities/user.entity';
import { CreateDonationDto } from './dto/create-donation.dto';
import { FilterDonationsQueryDto } from './dto/filter-donations-query.dto';
import { ReviewDonationDto } from './dto/review-donation.dto';
import { DonationsRulesService } from './donations-rules.service';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(DonationOfferEntity)
    private readonly donationsRepository: Repository<DonationOfferEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
    private readonly donationsRulesService: DonationsRulesService,
  ) {}

  async create(
    dto: CreateDonationDto & { donorId: number },
  ): Promise<DonationOfferEntity> {
    const donor = await this.usersRepository.findOneBy({ id: dto.donorId });
    if (!donor) {
      throw new NotFoundException(`User ${dto.donorId} not found`);
    }
    this.donationsRulesService.validateUniqueItems(dto.items);

    return this.dataSource.transaction(async (manager) => {
      const inventoryRepository = manager.getRepository(InventoryEntity);
      const donationsRepository = manager.getRepository(DonationOfferEntity);
      const itemsRepository = manager.getRepository(DonationItemEntity);
      const items: DonationItemEntity[] = [];

      for (const requested of dto.items) {
        const inventory = await inventoryRepository.findOne({
          where: { id: requested.inventoryId },
          relations: { user: true, masterProduct: true },
        });
        if (!inventory) {
          throw new NotFoundException(
            `Inventory item ${requested.inventoryId} not found`,
          );
        }
        this.donationsRulesService.validateItem(
          inventory,
          donor.id,
          requested.quantity,
        );
        items.push(
          itemsRepository.create({ inventory, quantity: requested.quantity }),
        );
      }

      const donation = await donationsRepository.save(
        donationsRepository.create({ donor, donationStatus: 'pending' }),
      );
      // Las entidades no tienen cascade: los detalles se guardan por separado.
      for (const item of items) {
        item.donation = donation;
      }
      await itemsRepository.save(items);
      // Volvemos a cargar sin relaciones circulares para poder responder en JSON.
      return donationsRepository.findOneOrFail({
        where: { id: donation.id },
        relations: {
          donor: true,
          items: { inventory: { masterProduct: true } },
        },
      });
    });
  }

  findAll(query: FilterDonationsQueryDto): Promise<DonationOfferEntity[]> {
    return this.donationsRepository.find({
      where: {
        ...(query.donorId !== undefined
          ? { donor: { id: query.donorId } }
          : {}),
        ...(query.status !== undefined ? { donationStatus: query.status } : {}),
      },
      relations: { donor: true, items: { inventory: { masterProduct: true } } },
      order: { createdAt: 'DESC', id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<DonationOfferEntity> {
    const donation = await this.donationsRepository.findOne({
      where: { id },
      relations: { donor: true, items: { inventory: { masterProduct: true } } },
    });
    if (!donation) {
      throw new NotFoundException(`Donation ${id} not found`);
    }
    return donation;
  }

  async review(
    id: number,
    dto: ReviewDonationDto & { adminId: number },
  ): Promise<DonationOfferEntity> {
    const admin = await this.usersRepository.findOneBy({ id: dto.adminId });
    if (!admin) {
      throw new NotFoundException(`User ${dto.adminId} not found`);
    }
    this.donationsRulesService.validateAdmin(admin);

    return this.dataSource.transaction(async (manager) => {
      const donationsRepository = manager.getRepository(DonationOfferEntity);
      const inventoryRepository = manager.getRepository(InventoryEntity);
      // Bloquea la oferta para que dos revisiones no descuenten dos veces.
      const locked = await donationsRepository.findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!locked) {
        throw new NotFoundException(`Donation ${id} not found`);
      }
      this.donationsRulesService.validatePending(locked);
      const donation = await donationsRepository.findOneOrFail({
        where: { id },
        relations: { donor: true, items: { inventory: true } },
      });

      if (dto.status === 'accepted') {
        // El mismo orden evita bloqueos cruzados entre ofertas con varios alimentos.
        const items = [...donation.items].sort(
          (a, b) => a.inventory.id - b.inventory.id,
        );
        for (const item of items) {
          const inventory = await inventoryRepository.findOne({
            where: { id: item.inventory.id },
            lock: { mode: 'pessimistic_write' },
          });
          if (!inventory) {
            throw new NotFoundException(
              `Inventory item ${item.inventory.id} not found`,
            );
          }
          inventory.user = await manager
            .getRepository(UserEntity)
            .findOneOrFail({
              where: { inventoryItems: { id: inventory.id } },
            });
          this.donationsRulesService.validateItem(
            inventory,
            donation.donor.id,
            item.quantity,
          );
          inventory.quantity -= item.quantity;
          await inventoryRepository.save(inventory);
        }
      }

      donation.donationStatus = dto.status;
      await donationsRepository.save(donation);
      return donationsRepository.findOneOrFail({
        where: { id },
        relations: {
          donor: true,
          items: { inventory: { masterProduct: true } },
        },
      });
    });
  }
}
