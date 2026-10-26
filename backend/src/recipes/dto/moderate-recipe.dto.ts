
import { IsIn } from 'class-validator';

export class ModerateRecipeDto {
  @IsIn(['approved', 'rejected'])
  moderationStatus!: 'approved' | 'rejected';
}
