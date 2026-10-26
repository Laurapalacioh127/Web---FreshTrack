import { IsIn, IsInt, Min } from 'class-validator';

export class ReviewDonationDto {
  // Provisional: validar el rol no autentica a quien envía este ID.
  @IsInt()
  @Min(1)
  adminId!: number;

  @IsIn(['accepted', 'rejected'])
  status!: 'accepted' | 'rejected';
}
