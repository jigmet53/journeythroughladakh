-- Postgres full-text search over destinations (BRD §35/21). Not modeled in
-- schema.prisma (Prisma has no tsvector type) — queried via $queryRaw in
-- SearchModule. Regenerated automatically by Postgres on every insert/update.
ALTER TABLE "destinations"
  ADD COLUMN "search_vector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce("name", '')), 'A') ||
    setweight(to_tsvector('english', coalesce("summary", '')), 'B') ||
    setweight(to_tsvector('english', coalesce("overview", '')), 'C')
  ) STORED;

CREATE INDEX "destinations_search_vector_idx" ON "destinations" USING GIN ("search_vector");
