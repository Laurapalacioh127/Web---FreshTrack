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
import { CreateDonationDto } from './dto/create-donation.dto';
import { FilterDonationsQueryDto } from './dto/filter-donations-query.dto';
import { ReviewDonationDto } from './dto/review-donation.dto';
import { DonationsService } from './donations.service';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  create(@Body(requestValidationPipe) dto: CreateDonationDto) {
    return this.donationsService.create(dto);
  }

  @Get()
  findAll(@Query(requestValidationPipe) query: FilterDonationsQueryDto) {
    return this.donationsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.donationsService.findOne(id);
  }

  @Patch(':id/status')
  review(
    @Param('id', ParseIntPipe) id: number,
    @Body(requestValidationPipe) dto: ReviewDonationDto,
  ) {
    return this.donationsService.review(id, dto);
  }
}
