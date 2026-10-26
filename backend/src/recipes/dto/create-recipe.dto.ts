import { IsString, IsNotEmpty, MaxLength, IsInt, Min } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @IsInt()
  @Min(1)
  prepTimeMins!: number;
}
