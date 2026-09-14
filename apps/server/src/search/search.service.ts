import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface DestinationSearchRow {
  id: string;
  slug: string;
  name: string;
  summary: string;
  heroImageUrl: string | null;
  rank: number;
}

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Postgres full-text search (BRD §35) over the generated `search_vector`
   * column. Semantic (pgvector) fallback for near-miss phrasing — e.g. "blue
   * lake near Leh" matching "Pangong Lake" — lands with the RAG embeddings
   * pipeline (M5), which populates the same `embeddings` table this would
   * query against.
   */
  async search(q: string) {
    const rows = await this.prisma.$queryRaw<DestinationSearchRow[]>(Prisma.sql`
      SELECT
        id,
        slug,
        name,
        summary,
        hero_image_url AS "heroImageUrl",
        ts_rank(search_vector, websearch_to_tsquery('english', ${q})) AS rank
      FROM destinations
      WHERE search_vector @@ websearch_to_tsquery('english', ${q})
      ORDER BY rank DESC
      LIMIT 20;
    `);

    return { query: q, results: rows };
  }
}
