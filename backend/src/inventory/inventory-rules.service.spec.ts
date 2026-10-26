import { InventoryEntity } from '../entities/inventory.entity';
import { InventoryRulesService } from './inventory-rules.service';

describe('InventoryRulesService', () => {
  const service = new InventoryRulesService();

  // Fecha fija: 25 de octubre de 2026 (los meses empiezan en 0, por eso es 9)
  const today = new Date(2026, 9, 25);

  const itemExpiringOn = (expirationDate: string) =>
    ({ expirationDate }) as InventoryEntity;

  describe('getDaysUntilExpiration', () => {
    it('returns the days left when the date is in the future', () => {
      const days = service.getDaysUntilExpiration(
        itemExpiringOn('2026-10-27'),
        today,
      );

      expect(days).toBe(2);
    });

    it('returns 0 when the item expires today', () => {
      const days = service.getDaysUntilExpiration(
        itemExpiringOn('2026-10-25'),
        today,
      );

      expect(days).toBe(0);
    });

    it('returns a negative number when the item is already expired', () => {
      const days = service.getDaysUntilExpiration(
        itemExpiringOn('2026-10-20'),
        today,
      );

      expect(days).toBe(-5);
    });
  });

  describe('getExpirationStatus', () => {
    it('returns expired when the date has already passed', () => {
      const status = service.getExpirationStatus(
        itemExpiringOn('2026-10-20'),
        3,
        today,
      );

      expect(status).toBe('expired');
    });

    it('returns expiring_soon when it expires within the warning days', () => {
      const status = service.getExpirationStatus(
        itemExpiringOn('2026-10-27'),
        3,
        today,
      );

      expect(status).toBe('expiring_soon');
    });

    it('returns expiring_soon when it expires exactly on the last warning day', () => {
      const status = service.getExpirationStatus(
        itemExpiringOn('2026-10-28'),
        3,
        today,
      );

      expect(status).toBe('expiring_soon');
    });

    it('treats an item that expires today as expiring_soon, not expired', () => {
      const status = service.getExpirationStatus(
        itemExpiringOn('2026-10-25'),
        3,
        today,
      );

      expect(status).toBe('expiring_soon');
    });

    it('returns fresh when it expires after the warning days', () => {
      const status = service.getExpirationStatus(
        itemExpiringOn('2026-11-04'),
        3,
        today,
      );

      expect(status).toBe('fresh');
    });
  });
});