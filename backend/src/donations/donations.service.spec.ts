import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DonationsService } from './donations.service';
import { DonationsRulesService } from './donations-rules.service';
import { DonationOfferEntity } from '../entities/donation-offer.entity';
import { DonationItemEntity } from '../entities/donation-item.entity';
import { InventoryEntity } from '../entities/inventory.entity';
import { UserEntity } from '../entities/user.entity';

function repositoryMock() {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findOneOrFail: jest.fn(),
    create: jest.fn((data) => ({ ...data })),
    save: jest.fn(async (data) =>
      Array.isArray(data) ? data : { ...data, id: data.id ?? 10 },
    ),
  };
}

describe('DonationsService', () => {
  let service: DonationsService;
  let donations: ReturnType<typeof repositoryMock>;
  let inventory: ReturnType<typeof repositoryMock>;
  let users: ReturnType<typeof repositoryMock>;
  let items: ReturnType<typeof repositoryMock>;
  let transaction: jest.Mock;
  const dto = { donorId: 2, items: [{ inventoryId: 3, quantity: 2 }] };
  let offer: DonationOfferEntity;

  beforeEach(async () => {
    donations = repositoryMock();
    inventory = repositoryMock();
    users = repositoryMock();
    items = repositoryMock();
    const repositories = new Map<unknown, unknown>([
      [DonationOfferEntity, donations],
      [InventoryEntity, inventory],
      [DonationItemEntity, items],
      [UserEntity, users],
    ]);
    transaction = jest.fn(async (work) =>
      work({ getRepository: (entity: unknown) => repositories.get(entity) }),
    );
    const module = await Test.createTestingModule({
      providers: [
        DonationsService,
        DonationsRulesService,
        {
          provide: getRepositoryToken(DonationOfferEntity),
          useValue: donations,
        },
        { provide: getRepositoryToken(UserEntity), useValue: users },
        { provide: DataSource, useValue: { transaction } },
      ],
    }).compile();
    service = module.get(DonationsService);
    users.findOneBy.mockResolvedValue({ id: 2, role: 'admin' });
    users.findOneOrFail.mockResolvedValue({ id: 2 });
    inventory.findOne.mockResolvedValue({
      id: 3,
      user: { id: 2 },
      quantity: 5,
      expirationDate: '2099-12-31',
    });
    offer = {
      id: 10,
      donor: { id: 2 },
      donationStatus: 'pending',
      items: [{ inventory: { id: 3 }, quantity: 2 }],
    } as DonationOfferEntity;
    donations.findOne.mockResolvedValue(offer);
    donations.findOneOrFail.mockResolvedValue(offer);
  });

  it('crea la cabecera y sus detalles sin descontar inventario', async () => {
    await expect(service.create(dto)).resolves.toBe(offer);
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(donations.create).toHaveBeenCalledWith(
      expect.objectContaining({ donationStatus: 'pending' }),
    );
    expect(items.save).toHaveBeenCalledWith([
      expect.objectContaining({
        quantity: 2,
        donation: expect.objectContaining({ id: 10 }),
      }),
    ]);
    expect(inventory.save).not.toHaveBeenCalled();
  });
  it('no crea una oferta si el donante no existe', async () => {
    users.findOneBy.mockResolvedValue(null);
    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    expect(transaction).not.toHaveBeenCalled();
  });
  it('no crea la cabecera si falta un alimento', async () => {
    inventory.findOne.mockResolvedValue(null);
    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    expect(donations.save).not.toHaveBeenCalled();
  });
  it('no crea ofertas con alimentos ajenos', async () => {
    users.findOneBy.mockResolvedValue({ id: 9 });
    await expect(service.create({ ...dto, donorId: 9 })).rejects.toThrow(
      ForbiddenException,
    );
    expect(donations.save).not.toHaveBeenCalled();
  });
  it('no crea ofertas con productos repetidos', async () => {
    await expect(
      service.create({ ...dto, items: [...dto.items, ...dto.items] }),
    ).rejects.toThrow(BadRequestException);
    expect(transaction).not.toHaveBeenCalled();
  });
  it('propaga un fallo al guardar los detalles dentro de la transacción', async () => {
    items.save.mockRejectedValue(new Error('database error'));
    await expect(service.create(dto)).rejects.toThrow('database error');
    expect(donations.findOneOrFail).not.toHaveBeenCalled();
  });
  it('filtra por usuario y estado', async () => {
    await service.findAll({ donorId: 2, status: 'pending' });
    expect(donations.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { donor: { id: 2 }, donationStatus: 'pending' },
      }),
    );
  });
  it('permite listar todas las ofertas', async () => {
    await service.findAll({});
    expect(donations.find).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} }),
    );
  });
  it('devuelve una oferta con sus detalles', async () => {
    await expect(service.findOne(10)).resolves.toBe(offer);
  });
  it('responde 404 si la oferta no existe', async () => {
    donations.findOne.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });
  it('acepta y descuenta solo las unidades donadas', async () => {
    await service.review(10, { adminId: 1, status: 'accepted' });
    expect(inventory.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 3, quantity: 3 }),
    );
    expect(donations.save).toHaveBeenCalledWith(
      expect.objectContaining({ donationStatus: 'accepted' }),
    );
    expect(donations.findOne).toHaveBeenCalledWith({
      where: { id: 10 },
      lock: { mode: 'pessimistic_write' },
    });
    expect(inventory.findOne).toHaveBeenCalledWith({
      where: { id: 3 },
      lock: { mode: 'pessimistic_write' },
    });
  });
  it('rechaza sin modificar inventario', async () => {
    await service.review(10, { adminId: 1, status: 'rejected' });
    expect(inventory.save).not.toHaveBeenCalled();
    expect(donations.save).toHaveBeenCalledWith(
      expect.objectContaining({ donationStatus: 'rejected' }),
    );
  });
  it('impide revisar a un usuario que no es admin', async () => {
    users.findOneBy.mockResolvedValue({ id: 2, role: 'user' });
    await expect(
      service.review(10, { adminId: 2, status: 'accepted' }),
    ).rejects.toThrow(ForbiddenException);
    expect(transaction).not.toHaveBeenCalled();
  });
  it('rechaza un administrador inexistente', async () => {
    users.findOneBy.mockResolvedValue(null);
    await expect(
      service.review(10, { adminId: 99, status: 'accepted' }),
    ).rejects.toThrow(NotFoundException);
  });
  it('no revisa una oferta inexistente', async () => {
    donations.findOne.mockResolvedValue(null);
    await expect(
      service.review(99, { adminId: 1, status: 'accepted' }),
    ).rejects.toThrow(NotFoundException);
  });
  it('no descuenta dos veces una oferta ya revisada', async () => {
    offer.donationStatus = 'accepted';
    await expect(
      service.review(10, { adminId: 1, status: 'accepted' }),
    ).rejects.toThrow(ConflictException);
    expect(inventory.save).not.toHaveBeenCalled();
  });
  it('vuelve a comprobar stock al aceptar', async () => {
    inventory.findOne.mockResolvedValue({
      id: 3,
      user: { id: 2 },
      quantity: 1,
      expirationDate: '2099-12-31',
    });
    await expect(
      service.review(10, { adminId: 1, status: 'accepted' }),
    ).rejects.toThrow(BadRequestException);
    expect(donations.save).not.toHaveBeenCalled();
  });
  it('vuelve a comprobar vencimiento al aceptar', async () => {
    inventory.findOne.mockResolvedValue({
      id: 3,
      user: { id: 2 },
      quantity: 5,
      expirationDate: '2000-01-01',
    });
    await expect(
      service.review(10, { adminId: 1, status: 'accepted' }),
    ).rejects.toThrow(BadRequestException);
    expect(inventory.save).not.toHaveBeenCalled();
  });
});
