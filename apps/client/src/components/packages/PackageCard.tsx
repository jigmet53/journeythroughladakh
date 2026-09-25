import { Link } from 'react-router-dom';
import type { TripPackage } from '../../types/api';
import { packageImagery } from '../../data/imagery';
import { Photo } from '../ui/Photo';

export function PackageCard({ pkg }: { pkg: TripPackage }) {
  return (
    <Link
      to={`/packages/${pkg.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand/40">
        <Photo
          id={packageImagery[pkg.slug]?.hero}
          src={pkg.heroImageUrl}
          alt={pkg.title}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-stone/70 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-stone/85 px-3 py-1 text-xs font-semibold text-snow backdrop-blur-sm">
          {pkg.nights}N / {pkg.days}D
        </span>
        <span className="absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-wider text-snow">
          {pkg.difficulty}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-xl font-semibold leading-snug text-stone">{pkg.title}</h3>
        <p className="text-sm font-medium text-accent">{pkg.tagline}</p>
        <p className="line-clamp-2 text-sm leading-relaxed text-stone/70">{pkg.summary}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
          {pkg.bestFor.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-sand/30 px-2.5 py-1 text-xs text-stone/70">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
