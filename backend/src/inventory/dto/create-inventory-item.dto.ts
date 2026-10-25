import { IsDateString, IsInt, Max, Min } from 'class-validator';

export class CreateInventoryItemDto {
  // TODO: cuando haya login, el userId saldrá del token y no del body
  @IsInt()
  @Min(1)
  userId!: number;

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