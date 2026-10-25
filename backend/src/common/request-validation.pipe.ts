import { ValidationPipe } from '@nestjs/common';

export const requestValidationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
});