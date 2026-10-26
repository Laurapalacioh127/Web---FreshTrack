import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { requestValidationPipe } from '../common/request-validation.pipe';
import type { UserEntity } from '../entities/user.entity';
import { CurrentUser, Public } from './auth.decorators';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  register(@Body(requestValidationPipe) dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Public()
  @HttpCode(200)
  @Post('login')
  login(@Body(requestValidationPipe) dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Get('me')
  me(@CurrentUser() user: UserEntity) {
    return this.auth.profile(user);
  }
}
