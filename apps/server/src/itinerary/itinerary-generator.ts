import type { Destination } from '@prisma/client';
import type { GenerateItineraryDto } from './dto/generate-itinerary.dto';

export interface DraftItem {
  destinationId?: string;
  order: number;
  activity?: string;
  notes?: string;
}

export interface DraftDay {
  dayNumber: number;
  title?: string;
  notes?: string;
  items: DraftItem[];
}

const HIGH_ALTITUDE_THRESHOLD_M = 5000;

/**
 * Deterministic, data-driven day-by-day generator (BRD.md §15-16) — not an
 * LLM call. It arranges real seeded destinations into a plausible day plan:
 * day 1 is always arrival/acclimatization, the last day (when days > 1) is
 * departure, and the days between get one destination each, nearest-to-Leh
 * first, filtered by interests/fitness when given. The AI assistant (M5)
 * is a separate, explicitly-scoped feature — this generator never calls an LLM.
 */
export function generateItineraryDays(
  destinations: Destination[],
  input: GenerateItineraryDto,
): DraftDay[] {
  const { days, interests, fitnessLevel } = input;

  let pool = destinations.filter((d) => d.status === 'published');
  if (fitnessLevel === 'easy') {
    pool = pool.filter((d) => (d.altitudeMeters ?? 0) < HIGH_ALTITUDE_THRESHOLD_M);
  }

  const byDistance = (arr: Destination[]) =>
    [...arr].sort((a, b) => (a.distanceFromLeh ?? 0) - (b.distanceFromLeh ?? 0));

  const matching = interests?.length
    ? pool.filter((d) => interests.some((i) => matchesInterest(d, i)))
    : [];
  const rest = pool.filter((d) => !matching.includes(d));
  // Sort each group independently, *then* concatenate — sorting the combined
  // list would undo the interest-match prioritization by distance alone.
  const ordered = [...byDistance(matching), ...byDistance(rest)];

  const hasBookendDays = days > 1;
  const exploreDayCount = hasBookendDays ? Math.max(days - 2, 0) : days;
  const result: DraftDay[] = [];

  result.push({
    dayNumber: 1,
    title: 'Arrival in Leh',
    notes:
      'Arrive in Leh and rest — altitude sickness is a real risk above 3,500m. Keep today light: hydrate, avoid alcohol and strenuous activity, and save sightseeing for tomorrow.',
    items: [],
  });

  const used = new Set<string>();
  for (let i = 0; i < exploreDayCount; i++) {
    const destination = ordered[i % Math.max(ordered.length, 1)];
    const dayNumber = i + 2;

    if (!destination || used.has(destination.id)) {
      result.push({
        dayNumber,
        title: 'Free day',
        notes: 'No destination scheduled — use this day to rest or revisit a favorite spot.',
        items: [],
      });
      continue;
    }

    used.add(destination.id);
    result.push({
      dayNumber,
      title: destination.name,
      notes: destination.bestTime ? `Best visited: ${destination.bestTime}.` : undefined,
      items: [
        {
          destinationId: destination.id,
          order: 1,
          activity: `Visit ${destination.name}`,
          notes: destination.summary,
        },
      ],
    });
  }

  if (hasBookendDays) {
    result.push({
      dayNumber: days,
      title: 'Departure',
      notes: 'Departure from Leh. Allow extra time for altitude-related travel delays.',
      items: [],
    });
  }

  return result;
}

function matchesInterest(destination: Destination, interest: string): boolean {
  const needle = interest.toLowerCase();
  return (
    destination.name.toLowerCase().includes(needle) ||
    destination.summary.toLowerCase().includes(needle) ||
    destination.overview.toLowerCase().includes(needle)
  );
}
