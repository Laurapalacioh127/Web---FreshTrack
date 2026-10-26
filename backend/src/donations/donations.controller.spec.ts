import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { DonationsController } from './donations.controller';
import { DonationsService } from './donations.service';

describe('DonationsController (HTTP con servicio mock)', () => {
  let app: INestApplication;
  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    review: jest.fn(),
  };
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [DonationsController],
      providers: [{ provide: DonationsService, useValue: service }],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });
  beforeEach(() => {
    jest.clearAllMocks();
    service.create.mockResolvedValue({ id: 10, donationStatus: 'pending' });
    service.findAll.mockResolvedValue([]);
    service.findOne.mockResolvedValue({ id: 10 });
    service.review.mockResolvedValue({ id: 10, donationStatus: 'accepted' });
  });
  afterAll(async () => {
    await app.close();
  });

  it('recibe una oferta válida', async () => {
    await request(app.getHttpServer())
      .post('/api/donations')
      .send({ donorId: 2, items: [{ inventoryId: 3, quantity: 2 }] })
      .expect(201);
    expect(service.create).toHaveBeenCalledWith(
      expect.objectContaining({ donorId: 2 }),
    );
  });
  it.each([
    {},
    { donorId: 2, items: [] },
    { donorId: '2', items: [{ inventoryId: 3, quantity: 2 }] },
    { donorId: 2, items: [{ inventoryId: 3, quantity: 0 }] },
    { donorId: 2, items: [{ inventoryId: 3, quantity: 1.5 }] },
    { donorId: 2, items: [{ inventoryId: 3, quantity: 1001 }] },
    { donorId: 2, items: [null] },
    { donorId: 2, items: [{ inventoryId: 3, quantity: 1, extra: true }] },
    {
      donorId: 2,
      items: [{ inventoryId: 3, quantity: 1 }],
      donationStatus: 'accepted',
    },
  ])('rechaza un body inválido: %j', async (body) => {
    await request(app.getHttpServer())
      .post('/api/donations')
      .send(body)
      .expect(400);
    expect(service.create).not.toHaveBeenCalled();
  });
  it('convierte el filtro donorId a número', async () => {
    await request(app.getHttpServer())
      .get('/api/donations?donorId=2&status=pending')
      .expect(200);
    expect(service.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ donorId: 2, status: 'pending' }),
    );
  });
  it.each(['status=completed', 'donorId=abc', 'extra=1'])(
    'rechaza el filtro %s',
    async (query) => {
      await request(app.getHttpServer())
        .get(`/api/donations?${query}`)
        .expect(400);
    },
  );
  it('consulta por ID', async () => {
    await request(app.getHttpServer()).get('/api/donations/10').expect(200);
    expect(service.findOne).toHaveBeenCalledWith(10);
  });
  it('rechaza un ID no numérico', async () => {
    await request(app.getHttpServer()).get('/api/donations/abc').expect(400);
  });
  it('envía la decisión al servicio', async () => {
    await request(app.getHttpServer())
      .patch('/api/donations/10/status')
      .send({ adminId: 1, status: 'accepted' })
      .expect(200);
    expect(service.review).toHaveBeenCalledWith(
      10,
      expect.objectContaining({ adminId: 1, status: 'accepted' }),
    );
  });
  it.each([
    { adminId: 1, status: 'pending' },
    { status: 'accepted' },
    { adminId: 0, status: 'rejected' },
  ])('rechaza una revisión inválida: %j', async (body) => {
    await request(app.getHttpServer())
      .patch('/api/donations/10/status')
      .send(body)
      .expect(400);
    expect(service.review).not.toHaveBeenCalled();
  });
});
