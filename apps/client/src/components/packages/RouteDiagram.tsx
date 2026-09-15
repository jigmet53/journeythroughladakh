import { Link } from 'react-router-dom';
import type { TripPackageDay } from '../../types/api';

/** Visual day-by-day journey timeline — a simpler, more universally clear
 * "at a glance" route view than an actual map (not every waypoint on a
 * route, e.g. mountain passes, has its own destination page/coordinates). */
export function RouteDiagram({ days }: { days: TripPackageDay[] }) {
  return (
    <div className="relative">
      <div className="absolute bottom-4 left-[15px] top-4 w-px bg-stone/15 sm:left-[19px]" />
      <ol className="flex flex-col gap-6">
        {days.map((day) => (
          <li key={day.id} className="relative flex gap-4 pl-0">
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-snow sm:h-10 sm:w-10 sm:text-sm">
              {day.dayNumber}
            </div>
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <h3 className="font-display text-base font-semibold text-stone sm:text-lg">{day.title}</h3>
                {day.overnightAt && (
                  <span className="text-xs text-stone/50">Overnight: {day.overnightAt}</span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone/50">
                {day.distanceKm != null && <span>{day.distanceKm} km</span>}
                {day.driveHours != null && <span>~{day.driveHours}h drive</span>}
                {day.altitudeMeters != null && <span>{day.altitudeMeters.toLocaleString()}m altitude</span>}
              </div>
              <p className="mt-2 text-sm text-stone/70">{day.description}</p>
              {day.destination && (
                <Link
                  to={`/places/${day.destination.slug}`}
                  className="mt-1 inline-block text-xs font-medium text-accent hover:underline"
                >
                  View {day.destination.name} →
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
