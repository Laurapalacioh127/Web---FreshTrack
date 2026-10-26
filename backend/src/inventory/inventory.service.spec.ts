import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { jest } from '@jest/globals';
import { InventoryEntity } from '../entities/inventory.entity.js';
import { MasterCatalogEntity } from '../entities/master-catalog.entity.js';
import { UserEntity } from '../entities/user.entity.js';
import { InventoryRulesService } from './inventory-rules.service.js';
import { InventoryService } from './inventory.service.js';

// jest.fn() sin tipos hace que mockResolvedValue exija un valor "never";
// este helper lo deja aceptar cualquier valor
const mockFn = () => jest.fn<(...args: any[]) => any>();

describe('InventoryService', () => {
  let service: InventoryService;

  const inventoryRepositoryMock = {
    create: mockFn(),
    save: mockFn(),
    find: mockFn(),
    findOne: mockFn(),
    merge: mockFn(),
    remove: mockFn(),
  };

  const usersRepositoryMock = {
    findOneBy: mockFn(),
  };

  const catalogRepositoryMock = {
    findOneBy: mockFn(),
  };

  const inventoryRulesServiceMock = {
    getDaysUntilExpiration: mockFn(),
    getExpirationStatus: mockFn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(InventoryEntity),
          useValue: inventoryRepositoryMock,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: usersRepositoryMock,
        },
        {
          provide: getRepositoryToken(MasterCatalogEntity),
          useValue: catalogRepositoryMock,
        },
        {
          provide: InventoryRulesService,
          useValue: inventoryRulesServiceMock,
        },
      ],
    }).compile();

    service = moduleRef.get(InventoryService);
  });

  describe('create', () => {
    const dto = {
      userId: 2,
      masterProductId: 1,
      quantity: 2,
      expirationDate: '2026-11-10',
    };

    it('creates and saves an item when the user and the product exist', async () => {
      // Arrange
      const user = { id: 2, fullName: 'Usuario Demo' } as UserEntity;
      const masterProduct = {
        id: 1,
        productName: 'Leche',
      } as MasterCatalogEntity;
      const createdItem = {
        user,
        masterProduct,
        quantity: 2,
        expirationDate: '2026-11-10',
      } as InventoryEntity;
      const savedItem = { ...createdItem, id: 10 } as InventoryEntity;

      usersRepositoryMock.findOneBy.mockResolvedValue(user);
      catalogRepositoryMock.findOneBy.mockResolvedValue(masterProduct);
      inventoryRepositoryMock.create.mockReturnValue(createdItem);
      inventoryRepositoryMock.save.mockResolvedValue(savedItem);

      // Act
      const result = await service.create(dto);

      // Assert
      expect(usersRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: 2 });
      expect(catalogRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(inventoryRepositoryMock.create).toHaveBeenCalledWith({
        user,
        masterProduct,
        quantity: 2,
        expirationDate: '2026-11-10',
      });
      expect(inventoryRepositoryMock.save).toHaveBeenCalledWith(createdItem);
      expect(result).toEqual(savedItem);
    });

    it('throws NotFoundException and does not save when the user does not exist', async () => {
      // Arrange
      usersRepositoryMock.findOneBy.mockResolvedValue(null);

      // Act and Assert
      await expect(service.create(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(catalogRepositoryMock.findOneBy).not.toHaveBeenCalled();
      expect(inventoryRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('throws NotFoundException and does not save when the catalog product does not exist', async () => {
      // Arrange
      usersRepositoryMock.findOneBy.mockResolvedValue({ id: 2 } as UserEntity);
      catalogRepositoryMock.findOneBy.mockResolvedValue(null);

      // Act and Assert
      await expect(service.create(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(inventoryRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe('findByUser', () => {
    it('requests the items of the user ordered by expiration date', async () => {
      // Arrange
      const items = [{ id: 1 }, { id: 2 }] as InventoryEntity[];
      inventoryRepositoryMock.find.mockResolvedValue(items);

      // Act
      const result = await service.findByUser({ userId: 2 });

      // Assert
      expect(inventoryRepositoryMock.find).toHaveBeenCalledWith({
        where: { user: { id: 2 } },
        relations: { masterProduct: true },
        order: { expirationDate: 'ASC' },
      });
      expect(result).toEqual(items);
    });
  });

  describe('findOne', () => {
    it('returns the item when the id exists', async () => {
      // Arrange
      const item = { id: 7, quantity: 2 } as InventoryEntity;
      inventoryRepositoryMock.findOne.mockResolvedValue(item);

      // Act
      const result = await service.findOne(7);

      // Assert
      expect(result).toEqual(item);
      expect(inventoryRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 7 },
        relations: { masterProduct: true },
      });
    });

    it('throws NotFoundException when the id does not exist', async () => {
      // Arrange
      inventoryRepositoryMock.findOne.mockResolvedValue(null);

      // Act and Assert
      await expect(service.findOne(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('merges the changes into the item and saves it', async () => {
      // Arrange
      const item = { id: 3, quantity: 5 } as InventoryEntity;
      const dto = { quantity: 1 };
      const updatedItem = { id: 3, quantity: 1 } as InventoryEntity;

      inventoryRepositoryMock.findOne.mockResolvedValue(item);
      inventoryRepositoryMock.save.mockResolvedValue(updatedItem);

      // Act
      const result = await service.update(3, dto);

      // Assert
      expect(inventoryRepositoryMock.merge).toHaveBeenCalledWith(item, dto);
      expect(inventoryRepositoryMock.save).toHaveBeenCalledWith(item);
      expect(result).toEqual(updatedItem);
    });

    it('does not merge or save when the item does not exist', async () => {
      // Arrange
      inventoryRepositoryMock.findOne.mockResolvedValue(null);

      // Act and Assert
      await expect(
        service.update(999, { quantity: 1 }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(inventoryRepositoryMock.merge).not.toHaveBeenCalled();
      expect(inventoryRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('removes the item that was found', async () => {
      // Arrange
      const item = { id: 4 } as InventoryEntity;
      inventoryRepositoryMock.findOne.mockResolvedValue(item);
      inventoryRepositoryMock.remove.mockResolvedValue(item);

      // Act
      const result = await service.remove(4);

      // Assert
      expect(inventoryRepositoryMock.remove).toHaveBeenCalledWith(item);
      expect(result).toEqual(item);
    });
  });

  describe('findExpiring', () => {
    it('returns only the items that are not fresh, with their days and status', async () => {
      // Arrange
      const items = [
        {
          id: 1,
          quantity: 1,
          expirationDate: '2026-10-20',
          masterProduct: { productName: 'Pollo' },
        },
        {
          id: 2,
          quantity: 3,
          expirationDate: '2026-12-15',
          masterProduct: { productName: 'Arroz' },
        },
      ] as InventoryEntity[];

      inventoryRepositoryMock.find.mockResolvedValue(items);
      inventoryRulesServiceMock.getDaysUntilExpiration.mockImplementation(
        (item: InventoryEntity) => (item.id === 1 ? -5 : 51),
      );
      inventoryRulesServiceMock.getExpirationStatus.mockImplementation(
        (item: InventoryEntity) => (item.id === 1 ? 'expired' : 'fresh'),
      );

      // Act
      const result = await service.findExpiring({ userId: 1, days: 3 });

      // Assert
      expect(result).toEqual([
        {
          id: 1,
          product: 'Pollo',
          quantity: 1,
          expirationDate: '2026-10-20',
          daysUntilExpiration: -5,
          status: 'expired',
        },
      ]);
      expect(
        inventoryRulesServiceMock.getExpirationStatus,
      ).toHaveBeenCalledWith(items[0], 3);
    });

    it('returns an empty array when the user has no items', async () => {
      // Arrange
      inventoryRepositoryMock.find.mockResolvedValue([]);

      // Act
      const result = await service.findExpiring({ userId: 9999, days: 3 });

      // Assert
      expect(result).toEqual([]);
    });
  });
});