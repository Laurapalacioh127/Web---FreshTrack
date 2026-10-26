import { CurrentUser, Roles } from '../auth/auth.decorators';
import type { UserEntity } from '../entities/user.entity';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
    @CurrentUser() user: UserEntity,
  ) {
    return this.recipesService.create(dto, user.id);
  }

  @Roles('admin')
  @Patch(':id/moderation')
  moderate(
    @Param('id', ParseIntPipe) id: number,
    @Body(requestValidationPipe) dto: ModerateRecipeDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.recipesService.moderate(id, dto, user.id);
  }
}
