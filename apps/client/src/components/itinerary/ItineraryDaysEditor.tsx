import { useQuery } from '@tanstack/react-query';
import { destinationsApi } from '../../services/destinations.api';
import type { ItineraryDay } from '../../types/api';
import { inputClass } from '../ui/forms';
import { DayCard } from './DayCard';

interface Props {
  days: ItineraryDay[];
  onChange: (days: ItineraryDay[]) => void;
}

const iconButton =
  'flex h-8 w-8 items-center justify-center rounded-full border border-stone/20 text-sm text-stone/60 transition hover:border-accent hover:text-accent disabled:opacity-30';

/** Shared editor for BRD.md §17's itinerary editing requirements: add/remove
 * destinations, reorder days, add notes. Used by both the unsaved planner
 * draft and a saved itinerary's edit view. */
export function ItineraryDaysEditor({ days, onChange }: Props) {
  const { data: destinationsData } = useQuery({
    queryKey: ['destinations', 'for-planner'],
    queryFn: () => destinationsApi.list({ limit: 50 }),
  });
  const destinations = destinationsData?.items ?? [];

  const updateDay = (index: number, patch: Partial<ItineraryDay>) => {
    const next = days.map((d, i) => (i === index ? { ...d, ...patch } : d));
    onChange(next);
  };

  const removeDay = (index: number) => {
    const next = days.filter((_, i) => i !== index).map((d, i) => ({ ...d, dayNumber: i + 1 }));
    onChange(next);
  };

  const moveDay = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= days.length) return;
    const next = [...days];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((d, i) => ({ ...d, dayNumber: i + 1 })));
  };

  const addDay = () => {
    onChange([...days, { dayNumber: days.length + 1, title: '', notes: '', items: [] }]);
  };

  const addDestination = (dayIndex: number, destinationId: string) => {
    const destination = destinations.find((d) => d.id === destinationId);
    if (!destination) return;
    const day = days[dayIndex];
    const newItem = {
      destinationId: destination.id,
      destination,
      order: day.items.length + 1,
      activity: `Visit ${destination.name}`,
      notes: destination.summary,
    };
    updateDay(dayIndex, { items: [...day.items, newItem] });
  };

  const removeItem = (dayIndex: number, itemIndex: number) => {
    const day = days[dayIndex];
    updateDay(dayIndex, { items: day.items.filter((_, i) => i !== itemIndex) });
  };

  return (
    <div className="flex flex-col gap-5">
      <ol className="flex flex-col gap-5">
        {days.map((day, dayIndex) => (
          <DayCard key={dayIndex} dayNumber={day.dayNumber} last={dayIndex === days.length - 1}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <label htmlFor={`day-title-${dayIndex}`} className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Day {day.dayNumber}
                </label>
                <input
                  id={`day-title-${dayIndex}`}
                  value={day.title ?? ''}
                  onChange={(e) => updateDay(dayIndex, { title: e.target.value })}
                  placeholder="Day title"
                  className="mt-0.5 w-full border-b border-transparent bg-transparent font-display text-xl font-medium text-stone placeholder:text-stone/30 focus:border-accent focus:outline-none"
                />
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button type="button" onClick={() => moveDay(dayIndex, -1)} disabled={dayIndex === 0} className={iconButton} aria-label="Move day up">
                  ↑
                </button>
                <button type="button" onClick={() => moveDay(dayIndex, 1)} disabled={dayIndex === days.length - 1} className={iconButton} aria-label="Move day down">
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeDay(dayIndex)}
                  className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Remove day
                </button>
              </div>
            </div>

            <textarea
              value={day.notes ?? ''}
              onChange={(e) => updateDay(dayIndex, { notes: e.target.value })}
              placeholder="Notes for this day…"
              aria-label={`Notes for day ${day.dayNumber}`}
              rows={2}
              className={`${inputClass} mt-3 bg-sand/10`}
            />

            {day.items.length > 0 && (
              <ul className="mt-3 flex flex-col gap-2">
                {day.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start justify-between gap-3 rounded-xl bg-sand/20 p-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium text-stone">{item.activity || item.destination?.name}</p>
                      {item.notes && <p className="mt-0.5 line-clamp-2 text-stone/60">{item.notes}</p>}
                    </div>
                    <button type="button" onClick={() => removeItem(dayIndex, itemIndex)} className="shrink-0 text-xs font-medium text-red-600 hover:underline">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <select
              value=""
              onChange={(e) => e.target.value && addDestination(dayIndex, e.target.value)}
              aria-label={`Add a destination to day ${day.dayNumber}`}
              className={`${inputClass} mt-3 text-stone/70`}
            >
              <option value="">+ Add a destination to this day…</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </DayCard>
        ))}
      </ol>

      <button
        type="button"
        onClick={addDay}
        className="self-start rounded-full border border-dashed border-stone/30 px-5 py-2.5 text-sm font-medium text-stone/60 transition hover:border-accent hover:text-accent"
      >
        + Add day
      </button>
    </div>
  );
}
