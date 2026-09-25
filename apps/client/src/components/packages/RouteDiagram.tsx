import { Link } from 'react-router-dom';
import type { TripPackageDay } from '../../types/api';

/** Visual day-by-day journey timeline — a simpler, more universally clear
 * "at a glance" route view than an actual map (not every waypoint on a
 * route, e.g. mountain passes, has its own destination page/coordinates). */
export function RouteDiagram({ days }: { days: TripPackageDay[] }) {
  return (
    <ol className="relative flex flex-col gap-5">
      <span aria-hidden="true" className="absolute bottom-6 left-5 top-6 w-px bg-gradient-to-b from-accent/60 via-stone/15 to-transparent" />
      {days.map((day) => (
        <li key={day.id} className="relative flex gap-4 sm:gap-5">
          <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-night text-sm font-semibold text-ember">
            {day.dayNumber}
          </span>
          <div className="min-w-0 flex-1 rounded-2xl border border-stone/10 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h3 className="font-display text-lg font-medium text-stone sm:text-xl">{day.title}</h3>
              {day.overnightAt && <span className="text-xs text-stone/50">Overnight: {day.overnightAt}</span>}
            </div>
            {(day.distanceKm != null || day.driveHours != null || day.altitudeMeters != null) && (
              <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-accent">
                {day.distanceKm != null && <span>{day.distanceKm} km</span>}
                {day.driveHours != null && <span>~{day.driveHours} h drive</span>}
                {day.altitudeMeters != null && <span>{day.altitudeMeters.toLocaleString()} m altitude</span>}
              </p>
            )}
            <p className="mt-2 text-sm leading-relaxed text-stone/70">{day.description}</p>
            {day.destination && (
              <Link to={`/places/${day.destination.slug}`} className="mt-2 inline-block text-sm font-medium text-accent hover:underline">
                View {day.destination.name} →
              </Link>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
