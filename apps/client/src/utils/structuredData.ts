import type { Destination, TripPackageDetail } from '../types/api';

const ORIGIN = () => (typeof window !== 'undefined' ? window.location.origin : '');

export function buildWebSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Journey Through Ladakh',
    url: ORIGIN(),
    description:
      "A digital travel companion for Ladakh — destination knowledge, an itinerary planner, and an AI assistant grounded in verified local information.",
  };
}

export function buildBreadcrumbList(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${ORIGIN()}${item.path}`,
    })),
  };
}

export function buildTouristDestination(destination: Destination) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.name,
    description: destination.summary,
    url: `${ORIGIN()}/places/${destination.slug}`,
    ...(destination.latitude != null && destination.longitude != null
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: destination.latitude,
            longitude: destination.longitude,
          },
        }
      : {}),
  };
}

export function buildTouristTrip(pkg: TripPackageDetail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.title,
    description: pkg.summary,
    url: `${ORIGIN()}/packages/${pkg.slug}`,
    itinerary: {
      '@type': 'ItemList',
      itemListElement: pkg.itinerary.map((day) => ({
        '@type': 'ListItem',
        position: day.dayNumber,
        name: day.title,
        description: day.description,
      })),
    },
  };
}
