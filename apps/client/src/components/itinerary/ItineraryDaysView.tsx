import type { ItineraryDay } from '../../types/api';
import { DayCard } from './DayCard';

/** Read-only day list — same look as ItineraryDaysEditor. */
export function ItineraryDaysView({ days }: { days: ItineraryDay[] }) {
  return (
    <ol className="flex flex-col gap-5">
      {days.map((day, i) => (
        <DayCard key={day.dayNumber} dayNumber={day.dayNumber} last={i === days.length - 1}>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Day {day.dayNumber}</p>
          {day.title && <h3 className="mt-0.5 font-display text-xl font-medium text-stone">{day.title}</h3>}
          {day.notes && <p className="mt-1 text-sm leading-relaxed text-stone/65">{day.notes}</p>}
          {day.items.length > 0 && (
            <ul className="mt-3 flex flex-col gap-2">
              {day.items.map((item, idx) => (
                <li key={idx} className="rounded-xl bg-sand/20 p-3 text-sm">
                  <p className="font-medium text-stone">{item.activity || item.destination?.name}</p>
                  {item.notes && <p className="mt-0.5 line-clamp-2 text-stone/60">{item.notes}</p>}
                </li>
              ))}
            </ul>
          )}
        </DayCard>
      ))}
    </ol>
  );
}
