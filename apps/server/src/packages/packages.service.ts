import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

const dayInclude = {
  days_: { orderBy: { dayNumber: 'asc' as const }, include: { destination: true } },
};

// `days_` is a Prisma-relation-name artifact (the count field `days` already
// took the natural name) — never expose it in an API response, always
// reshape to `itinerary` first, matching the create/update DTO field name.
function toApiShape<T extends { days_: unknown }>({ days_, ...rest }: T) {
  return { ...rest, itinerary: days_ };
}

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tripPackage.findMany({
      where: { status: 'published' },
      orderBy: { days: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    const pkg = await this.prisma.tripPackage.findUnique({
      where: { slug },
      include: dayInclude,
    });
    if (!pkg) throw new NotFoundException(`Package "${slug}" not found`);
    return toApiShape(pkg);
  }

  async create(dto: CreatePackageDto) {
    const existing = await this.prisma.tripPackage.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Slug "${dto.slug}" already in use`);

    const { itinerary, ...rest } = dto;
    const created = await this.prisma.tripPackage.create({
      data: {
        ...rest,
        days_: { create: itinerary },
      },
      include: dayInclude,
    });
    return toApiShape(created);
  }

  async update(id: string, dto: UpdatePackageDto) {
    await this.ensureExists(id);
    const { itinerary, ...rest } = dto;

    if (itinerary) {
      const updated = await this.prisma.$transaction(async (tx) => {
        await tx.tripPackageDay.deleteMany({ where: { packageId: id } });
        return tx.tripPackage.update({
          where: { id },
          data: { ...rest, days_: { create: itinerary } },
          include: dayInclude,
        });
      });
      return toApiShape(updated);
    }

    const updated = await this.prisma.tripPackage.update({
      where: { id },
      data: rest,
      include: dayInclude,
    });
    return toApiShape(updated);
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.tripPackage.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const found = await this.prisma.tripPackage.findUnique({ where: { id } });
    if (!found) throw new NotFoundException(`Package "${id}" not found`);
  }
}
