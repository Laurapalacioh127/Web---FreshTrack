import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    private readonly jwt: JwtService,
    private readonly passwords: PasswordService,
  ) {}

  profile(user: UserEntity) {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
  }

  private async session(user: UserEntity) {
    return {
      accessToken: await this.jwt.signAsync({ sub: user.id }),
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: this.profile(user),
    };
  }

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    if (
      await this.users
        .createQueryBuilder('user')
        .where('LOWER(user.email) = :email', { email })
        .getOne()
    )
      throw new ConflictException('Email already registered');
    const user = this.users.create({
      fullName: dto.fullName,
      email,
      passwordHash: await this.passwords.hash(dto.password),
      role: 'user',
    });
    try {
      await this.users.save(user);
    } catch (error) {
      if (
        (error as { driverError?: { code?: string } }).driverError?.code ===
        '23505'
      ) {
        throw new ConflictException('Email already registered');
      }
      throw error;
    }
    return this.session(user);
  }

  async login(dto: LoginDto) {
    const user = await this.users
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('LOWER(user.email) = :email', {
        email: dto.email.trim().toLowerCase(),
      })
      .getOne();
    // Un usuario antiguo sin contraseña no puede entrar hasta tener una cuenta configurada.
    if (
      !user?.passwordHash ||
      !(await this.passwords.verify(dto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.session(user);
  }
}
