import { RecipesController } from '../recipes/recipes.controller';
import { RecipesService } from '../recipes/recipes.service';
import type { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { AuthModule } from './auth.module';
import { PasswordService } from './password.service';
import { UserEntity } from '../entities/user.entity';
import { DonationsController } from '../donations/donations.controller';
import { DonationsService } from '../donations/donations.service';
import { InventoryController } from '../inventory/inventory.controller';
import { InventoryService } from '../inventory/inventory.service';

// HTTP real con guard y JWT reales; solo se simulan los repositorios y servicios de negocio.
describe('Auth e integración con los módulos', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let passwordService: PasswordService;
  let users: UserEntity[];
  let userToken: string;
  let adminToken: string;
  const secret = 'test-secret-only-012345678901234567890123456789';
  const recipes = {
    create: jest.fn(),
    moderate: jest.fn(),
    findApproved: jest.fn(),
  };
  const donations = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    review: jest.fn(),
  };
  const inventory = {
    create: jest.fn(),
    findByUser: jest.fn(),
    findExpiring: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const repository = {
    create: (data: Partial<UserEntity>) => ({ ...data, id: 3 }),
    save: jest.fn(async (user: UserEntity) => {
      users.push(user);
      return user;
    }),
    findOneBy: jest.fn(
      async ({ id }: { id: number }) =>
        users.find((user) => user.id === id) ?? null,
    ),
    createQueryBuilder: () => {
      let email: string;
      const query = {
        addSelect: () => query,
        where: (_sql: string, params: { email: string }) => {
          email = params.email;
          return query;
        },
        getOne: async () =>
          users.find((user) => user.email.toLowerCase() === email) ?? null,
      };
      return query;
    },
  };
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [() => ({ JWT_SECRET: secret })],
        }),
        AuthModule,
      ],
      controllers: [
        DonationsController,
        InventoryController,
        RecipesController,
      ],
      providers: [
        { provide: RecipesService, useValue: recipes },
        { provide: DonationsService, useValue: donations },
        { provide: InventoryService, useValue: inventory },
      ],
    })
      .overrideProvider(getRepositoryToken(UserEntity))
      .useValue(repository)
      .compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    jwt = module.get(JwtService);
    passwordService = module.get(PasswordService);
  });
  beforeEach(async () => {
    jest.clearAllMocks();
    users = [
      {
        id: 1,
        fullName: 'Admin',
        email: 'admin@test.com',
        role: 'admin',
        passwordHash: null,
      } as UserEntity,
      {
        id: 2,
        fullName: 'Usuario',
        email: 'user@test.com',
        role: 'user',
        passwordHash: null,
      } as UserEntity,
    ];
    userToken = await jwt.signAsync({ sub: 2 });
    adminToken = await jwt.signAsync({ sub: 1 });
    donations.findOne.mockResolvedValue({ id: 10, donor: { id: 2 } });
    donations.findAll.mockResolvedValue([]);
    donations.review.mockResolvedValue({ donationStatus: 'accepted' });
  });
  afterAll(async () => {
    await app.close();
  });
  it('registra, normaliza el correo, guarda hash y permite login', async () => {
    const credentials = {
      email: ' NUEVO@test.com ',
      password: 'UnaClaveSegura123!',
    };
    const registered = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ ...credentials, fullName: 'Nuevo Usuario' })
      .expect(201);
    expect(registered.body.user).toEqual({
      id: 3,
      fullName: 'Nuevo Usuario',
      email: 'nuevo@test.com',
      role: 'user',
    });
    expect(JSON.stringify(registered.body)).not.toContain('password');
    expect(users[2].passwordHash).not.toContain(credentials.password);
    expect(
      await passwordService.verify(
        credentials.password,
        users[2].passwordHash!,
      ),
    ).toBe(true);
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(credentials)
      .expect(200);
    await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .expect(200);
  });
  it.each([
    { email: 'mal', password: 'password123', fullName: 'Nombre' },
    { email: 'nuevo@test.com', password: 'corta', fullName: 'Nombre' },
    {
      email: 'nuevo@test.com',
      password: 'password123',
      fullName: 'Nombre',
      role: 'admin',
    },
    { email: 'nuevo@test.com', password: 'password123', fullName: ' ' },
  ])('valida registro %j', async (body) => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(body)
      .expect(400);
    expect(repository.save).not.toHaveBeenCalled();
  });
  it('rechaza correo existente sin distinguir mayúsculas', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'USER@test.com',
        password: 'password123',
        fullName: 'Nombre',
      })
      .expect(409);
  });
  it('rechaza contraseña incorrecta, cuenta desconocida y cuenta antigua', async () => {
    users[1].passwordHash = await passwordService.hash('correct-password');
    for (const email of [
      'user@test.com',
      'unknown@test.com',
      'admin@test.com',
    ]) {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email, password: 'wrong-password' })
        .expect(401);
    }
  });
  it('usa sal distinta y rechaza hashes dañados', async () => {
    expect(await passwordService.hash('password123')).not.toBe(
      await passwordService.hash('password123'),
    );
    expect(await passwordService.verify('password123', 'invalid')).toBe(false);
  });
  it('requiere token en todos los módulos', async () => {
    for (const path of ['auth/me', 'inventory', 'donations', 'recipes']) {
      await request(app.getHttpServer()).get(`/api/${path}`).expect(401);
    }
  });
  it('rechaza tokens falsos, vencidos, de otra audiencia y de usuarios borrados', async () => {
    const tokens = [
      'fake',
      await jwt.signAsync({ sub: 2 }, { expiresIn: -1 }),
      await jwt.signAsync({ sub: 2 }, { audience: 'other' }),
      await jwt.signAsync({ sub: 2 }, { secret: 'another-secret' }),
      await jwt.signAsync({ sub: 999 }),
    ];
    for (const token of tokens)
      await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
  });
  it('solo permite al administrador revisar donaciones y toma su ID del token', async () => {
    await request(app.getHttpServer())
      .patch('/api/donations/10/status')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'accepted' })
      .expect(403);
    expect(donations.review).not.toHaveBeenCalled();
    await request(app.getHttpServer())
      .patch('/api/donations/10/status')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'accepted' })
      .expect(200);
    expect(donations.review).toHaveBeenCalledWith(10, {
      adminId: 1,
      status: 'accepted',
    });
    users[0].role = 'user';
    await request(app.getHttpServer())
      .patch('/api/donations/10/status')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'accepted' })
      .expect(403);
  });
  it('ignora filtros de otro donante para usuarios normales y bloquea su detalle', async () => {
    await request(app.getHttpServer())
      .get('/api/donations?donorId=1')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
    expect(donations.findAll).toHaveBeenCalledWith({ donorId: 2 });
    donations.findOne.mockResolvedValue({ id: 10, donor: { id: 1 } });
    await request(app.getHttpServer())
      .get('/api/donations/10')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
    await request(app.getHttpServer())
      .get('/api/donations/10')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
  it('rechaza suplantación por body y usa al donante autenticado', async () => {
    const body = { items: [{ inventoryId: 3, quantity: 1 }] };
    await request(app.getHttpServer())
      .post('/api/donations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ ...body, donorId: 1 })
      .expect(400);
    await request(app.getHttpServer())
      .post('/api/donations')
      .set('Authorization', `Bearer ${userToken}`)
      .send(body)
      .expect(201);
    expect(donations.create).toHaveBeenCalledWith({ ...body, donorId: 2 });
  });
  it('pasa el propietario autenticado al inventario al consultar, editar y borrar', async () => {
    await request(app.getHttpServer())
      .get('/api/inventory/5')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
    expect(inventory.findOne).toHaveBeenCalledWith(5, 2);
    await request(app.getHttpServer())
      .patch('/api/inventory/5')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 2 })
      .expect(200);
    expect(inventory.update).toHaveBeenCalledWith(5, { quantity: 2 }, 2);
    await request(app.getHttpServer())
      .delete('/api/inventory/5')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
    expect(inventory.remove).toHaveBeenCalledWith(5, 2);
  });
  it('crea recetas con el autor del token aunque llegue otro ID en la URL', async () => {
    const body = { title: 'Arroz', prepTimeMins: 20, masterProductIds: [1] };
    await request(app.getHttpServer())
      .post('/api/recipes?authorId=1')
      .set('Authorization', `Bearer ${userToken}`)
      .send(body)
      .expect(201);
    expect(recipes.create).toHaveBeenCalledWith(body, 2);
  });
  it('solo permite moderar recetas al administrador autenticado', async () => {
    const body = { moderationStatus: 'approved' };
    await request(app.getHttpServer())
      .patch('/api/recipes/10/moderation?adminId=1')
      .set('Authorization', `Bearer ${userToken}`)
      .send(body)
      .expect(403);
    expect(recipes.moderate).not.toHaveBeenCalled();
    await request(app.getHttpServer())
      .patch('/api/recipes/10/moderation?adminId=999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(body)
      .expect(200);
    expect(recipes.moderate).toHaveBeenCalledWith(10, body, 1);
  });
});
