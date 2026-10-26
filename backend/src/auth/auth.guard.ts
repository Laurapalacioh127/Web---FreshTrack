import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targets = [context.getHandler(), context.getClass()];
    if (this.reflector.getAllAndOverride<boolean>('auth:public', targets))
      return true;
    const request = context.switchToHttp().getRequest();
    const match = /^Bearer ([^ ]+)$/i.exec(request.headers.authorization ?? '');
    if (!match) throw new UnauthorizedException('Bearer token required');
    let payload: { sub: number };
    try {
      payload = await this.jwt.verifyAsync(match[1]);
      if (!Number.isSafeInteger(payload.sub) || payload.sub < 1)
        throw new Error('Invalid subject');
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const user = await this.users.findOneBy({ id: payload.sub });
    if (!user) throw new UnauthorizedException('User not found');
    request.user = user;
    const roles = this.reflector.getAllAndOverride<string[]>(
      'auth:roles',
      targets,
    );
    if (roles && !roles.includes(user.role))
      throw new ForbiddenException('Insufficient permissions');
    return true;
  }
}
