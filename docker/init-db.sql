-- Runs once when the postgres container's data volume is first created.
-- Prisma's `Unsupported("vector(1024)")` column type does not create the
-- extension itself, so it's enabled here ahead of `prisma migrate dev`.
CREATE EXTENSION IF NOT EXISTS vector;
