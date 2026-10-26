import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InventoryEntity } from '../entities/inventory.entity';
import { UserEntity } from '../entities/user.entity';
import { DonationOfferEntity } from '../entities/donation-offer.entity';
import { CreateDonationItemDto } from './dto/create-donation-item.dto';

@Injectable()
export class DonationsRulesService {
  validateAdmin(user: UserEntity): void {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admins can review donations');
    }
  }

  validatePending(donation: DonationOfferEntity): void {
    if (donation.donationStatus !== 'pending') {
      throw new ConflictException('Donation has already been reviewed');
    }
  }

  validateUniqueItems(items: CreateDonationItemDto[]): void {
    const ids = items.map((item) => item.inventoryId);
    if (new Set(ids).size !== ids.length) {
      throw new BadRequestException('Inventory items cannot be repeated');
    }
  }

  validateItem(
    item: InventoryEntity,
    donorId: number,
    quantity: number,
    today: Date = new Date(),
  ): void {
    if (item.user.id !== donorId) {
      throw new ForbiddenException(
        'Inventory item does not belong to the donor',
      );
    }
    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > item.quantity
    ) {
      throw new BadRequestException('Not enough stock for this donation');
    }

    const [year, month, day] = item.expirationDate.split('-').map(Number);
    const expiration = new Date(year, month - 1, day);
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    if (expiration < todayStart) {
      throw new BadRequestException('Expired food cannot be donated');
    }
  }
}
