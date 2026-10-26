import { IsInt, Max, Min } from 'class-validator';

export class CreateDonationItemDto {
  @IsInt()
  @Min(1)
  inventoryId!: number;

  @IsInt()
  @Min(1)
  @Max(1000)
  quantity!: number;
}
