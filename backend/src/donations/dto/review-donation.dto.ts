import { IsIn } from 'class-validator';

export class ReviewDonationDto {
  @IsIn(['accepted', 'rejected'])
  status!: 'accepted' | 'rejected';
}
