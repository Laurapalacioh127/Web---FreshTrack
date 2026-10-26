import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsInt,
  Min,
  IsArray,
  ArrayMinSize,
  ArrayUnique,
} from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @IsInt()
  @Min(1)
  prepTimeMins!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  masterProductIds!: number[];
}