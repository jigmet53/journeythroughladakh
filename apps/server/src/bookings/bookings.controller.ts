import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { BookingsService } from './bookings.service';
import { CreateBookingRequestDto } from './dto/create-booking-request.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

// RolesGuard is registered globally (see AppModule) — @Roles() alone is enough.
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() dto: CreateBookingRequestDto) {
    return this.bookingsService.create(dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get()
  list(@Query('status') status?: string) {
    return this.bookingsService.list(status);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingsService.updateStatus(id, dto.status);
  }
}
