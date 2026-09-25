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
    <ol className="flex flex-wrap items-center gap-2 rounded-2xl bg-night p-5">
      {stops.map((stop, i) => (
        <li key={i} className="flex items-center gap-2">
          <span className="rounded-full border border-snow/20 bg-snow/5 px-4 py-1.5 text-sm font-medium text-snow">{stop}</span>
          {i < stops.length - 1 && (
            <span aria-hidden="true" className="text-ember">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
