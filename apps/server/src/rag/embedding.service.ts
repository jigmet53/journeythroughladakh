import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

const EMBEDDING_MODEL = 'gemini-embedding-001';
export const EMBEDDING_DIMENSIONS = 768;

/**
 * Free-tier embeddings via Gemini (gemini-embedding-001), same provider as
 * chat generation (AiService) — was Voyage AI paired with Claude, switched
 * to keep this project entirely on free-tier APIs. `outputDimensionality`
 * is set to 768 (one of Google's documented reduced-size options — default
 * is 3072) to keep the pgvector column and index reasonably sized.
 */
@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private client: GoogleGenAI | null = null;

  constructor(private readonly config: ConfigService) {}

  private getClient(): GoogleGenAI {
    if (!this.client) {
      const apiKey = this.config.get<string>('GEMINI_API_KEY');
      if (!apiKey) {
        throw new ServiceUnavailableException(
          'GEMINI_API_KEY is not configured — the AI assistant needs it for retrieval.',
        );
      }
      this.client = new GoogleGenAI({ apiKey });
    }
    return this.client;
  }

  async embed(texts: string[], taskType: 'RETRIEVAL_QUERY' | 'RETRIEVAL_DOCUMENT'): Promise<number[][]> {
    try {
      const response = await this.getClient().models.embedContent({
        model: EMBEDDING_MODEL,
        contents: texts,
        config: { taskType, outputDimensionality: EMBEDDING_DIMENSIONS },
      });
      return (response.embeddings ?? []).map((e) => e.values ?? []);
    } catch (err) {
      if (err instanceof ServiceUnavailableException) throw err;
      this.logger.error(`Gemini embeddings request failed: ${(err as Error).message}`);
      throw new ServiceUnavailableException('Embedding provider request failed');
    }
  }

  async embedQuery(text: string): Promise<number[]> {
    const [vector] = await this.embed([text], 'RETRIEVAL_QUERY');
    return vector;
  }
}
