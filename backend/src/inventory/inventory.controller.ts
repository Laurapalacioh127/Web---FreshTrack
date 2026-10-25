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
import { FilterInventoryQueryDto } from './dto/filter-inventory-query.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { InventoryService } from './inventory.service';
import { ExpiringInventoryQueryDto } from './dto/expiring-inventory-query.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body(requestValidationPipe) dto: CreateInventoryItemDto) {
    return this.inventoryService.create(dto);
  }

  @Get()
  findByUser(@Query(requestValidationPipe) query: FilterInventoryQueryDto) {
    return this.inventoryService.findByUser(query);
  }

   @Get('expiring')
  findExpiring(@Query(requestValidationPipe) query: ExpiringInventoryQueryDto) {
    return this.inventoryService.findExpiring(query);
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(requestValidationPipe) dto: UpdateInventoryItemDto,
  ) {
    return this.inventoryService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.remove(id);
  }
}