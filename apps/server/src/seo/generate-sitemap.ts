import { mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';

/**
 * `npm run seo:generate` — writes sitemap.xml and robots.txt into
 * apps/client/public (served as static files by Vite/CDN). Run at build or
 * deploy time; rerun whenever destinations/packages are added or removed.
 * SITE_URL must be the real production origin when deploying — it defaults
 * to the local dev origin so the output is valid but not production-ready.
 */
const SITE_URL = (process.env.SITE_URL ?? 'http://localhost:5173').replace(/\/$/, '');
const OUT_DIR = resolve(__dirname, '../../../client/public');

const STATIC_PATHS = ['/', '/places', '/packages', '/planner', '/ai', '/guide', '/faq', '/about', '/contact', '/privacy', '/terms', '/credits'];

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function main() {
  const prisma = new PrismaClient();
  try {
    const [destinations, packages] = await Promise.all([
      prisma.destination.findMany({ where: { status: 'published' }, select: { slug: true, updatedAt: true } }),
      prisma.tripPackage.findMany({ where: { status: 'published' }, select: { slug: true, updatedAt: true } }),
    ]);

    const entries = [
      ...STATIC_PATHS.map((path) => ({ loc: path, lastmod: undefined as Date | undefined })),
      ...destinations.map((d) => ({ loc: `/places/${d.slug}`, lastmod: d.updatedAt })),
      ...packages.map((p) => ({ loc: `/packages/${p.slug}`, lastmod: p.updatedAt })),
    ];

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...entries.map(
        (e) =>
          `  <url><loc>${escapeXml(SITE_URL + e.loc)}</loc>${
            e.lastmod ? `<lastmod>${e.lastmod.toISOString()}</lastmod>` : ''
          }</url>`,
      ),
      '</urlset>',
      '',
    ].join('\n');

    // Auth-gated and per-user pages are excluded — nothing there is crawlable content.
    const robots = [
      'User-agent: *',
      'Allow: /',
      'Disallow: /account',
      'Disallow: /admin',
      'Disallow: /login',
      'Disallow: /register',
      'Disallow: /itineraries/',
      '',
      `Sitemap: ${SITE_URL}/sitemap.xml`,
      '',
    ].join('\n');

    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(resolve(OUT_DIR, 'sitemap.xml'), xml);
    writeFileSync(resolve(OUT_DIR, 'robots.txt'), robots);
    // eslint-disable-next-line no-console
    console.log(`Wrote sitemap.xml (${entries.length} URLs) and robots.txt to ${OUT_DIR} for ${SITE_URL}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
