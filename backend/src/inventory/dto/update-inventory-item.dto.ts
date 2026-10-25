import { IsDateString, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateInventoryItemDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000)
  quantity?: number;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}
