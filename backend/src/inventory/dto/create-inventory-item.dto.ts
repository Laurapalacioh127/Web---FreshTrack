import { IsDateString, IsInt, Max, Min } from 'class-validator';

export class CreateInventoryItemDto {
  @IsInt()
  @Min(1)
  masterProductId!: number;

  @IsInt()
  @Min(1)
  @Max(1000)
  quantity!: number;

  @IsDateString()
  expirationDate!: string;
}
