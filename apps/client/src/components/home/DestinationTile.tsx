import { Link } from 'react-router-dom';
import { destinationImagery } from '../../data/imagery';
import type { Destination } from '../../types/api';
import { Photo } from '../ui/Photo';

/** Photo-first tile: the picture is the card and the text sits on it. Sized by
 * its grid cell, so the caller decides which tiles are large. */
export function DestinationTile({ destination, large = false }: { destination: Destination; large?: boolean }) {
  return (
    <Link
      to={`/places/${destination.slug}`}
      className="group relative isolate block h-72 overflow-hidden rounded-3xl bg-night focus:outline-none focus-visible:ring-2 focus-visible:ring-ember lg:h-full"
    >
      <Photo
        id={destinationImagery[destination.slug]?.hero}
        src={destination.heroImageUrl}
        alt={destination.name}
        sizes={large ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'}
        className="transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night/95 via-night/40 to-night/5 transition-opacity group-hover:from-night" />
      {destination.category && (
        <span className="absolute left-4 top-4 rounded-full border border-snow/25 bg-night/40 px-3 py-1 text-xs font-medium text-snow backdrop-blur-md">
          {destination.category.name}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-5 text-snow sm:p-6">
        <h3 className={`font-display font-medium leading-tight ${large ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>
          {destination.name}
        </h3>
        <p className="mt-1 flex items-center gap-2 text-sm text-snow/75">
          {destination.altitudeMeters != null && <span>{destination.altitudeMeters.toLocaleString()} m</span>}
          {destination.altitudeMeters != null && destination.distanceFromLeh != null && (
            <span aria-hidden="true">·</span>
          )}
          {destination.distanceFromLeh != null && <span>{destination.distanceFromLeh} km from Leh</span>}
        </p>
        {large && <p className="mt-3 line-clamp-2 max-w-md text-sm text-snow/80">{destination.summary}</p>}
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-ember opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 max-lg:opacity-100">
          Explore <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
