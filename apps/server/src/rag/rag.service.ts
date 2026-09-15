import { randomUUID } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingService } from './embedding.service';

const CHUNK_MAX_CHARS = 800;
const TOP_K = 5;

export interface RetrievedChunk {
  chunkText: string;
  title: string;
  source: string;
  category: string;
  destinationId: string | null;
  similarity: number;
}

/** Vector literal for pgvector — Prisma has no native vector type
 * (`Unsupported("vector(1024)")` in schema.prisma), so every read/write on
 * `embeddings.vector` goes through raw SQL. Values are always our own
 * generated floats, never user input, but still guarded against NaN/Infinity
 * before being spliced into the query. */
function toVectorLiteral(vector: number[]): string {
  return `[${vector.map((n) => (Number.isFinite(n) ? n : 0)).join(',')}]`;
}

function chunkText(text: string, maxChars = CHUNK_MAX_CHARS): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if (current.length + sentence.length > maxChars && current) {
      chunks.push(current.trim());
      current = '';
    }
    current += (current ? ' ' : '') + sentence;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  /** Rebuilds the RAG knowledge base from current destination content.
   * Idempotent — safe to rerun after editing destinations. */
  async ingestDestinations(): Promise<{ documents: number; chunks: number }> {
    const destinations = await this.prisma.destination.findMany({
      where: { status: 'published' },
      include: { category: true },
    });

    let chunkCount = 0;

    for (const destination of destinations) {
      const content = [
        destination.overview,
        destination.bestTime ? `Best time to visit: ${destination.bestTime}.` : null,
        destination.howToReach ? `How to reach: ${destination.howToReach}.` : null,
        destination.distanceFromLeh != null ? `Distance from Leh: ${destination.distanceFromLeh} km.` : null,
        destination.altitudeMeters != null ? `Altitude: ${destination.altitudeMeters} meters.` : null,
      ]
        .filter(Boolean)
        .join(' ');

      const document = await this.prisma.document.upsert({
        where: { id: `destination:${destination.id}` },
        update: { title: destination.name, content, updatedAt: new Date() },
        create: {
          id: `destination:${destination.id}`,
          destinationId: destination.id,
          source: 'destination',
          category: destination.category?.name ?? 'general',
          title: destination.name,
          content,
        },
      });

      await this.prisma.embedding.deleteMany({ where: { documentId: document.id } });

      const chunks = chunkText(content);
      const vectors = await this.embeddingService.embed(chunks, 'RETRIEVAL_DOCUMENT');

      for (let i = 0; i < chunks.length; i++) {
        await this.prisma.$executeRaw`
          INSERT INTO embeddings (id, document_id, chunk_index, chunk_text, vector, created_at)
          VALUES (${randomUUID()}, ${document.id}, ${i}, ${chunks[i]}, ${toVectorLiteral(vectors[i])}::vector, now())
        `;
        chunkCount++;
      }

      this.logger.log(`Ingested "${destination.name}" — ${chunks.length} chunk(s)`);
    }

    return { documents: destinations.length, chunks: chunkCount };
  }

  async retrieve(query: string, topK = TOP_K): Promise<RetrievedChunk[]> {
    const embedding = await this.embeddingService.embedQuery(query);
    const literal = toVectorLiteral(embedding);

    return this.prisma.$queryRaw<RetrievedChunk[]>(Prisma.sql`
      SELECT
        e.chunk_text AS "chunkText",
        d.title,
        d.source,
        d.category,
        d.destination_id AS "destinationId",
        1 - (e.vector <=> ${literal}::vector) AS similarity
      FROM embeddings e
      JOIN documents d ON d.id = e.document_id
      ORDER BY e.vector <=> ${literal}::vector
      LIMIT ${topK};
    `);
  }
}
