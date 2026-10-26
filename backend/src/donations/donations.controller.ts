import { CurrentUser, Roles } from '../auth/auth.decorators';
import type { UserEntity } from '../entities/user.entity';
import { ForbiddenException } from '@nestjs/common';
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
  create(
    @CurrentUser() user: UserEntity,
    @Body(requestValidationPipe) dto: CreateDonationDto,
  ) {
    return this.donationsService.create({ ...dto, donorId: user.id });
  }

  @Get()
  findAll(
    @CurrentUser() user: UserEntity,
    @Query(requestValidationPipe) query: FilterDonationsQueryDto,
  ) {
    return this.donationsService.findAll(
      user.role === 'admin' ? query : { ...query, donorId: user.id },
    );
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const donation = await this.donationsService.findOne(id);
    if (user.role !== 'admin' && donation.donor.id !== user.id)
      throw new ForbiddenException('Donation belongs to another user');
    return donation;
  }

  @Roles('admin')
  @Patch(':id/status')
  review(
    @CurrentUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body(requestValidationPipe) dto: ReviewDonationDto,
  ) {
    return this.donationsService.review(id, { ...dto, adminId: user.id });
  }
}
