import { IsIn } from 'class-validator';

export const BOOKING_STATUSES = ['new', 'contacted', 'confirmed', 'cancelled'] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export class UpdateBookingStatusDto {
  @IsIn(BOOKING_STATUSES)
  status!: BookingStatus;
}
