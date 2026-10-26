import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { requestValidationPipe } from '../common/request-validation.pipe';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { ModerateRecipeDto } from './dto/moderate-recipe.dto';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  findApproved() {
    return this.recipesService.findApproved();
  }

  @Post()
  create(
    @Body(requestValidationPipe) dto: CreateRecipeDto,
    @Query('authorId', ParseIntPipe) authorId: number,
  ) {
    return this.recipesService.create(dto, authorId);
  }

  @Patch(':id/moderation')
  moderate(
    @Param('id', ParseIntPipe) id: number,
    @Body(requestValidationPipe) dto: ModerateRecipeDto,
    @Query('adminId', ParseIntPipe) adminId: number,
  ) {
    return this.recipesService.moderate(id, dto, adminId);
  }
}
