import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateDonationItemDto } from './create-donation-item.dto';

export class CreateDonationDto {
  // TODO: tomar el donorId del token cuando se implemente el login.
  @IsInt()
  @Min(1)
  donorId!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CreateDonationItemDto)
  items!: CreateDonationItemDto[];
}
