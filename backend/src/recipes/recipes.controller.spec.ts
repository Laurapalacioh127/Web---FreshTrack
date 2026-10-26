import { jest } from '@jest/globals';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

describe('RecipesController - HTTP', () => {
  let app: INestApplication;

  const service = {
    findApproved: jest.fn<() => Promise<unknown[]>>(),
    create: jest.fn<() => Promise<unknown>>(),
    moderate: jest.fn<() => Promise<unknown>>(),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [{ provide: RecipesService, useValue: service }],
    }).compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(
      (
        req: { user?: unknown; method: string },
        _res: unknown,
        next: () => void,
      ) => {
        req.user =
          req.method === 'PATCH'
            ? { id: 5, role: 'admin' }
            : { id: 2, role: 'user' };
        next();
      },
    );
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    service.findApproved.mockResolvedValue([]);
    service.create.mockResolvedValue({
      id: 1,
      moderationStatus: 'pending',
    });
    service.moderate.mockResolvedValue({
      id: 1,
      moderationStatus: 'approved',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET returns approved recipes', async () => {
    await request(app.getHttpServer()).get('/api/recipes').expect(200);

    expect(service.findApproved).toHaveBeenCalled();
  });

  it('POST creates a valid recipe', async () => {
    await request(app.getHttpServer())
      .post('/api/recipes')
      .send({
        title: 'Arroz con verduras',
        prepTimeMins: 25,
        masterProductIds: [3],
      })
      .expect(201);

    expect(service.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Arroz con verduras',
      }),
      2,
    );
  });

  it('POST rejects missing ingredients', async () => {
    await request(app.getHttpServer())
      .post('/api/recipes')
      .send({
        title: 'Arroz',
        prepTimeMins: 20,
        masterProductIds: [],
      })
      .expect(400);

    expect(service.create).not.toHaveBeenCalled();
  });

  it('PATCH approves a pending recipe', async () => {
    await request(app.getHttpServer())
      .patch('/api/recipes/1/moderation')
      .send({ moderationStatus: 'approved' })
      .expect(200);

    expect(service.moderate).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        moderationStatus: 'approved',
      }),
      5,
    );
  });

  it('PATCH rejects an invalid moderation status', async () => {
    await request(app.getHttpServer())
      .patch('/api/recipes/1/moderation')
      .send({ moderationStatus: 'pending' })
      .expect(400);

    expect(service.moderate).not.toHaveBeenCalled();
  });
});
