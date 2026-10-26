import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoryEntity } from '../entities/inventory.entity';
import { UserEntity } from '../entities/user.entity';
import { MasterCatalogEntity } from '../entities/master-catalog.entity';
import { InventoryService } from '../inventory/inventory.service';
import { InventoryRulesService } from '../inventory/inventory-rules.service';

describe('Propiedad del inventario', () => {
  let service: InventoryService;
  const repository = {
    findOne: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };
  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        InventoryService,
        InventoryRulesService,
        { provide: getRepositoryToken(InventoryEntity), useValue: repository },
        { provide: getRepositoryToken(UserEntity), useValue: {} },
        { provide: getRepositoryToken(MasterCatalogEntity), useValue: {} },
      ],
    }).compile();
    service = module.get(InventoryService);
  });
  it('filtra por ID y propietario en la consulta a la base', async () => {
    repository.findOne.mockResolvedValue({ id: 8 });
    await service.findOne(8, 2);
    expect(repository.findOne).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 8, user: { id: 2 } } }),
    );
  });
  it('no guarda ni borra si el elemento no pertenece al usuario', async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(service.update(8, { quantity: 1 }, 2)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await expect(service.remove(8, 2)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(repository.save).not.toHaveBeenCalled();
    expect(repository.remove).not.toHaveBeenCalled();
  });
});
