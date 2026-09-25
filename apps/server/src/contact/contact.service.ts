import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_SENDER = 3;
const MAX_OVERALL = 60;

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactMessageDto) {
    // A filled honeypot means a bot. Report success so it learns nothing, store nothing.
    if (dto.website) return { ok: true };

    // Database-backed limits (Redis is optional here and fails open, so it can't
    // be the only defence): a few per sender per hour, and a global ceiling.
    const since = new Date(Date.now() - WINDOW_MS);
    const email = dto.email.toLowerCase();
    const [fromSender, overall] = await Promise.all([
      this.prisma.contactMessage.count({ where: { email, createdAt: { gte: since } } }),
      this.prisma.contactMessage.count({ where: { createdAt: { gte: since } } }),
    ]);
    if (fromSender >= MAX_PER_SENDER || overall >= MAX_OVERALL) {
      throw new HttpException(
        'Too many messages right now. Please try again in an hour.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.prisma.contactMessage.create({
      data: { name: dto.name, email, topic: dto.topic, message: dto.message },
    });
    return { ok: true };
  }

  list() {
    return this.prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  }
}
