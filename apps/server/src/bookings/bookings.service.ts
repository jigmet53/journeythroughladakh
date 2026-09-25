import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingRequestDto } from './dto/create-booking-request.dto';
import { BookingStatus } from './dto/update-booking-status.dto';

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_SENDER = 3;
const MAX_OVERALL = 60;
const MAX_TRAVELLERS = 25;
const MAX_DAYS_AHEAD = 730;

// No 0/O, 1/I/L — codes get read out over the phone.
const REF_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const makeReference = () =>
  'JTL-' + Array.from({ length: 6 }, () => REF_ALPHABET[Math.floor(Math.random() * REF_ALPHABET.length)]).join('');

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookingRequestDto) {
    // A filled honeypot means a bot: report success, store nothing.
    if (dto.website) return { ok: true, reference: makeReference() };

    if (dto.adults + dto.children > MAX_TRAVELLERS) {
      throw new BadRequestException(`For groups larger than ${MAX_TRAVELLERS}, please contact us directly.`);
    }

    // Compare calendar dates in UTC so "today" is never rejected by a timezone offset.
    const startDate = new Date(`${dto.startDate}T00:00:00.000Z`);
    if (Number.isNaN(startDate.getTime()) || startDate.toISOString().slice(0, 10) !== dto.startDate) {
      throw new BadRequestException('Please choose a valid start date.');
    }
    const today = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z');
    if (startDate < today) throw new BadRequestException('The start date cannot be in the past.');
    if (startDate.getTime() - today.getTime() > MAX_DAYS_AHEAD * 86_400_000) {
      throw new BadRequestException('Please choose a start date within the next two years.');
    }

    const pkg = await this.prisma.tripPackage.findFirst({
      where: { slug: dto.packageSlug, status: 'published' },
      select: { id: true, slug: true, title: true },
    });
    if (!pkg) throw new NotFoundException('That package is not available.');

    // Database-backed limits (Redis is optional and fails open).
    const since = new Date(Date.now() - WINDOW_MS);
    const email = dto.email.toLowerCase();
    const [fromSender, overall] = await Promise.all([
      this.prisma.bookingRequest.count({ where: { email, createdAt: { gte: since } } }),
      this.prisma.bookingRequest.count({ where: { createdAt: { gte: since } } }),
    ]);
    if (fromSender >= MAX_PER_SENDER || overall >= MAX_OVERALL) {
      throw new HttpException('Too many requests right now. Please try again in an hour.', HttpStatus.TOO_MANY_REQUESTS);
    }

    // Retry on the (very unlikely) chance of a reference collision.
    for (let attempt = 0; attempt < 5; attempt++) {
      const reference = makeReference();
      try {
        await this.prisma.bookingRequest.create({
          data: {
            reference,
            packageId: pkg.id,
            packageSlug: pkg.slug,
            packageTitle: pkg.title,
            name: dto.name,
            email,
            phone: dto.phone,
            adults: dto.adults,
            children: dto.children,
            startDate,
            flexibleDates: dto.flexibleDates,
            startingCity: dto.startingCity ?? null,
            notes: dto.notes ?? null,
          },
        });
        return { ok: true, reference };
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') continue;
        throw err;
      }
    }
    throw new HttpException('Could not create the request. Please try again.', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  list(status?: string) {
    return this.prisma.bookingRequest.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async updateStatus(id: string, status: BookingStatus) {
    try {
      return await this.prisma.bookingRequest.update({ where: { id }, data: { status } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Booking request not found');
      }
      throw err;
    }
  }
}
