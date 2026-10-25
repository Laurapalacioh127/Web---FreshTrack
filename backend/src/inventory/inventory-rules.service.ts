import { Injectable } from '@nestjs/common';
import { InventoryEntity } from '../entities/inventory.entity';

export type ExpirationStatus = 'expired' | 'expiring_soon' | 'fresh';

@Injectable()
export class InventoryRulesService {
  getDaysUntilExpiration(item: InventoryEntity, today: Date = new Date()): number {
    const msPerDay = 24 * 60 * 60 * 1000;

    // 'YYYY-MM-DD' → fecha local, para no desfasarnos por zona horaria
    const [year, month, day] = item.expirationDate.split('-').map(Number);
    const expiration = new Date(year, month - 1, day);
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    return Math.round((expiration.getTime() - todayStart.getTime()) / msPerDay);
  }

  getExpirationStatus(
    item: InventoryEntity,
    warningDays: number,
    today: Date = new Date(),
  ): ExpirationStatus {
    const daysLeft = this.getDaysUntilExpiration(item, today);

    if (daysLeft < 0) {
      return 'expired';
    }

    if (daysLeft <= warningDays) {
      return 'expiring_soon';
    }

    return 'fresh';
  }
}