import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(2, 100)
  fullName!: string;
}
