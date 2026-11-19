import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { jest } from '@jest/globals';
import { MasterCatalogEntity } from '../entities/master-catalog.entity.js';
import { CatalogService } from './catalog.service.js';

describe('CatalogService', () => {
  const repositoryMock = { find: jest.fn<(...args: any[]) => any>() };
  let service: CatalogService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        CatalogService,
        {
          provide: getRepositoryToken(MasterCatalogEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();
    service = moduleRef.get(CatalogService);
  });

  it('lists the catalog ordered by category and name', async () => {
    const products = [{ id: 1, productName: 'Leche', category: 'Lácteos' }];
    repositoryMock.find.mockResolvedValue(products);

    const result = await service.findAll();

    expect(result).toEqual(products);
    expect(repositoryMock.find).toHaveBeenCalledWith({
      order: { category: 'ASC', productName: 'ASC' },
    });
  });
});