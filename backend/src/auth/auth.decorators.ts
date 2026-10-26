import { createParamDecorator, SetMetadata } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';

export const Public = () => SetMetadata('auth:public', true);
export const Roles = (...roles: ('user' | 'admin')[]) =>
  SetMetadata('auth:roles', roles);
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest().user,
);
