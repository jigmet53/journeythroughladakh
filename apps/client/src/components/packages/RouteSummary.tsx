import type { TripPackageDay } from '../../types/api';

/** Compact "route at a glance" — just the distinct overnight stops in order,
 * connected by arrows. The detailed day-by-day timeline (RouteDiagram) below
 * carries the full breakdown; this is the 3-second summary. */
export function RouteSummary({ days }: { days: TripPackageDay[] }) {
  const stops: string[] = [];
  for (const day of days) {
    const label = day.overnightAt ?? day.title;
    if (stops[stops.length - 1] !== label) stops.push(label);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-stone/10 bg-sand/10 p-4">
      {stops.map((stop, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-stone shadow-sm">
            {stop}
          </span>
          {i < stops.length - 1 && <span className="text-stone/30">→</span>}
        </div>
      ))}
    </div>
  );
}
