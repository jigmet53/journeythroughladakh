import { Link } from 'react-router-dom';

export interface DestinationCardData {
  id: string;
  slug: string;
  name: string;
  summary: string;
  heroImageUrl: string | null;
  categoryName?: string | null;
  altitudeMeters?: number | null;
}

export function DestinationCard({ destination }: { destination: DestinationCardData }) {
  return (
    <Link
      to={`/places/${destination.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-stone/10 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-sand/40">
        {destination.heroImageUrl ? (
          <img
            src={destination.heroImageUrl}
            alt={destination.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone/40">
            {destination.name}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {destination.categoryName && (
          <span className="text-xs font-medium uppercase tracking-wide text-accent">
            {destination.categoryName}
          </span>
        )}
        <h3 className="font-display text-lg font-semibold text-stone">{destination.name}</h3>
        <p className="line-clamp-2 text-sm text-stone/70">{destination.summary}</p>
        {destination.altitudeMeters && (
          <p className="mt-auto text-xs text-stone/50">{destination.altitudeMeters.toLocaleString()}m altitude</p>
        )}
      </div>
    </Link>
  );
}
