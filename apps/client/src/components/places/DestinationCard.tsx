import { Link } from 'react-router-dom';
import { destinationImagery } from '../../data/imagery';
import { Photo } from '../ui/Photo';

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
  const photo = destinationImagery[destination.slug]?.hero;

  return (
    <Link
      to={`/places/${destination.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand/40">
        <Photo
          id={photo}
          src={destination.heroImageUrl}
          alt={destination.name}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-stone/60 to-transparent" />
        {destination.categoryName && (
          <span className="absolute left-3 top-3 rounded-full bg-snow/90 px-3 py-1 text-xs font-semibold text-stone backdrop-blur-sm">
            {destination.categoryName}
          </span>
        )}
        {destination.altitudeMeters != null && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-medium text-snow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M3 19l6-10 4 6 3-4 5 8H3z" strokeLinejoin="round" />
            </svg>
            {destination.altitudeMeters.toLocaleString()} m
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-xl font-semibold text-stone">{destination.name}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-stone/70">{destination.summary}</p>
        <span className="mt-auto pt-2 text-sm font-medium text-accent">
          Explore <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
