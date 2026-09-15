import { Link } from 'react-router-dom';
import type { TripPackage } from '../../types/api';

export function PackageCard({ pkg }: { pkg: TripPackage }) {
  return (
    <Link
      to={`/packages/${pkg.slug}`}
      className="flex flex-col gap-3 rounded-xl border border-stone/10 bg-white p-5 transition-shadow hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-stone px-3 py-1 text-xs font-medium text-snow">
          {pkg.nights}N / {pkg.days}D
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-accent">{pkg.difficulty}</span>
      </div>
      <h3 className="font-display text-xl font-semibold text-stone">{pkg.title}</h3>
      <p className="text-sm text-stone/60">{pkg.tagline}</p>
      <p className="line-clamp-2 text-sm text-stone/70">{pkg.summary}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
        {pkg.bestFor.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-sand/30 px-2.5 py-1 text-xs text-stone/70">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
