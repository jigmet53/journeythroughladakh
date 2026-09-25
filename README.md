# Journey Through Ladakh 2.0

A travel-intelligence platform for Ladakh: destination knowledge, hand-picked trip packages with route diagrams, a day-by-day itinerary planner, interactive maps, and an AI assistant grounded in the platform's own destination data.

Built to the spec in [BRD.md](BRD.md) (MVP scope, §83). Not a booking site — packages are editorial route guides, and there is no payment or reservation flow.

## Features

| Area | What it does |
|---|---|
| **Destinations** | Browse by category, full-text search ("blue lake" → Pangong Lake), detail pages with a Leaflet map, altitude, distance from Leh, best time |
| **Trip packages** | Four researched, hand-picked routes (5-day quick escape, 7-day Nubra–Pangong classic, 8-day Manali–Leh bike trip, 10-day Tso Moriri & Hanle) with a route-at-a-glance chip flow, a day-by-day timeline (distance, drive time, altitude), permit rules, and acclimatization notes |
| **Trip planner** | Rule-based day-by-day generator from your inputs (days, interests, fitness level); usable without an account, saved trips need one. Edit days/stops, add notes, share as private / unlisted / public |
| **AI assistant** | Streaming chat over the platform's data: RAG retrieval (pgvector) + tool calling (`get_destination`, `get_itinerary`). It is instructed to refuse rather than guess on live weather, road status, and permits |
| **Accounts** | Email/password, short-lived access token + rotating httpOnly refresh cookie with reuse detection |
| **SEO** | Per-page meta/OG/Twitter, JSON-LD (`TouristDestination`, `TouristTrip`, `BreadcrumbList`, `WebSite`), generated `sitemap.xml` / `robots.txt` |

## Stack

- **Client** — React 18, TypeScript (strict), Vite, Tailwind, TanStack Query, Zustand, React Hook Form + Zod, Framer Motion, React Router, Leaflet, react-helmet-async
- **Server** — NestJS 10, Prisma 5, PostgreSQL 16 + pgvector, Passport JWT, optional Redis (ioredis)
- **AI** — Google Gemini free tier via `@google/genai`: `gemini-2.5-flash` for chat, `gemini-embedding-001` (768 dims) for embeddings. One key for both.

## Repository layout

```
apps/
├── server/            NestJS API
│   ├── prisma/        schema, migrations, seed scripts
│   └── src/           auth, users, destinations, search, itinerary, packages, rag, ai, seo, redis, prisma
└── client/            React app
    └── src/           app (providers, router), pages, components, services, stores, types, utils
docker-compose.yml     Postgres (pgvector) + Redis, for machines that can run Docker
```

## Getting started

**Requirements:** Node 20+ (developed on 22; the server relies on global `fetch`), PostgreSQL 16 with the `pgvector` extension, a free [Gemini API key](https://aistudio.google.com/apikey) for the AI features. Redis is optional.

### 1. Database

Either use Docker:

```bash
docker compose up -d        # Postgres+pgvector on :5432, Redis on :6379
```

or any local PostgreSQL 16 with pgvector available (for example [Postgres.app](https://postgresapp.com), which bundles it). Create a database named `journey_through_ladakh`. The first migration runs `CREATE EXTENSION vector` itself.

### 2. Server

```bash
cd apps/server
cp .env.example .env         # then edit: JWT secrets, DATABASE_URL, GEMINI_API_KEY
npm install
npx prisma migrate deploy    # applies migrations (non-interactive)
npx prisma generate
npm run prisma:seed          # categories + 6 destinations
npm run prisma:seed-packages # 4 trip packages
npm run rag:ingest           # embeds destinations for the AI (needs GEMINI_API_KEY)
npm run build && npm start   # API on http://localhost:5000
```

Use `npm run start:dev` for watch mode.

### 3. Client

```bash
cd apps/client
npm install
npm run dev                  # http://localhost:5173, proxies /api to :5000
```

### Environment variables (`apps/server/.env`)

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Use long random values, different per environment |
| `CLIENT_URL` | Allowed CORS origin (strict allowlist, no wildcard) |
| `GEMINI_API_KEY` | Chat + embeddings. Without it the app still runs; the assistant returns a graceful error |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` | Optional — see below |

The client needs no env for local dev; set `VITE_API_URL` only if the API isn't reachable at `/api`.

## Useful scripts (`apps/server`)

| Script | Purpose |
|---|---|
| `npm run rag:ingest` | Rebuild the AI knowledge base from current destinations. Idempotent — rerun after editing destinations |
| `SITE_URL=https://your.domain npm run seo:generate` | Write `sitemap.xml` + `robots.txt` into `apps/client/public`. Output embeds `SITE_URL`, so it's gitignored; regenerate per environment |
| `npm run prisma:seed`, `prisma:seed-packages` | Idempotent content seeds |

## API overview

Public unless noted. Everything is under `/api`.

| Route | Notes |
|---|---|
| `POST /auth/register`, `/login`, `/refresh`, `/logout`, `/logout-all` · `GET /auth/me` · `PATCH /auth/update-password` | Login is rate-limited (needs Redis) |
| `GET /destinations`, `/destinations/categories`, `/destinations/:slug` | Writes require EDITOR+ (delete: ADMIN+) |
| `POST /search` | Postgres full-text search |
| `GET /packages`, `/packages/:slug` | Writes require EDITOR+ (delete: ADMIN+) |
| `POST /itineraries/generate` | Public preview, nothing persisted |
| `POST/GET/PATCH/DELETE /itineraries…` | Auth required; `GET /itineraries/:id` also serves shared (unlisted/public) trips anonymously |
| `POST /ai/chat` | Server-sent events: `text`, `tool_use`, `done`, `error` |

## Known limitations

- **Redis is optional and degrades gracefully.** Without it, auth and reads still work, but instant access-token revocation on logout, the session cache, and login-attempt throttling are inactive. Run Redis before any real deployment.
- **Client-rendered SPA, no prerendering.** Meta tags and JSON-LD help crawlers that execute JavaScript (Google); crawlers that don't will see only the shell. BRD.md §81 calls for prerendering — not built yet.
- **No admin UI.** Destinations and packages are managed through the API (EDITOR/ADMIN token) and seed scripts.
- **The AI has no live data.** No weather, road-status, or permit feeds exist, and it is instructed not to guess. Package pages likewise carry rules that change (permits, highway opening dates) — confirm with local authorities before travelling.
- **Free-tier AI.** Gemini's free tier returns occasional `503 high demand`; the server retries silently only while no text has been streamed yet for that turn.
- Registration always creates a `USER`; promoting to EDITOR/ADMIN is a manual database update.

## Out of scope (BRD Phase 2 / 3)

Not implemented, by design: hotels, restaurants, experiences, live weather, road intelligence, offline/PWA mode, admin CMS UI, notifications, multilingual content, reviews/community, partner and booking integrations. Saved trips and sharing (listed under Phase 2) were delivered early as part of the planner.
