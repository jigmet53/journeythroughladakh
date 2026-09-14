import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { QueryDestinationsDto } from './dto/query-destinations.dto';

const LIST_CACHE_TTL_SECONDS = 300;

@Injectable()
export class DestinationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll(query: QueryDestinationsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const cacheKey = `destinations:list:${query.category ?? 'all'}:${page}:${limit}`;

    const cached = await this.redis.getCache(cacheKey);
    if (cached) return cached;

    const where = query.category ? { category: { slug: query.category } } : {};
    const [items, total] = await Promise.all([
      this.prisma.destination.findMany({
        where,
        include: { category: true },
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.destination.count({ where }),
    ]);

    const result = { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    await this.redis.setCache(cacheKey, result, LIST_CACHE_TTL_SECONDS);
    return result;
  }

  async findBySlug(slug: string) {
    const destination = await this.prisma.destination.findUnique({
      where: { slug },
      include: {
        category: true,
        itineraryItems: false,
      },
    });
    if (!destination) throw new NotFoundException(`Destination "${slug}" not found`);

    const related = await this.prisma.destination.findMany({
      where: { categoryId: destination.categoryId ?? undefined, NOT: { id: destination.id } },
      take: 4,
    });

    return { ...destination, related };
  }

  async create(dto: CreateDestinationDto) {
    const existing = await this.prisma.destination.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Slug "${dto.slug}" already in use`);

    const destination = await this.prisma.destination.create({ data: dto });
    await this.invalidateListCache();
    return destination;
  }

  async update(id: string, dto: UpdateDestinationDto) {
    await this.ensureExists(id);
    const destination = await this.prisma.destination.update({ where: { id }, data: dto });
    await this.invalidateListCache();
    return destination;
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.destination.delete({ where: { id } });
    await this.invalidateListCache();
  }

  async listCategories() {
    return this.prisma.destinationCategory.findMany({ orderBy: { name: 'asc' } });
  }

  private async ensureExists(id: string) {
    const found = await this.prisma.destination.findUnique({ where: { id } });
    if (!found) throw new NotFoundException(`Destination "${id}" not found`);
  }

  private async invalidateListCache() {
    await this.redis.deleteCacheByPattern('destinations:list:*');
  }
}
