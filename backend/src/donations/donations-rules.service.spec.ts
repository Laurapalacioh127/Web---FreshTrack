import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { DonationsRulesService } from './donations-rules.service';
import { InventoryEntity } from '../entities/inventory.entity';
import { UserEntity } from '../entities/user.entity';
import { DonationOfferEntity } from '../entities/donation-offer.entity';

describe('DonationsRulesService', () => {
  const rules = new DonationsRulesService();
  const today = new Date(2026, 9, 25, 12);
  const item = {
    user: { id: 2 },
    quantity: 5,
    expirationDate: '2026-10-25',
  } as InventoryEntity;

  it('permite donar el día del vencimiento y usar todo el stock', () => {
    expect(() => rules.validateItem(item, 2, 5, today)).not.toThrow();
  });
  it('rechaza alimentos vencidos', () => {
    expect(() =>
      rules.validateItem(
        { ...item, expirationDate: '2026-10-24' },
        2,
        1,
        today,
      ),
    ).toThrow(BadRequestException);
  });
  it('rechaza alimentos de otro usuario', () => {
    expect(() => rules.validateItem(item, 3, 1, today)).toThrow(
      ForbiddenException,
    );
  });
  it.each([0, -1, 1.5, 6])('rechaza la cantidad %s', (quantity) => {
    expect(() => rules.validateItem(item, 2, quantity, today)).toThrow(
      BadRequestException,
    );
  });
  it('rechaza alimentos repetidos en la oferta', () => {
    expect(() =>
      rules.validateUniqueItems([
        { inventoryId: 1, quantity: 1 },
        { inventoryId: 1, quantity: 2 },
      ]),
    ).toThrow(BadRequestException);
  });
  it('acepta alimentos distintos', () => {
    expect(() =>
      rules.validateUniqueItems([
        { inventoryId: 1, quantity: 1 },
        { inventoryId: 2, quantity: 2 },
      ]),
    ).not.toThrow();
  });
  it('permite revisar a un administrador', () => {
    expect(() =>
      rules.validateAdmin({ role: 'admin' } as UserEntity),
    ).not.toThrow();
  });
  it('impide revisar a un usuario normal', () => {
    expect(() => rules.validateAdmin({ role: 'user' } as UserEntity)).toThrow(
      ForbiddenException,
    );
  });
  it.each(['accepted', 'rejected'] as const)(
    'no vuelve a revisar una oferta %s',
    (donationStatus) => {
      expect(() =>
        rules.validatePending({ donationStatus } as DonationOfferEntity),
      ).toThrow(ConflictException);
    },
  );
  it('permite revisar una oferta pendiente', () => {
    expect(() =>
      rules.validatePending({
        donationStatus: 'pending',
      } as DonationOfferEntity),
    ).not.toThrow();
  });
});
