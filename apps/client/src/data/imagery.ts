import { photos, type PhotoId } from './photos';

export type PhotoSize = 'card' | 'full';

/** Filename suffix per rendition — see data/photos.ts. */
const WIDTH: Record<PhotoSize, number> = { card: 800, full: 1600 };

export function photoSrc(id: PhotoId, size: PhotoSize = 'full'): string {
  return `/images/${id}-${WIDTH[size]}.jpg`;
}

export function photoSrcSet(id: PhotoId): string {
  return `${photoSrc(id, 'card')} 800w, ${photoSrc(id, 'full')} 1600w`;
}

export const HOME_HERO: PhotoId = 'hero-indus-road';

interface Imagery {
  hero: PhotoId;
  /** Extra photos shown in the page's gallery, beyond the hero. */
  gallery: PhotoId[];
}

// Keyed by the seeded slugs (prisma/seed.ts, prisma/seed-packages.ts). A
// destination or package created later has no entry here and falls back to its
// own heroImageUrl, or to the placeholder.
export const destinationImagery: Record<string, Imagery> = {
  'pangong-lake': { hero: 'pangong-lake', gallery: ['pangong-lake-2'] },
  'nubra-valley': { hero: 'nubra-camels', gallery: ['nubra-dunes', 'diskit-monastery'] },
  'leh-palace': { hero: 'leh-palace', gallery: ['shanti-stupa', 'hero-indus-road'] },
  'khardung-la': { hero: 'khardung-la', gallery: ['khardung-la-2'] },
  'thiksey-monastery': { hero: 'thiksey-monastery', gallery: ['thiksey-buddha'] },
  'tso-moriri': { hero: 'tso-moriri', gallery: ['tso-moriri-2'] },
};

export const packageImagery: Record<string, Imagery> = {
  '7-days-ladakh-classic-nubra-pangong': {
    hero: 'pangong-lake',
    gallery: ['leh-palace', 'khardung-la', 'nubra-camels'],
  },
  '5-days-ladakh-quick-escape': {
    hero: 'nubra-dunes',
    gallery: ['leh-palace', 'diskit-monastery', 'pangong-lake-2'],
  },
  '8-days-manali-to-leh-bike-trip': {
    hero: 'baralacha-la',
    gallery: ['lahaul-road', 'khardung-la', 'pangong-lake'],
  },
  '10-days-ladakh-off-beat-tso-moriri-hanle': {
    hero: 'tso-kar',
    gallery: ['tso-moriri', 'tso-moriri-2', 'thiksey-monastery'],
  },
};

export function creditLine(id: PhotoId): string {
  const p = photos[id];
  return `Photo: ${p.author} · ${p.license}`;
}

const TRIP_COVERS: PhotoId[] = [
  'pangong-lake',
  'nubra-camels',
  'tso-moriri',
  'khardung-la',
  'thiksey-monastery',
  'leh-palace',
  'tso-kar',
  'baralacha-la',
];

/** A stable cover photo for a saved trip. Trips have no photo of their own, so
 * hash the id to pick one — the same trip always gets the same picture. */
export function tripCover(seed: string): PhotoId {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return TRIP_COVERS[h % TRIP_COVERS.length];
}
