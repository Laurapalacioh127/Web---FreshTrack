import { CurrentUser } from '../auth/auth.decorators';
import type { UserEntity } from '../entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { requestValidationPipe } from '../common/request-validation.pipe';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { InventoryService } from './inventory.service';
import { ExpiringInventoryQueryDto } from './dto/expiring-inventory-query.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(
    @CurrentUser() user: UserEntity,
    @Body(requestValidationPipe) dto: CreateInventoryItemDto,
  ) {
    return this.inventoryService.create({ ...dto, userId: user.id });
  }

  @Get()
  findByUser(@CurrentUser() user: UserEntity) {
    return this.inventoryService.findByUser({ userId: user.id });
  }

  @Get('expiring')
  findExpiring(
    @CurrentUser() user: UserEntity,
    @Query(requestValidationPipe) query: ExpiringInventoryQueryDto,
  ) {
    return this.inventoryService.findExpiring({ ...query, userId: user.id });
  }
  @Get(':id')
  findOne(
    @CurrentUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.inventoryService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body(requestValidationPipe) dto: UpdateInventoryItemDto,
  ) {
    return this.inventoryService.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.inventoryService.remove(id, user.id);
  }
}
