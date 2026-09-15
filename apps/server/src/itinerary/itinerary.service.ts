import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ItineraryVisibility } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateItineraryDto } from './dto/generate-itinerary.dto';
import { SaveItineraryDto } from './dto/save-itinerary.dto';
import { generateItineraryDays } from './itinerary-generator';

const itineraryWithDays = {
  itineraryDays: {
    orderBy: { dayNumber: 'asc' as const },
    include: {
      items: {
        orderBy: { order: 'asc' as const },
        include: { destination: true },
      },
    },
  },
};

@Injectable()
export class ItineraryService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public — no auth, nothing persisted. Lets a visitor try the planner
   * before being asked to create an account (BRD.md §15: "a primary
   * conversion feature"). */
  async generate(dto: GenerateItineraryDto) {
    const destinations = await this.prisma.destination.findMany({
      where: { status: 'published' },
    });
    const itineraryDays = generateItineraryDays(destinations, dto);
    return {
      startingCity: dto.startingCity ?? null,
      days: dto.days,
      budget: dto.budget ?? null,
      travelStyle: dto.travelStyle ?? null,
      itineraryDays,
    };
  }

  async create(userId: string, dto: SaveItineraryDto) {
    const itinerary = await this.prisma.itinerary.create({
      data: {
        userId,
        title: dto.title,
        startingCity: dto.startingCity,
        days: dto.days,
        budget: dto.budget,
        travelStyle: dto.travelStyle,
        itineraryDays: {
          create: dto.itineraryDays.map((day) => ({
            dayNumber: day.dayNumber,
            title: day.title,
            notes: day.notes,
            items: {
              create: day.items.map((item) => ({
                destinationId: item.destinationId,
                order: item.order,
                activity: item.activity,
                notes: item.notes,
              })),
            },
          })),
        },
      },
      include: itineraryWithDays,
    });
    return itinerary;
  }

  async findMine(userId: string) {
    return this.prisma.itinerary.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: itineraryWithDays,
    });
  }

  /** Visibility-aware: owner can always read; PUBLIC/UNLISTED are readable
   * by anyone with the id/link (BRD.md §59); PRIVATE requires ownership. */
  async findOne(id: string, requestingUserId: string | null) {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id },
      include: itineraryWithDays,
    });
    if (!itinerary) throw new NotFoundException('Itinerary not found');

    const isOwner = itinerary.userId === requestingUserId;
    if (itinerary.visibility === ItineraryVisibility.PRIVATE && !isOwner) {
      throw new NotFoundException('Itinerary not found');
    }
    return itinerary;
  }

  async update(id: string, userId: string, dto: SaveItineraryDto) {
    await this.assertOwner(id, userId);

    return this.prisma.$transaction(async (tx) => {
      await tx.itineraryDay.deleteMany({ where: { itineraryId: id } });
      return tx.itinerary.update({
        where: { id },
        data: {
          title: dto.title,
          startingCity: dto.startingCity,
          days: dto.days,
          budget: dto.budget,
          travelStyle: dto.travelStyle,
          itineraryDays: {
            create: dto.itineraryDays.map((day) => ({
              dayNumber: day.dayNumber,
              title: day.title,
              notes: day.notes,
              items: {
                create: day.items.map((item) => ({
                  destinationId: item.destinationId,
                  order: item.order,
                  activity: item.activity,
                  notes: item.notes,
                })),
              },
            })),
          },
        },
        include: itineraryWithDays,
      });
    });
  }

  async updateVisibility(id: string, userId: string, visibility: ItineraryVisibility) {
    await this.assertOwner(id, userId);
    return this.prisma.itinerary.update({ where: { id }, data: { visibility } });
  }

  async remove(id: string, userId: string) {
    await this.assertOwner(id, userId);
    await this.prisma.itinerary.delete({ where: { id } });
  }

  private async assertOwner(id: string, userId: string) {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!itinerary) throw new NotFoundException('Itinerary not found');
    if (itinerary.userId !== userId) {
      throw new ForbiddenException("You don't have access to this itinerary");
    }
  }
}
