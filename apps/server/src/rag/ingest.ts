import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RagService } from './rag.service';

/** Standalone script — `npm run rag:ingest`. Rebuilds the RAG knowledge
 * base from current destination content. Rerun after editing destinations. */
async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['log', 'warn', 'error'] });
  const rag = app.get(RagService);
  const result = await rag.ingestDestinations();
  // eslint-disable-next-line no-console
  console.log(`Ingested ${result.documents} document(s), ${result.chunks} chunk(s).`);
  await app.close();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('RAG ingestion failed:', err);
  process.exit(1);
});
