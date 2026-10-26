import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret || Buffer.byteLength(secret) < 32)
          throw new Error('JWT_SECRET must contain at least 32 bytes');
        return {
          secret,
          signOptions: {
            expiresIn: 3600,
            algorithm: 'HS256',
            issuer: 'freshtrack',
            audience: 'freshtrack-api',
          },
          verifyOptions: {
            algorithms: ['HS256'],
            issuer: 'freshtrack',
            audience: 'freshtrack-api',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AuthModule {}
