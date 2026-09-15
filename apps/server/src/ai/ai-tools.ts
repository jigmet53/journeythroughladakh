import type { FunctionDeclaration } from '@google/genai';
import { DestinationsService } from '../destinations/destinations.service';
import { ItineraryService } from '../itinerary/itinerary.service';

export const AI_TOOLS: FunctionDeclaration[] = [
  {
    name: 'get_destination',
    description:
      'Look up full structured details for a specific Ladakh destination by its slug (e.g. "pangong-lake", "nubra-valley"). Use this whenever you need altitude, distance from Leh, best time to visit, or other structured facts rather than relying on memory.',
    parametersJsonSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'The destination slug, e.g. "pangong-lake"' },
      },
      required: ['slug'],
    },
  },
  {
    name: 'get_itinerary',
    description:
      "Look up a specific saved trip itinerary by its id, to answer questions about that traveler's plan (e.g. \"what's on day 3 of my trip?\").",
    parametersJsonSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'The itinerary id' },
      },
      required: ['id'],
    },
  },
];

export class AiToolExecutor {
  constructor(
    private readonly destinationsService: DestinationsService,
    private readonly itineraryService: ItineraryService,
  ) {}

  async execute(name: string, input: Record<string, unknown>): Promise<unknown> {
    try {
      switch (name) {
        case 'get_destination': {
          const slug = String(input.slug ?? '');
          const destination = await this.destinationsService.findBySlug(slug);
          return {
            name: destination.name,
            summary: destination.summary,
            overview: destination.overview,
            bestTime: destination.bestTime,
            howToReach: destination.howToReach,
            distanceFromLeh: destination.distanceFromLeh,
            altitudeMeters: destination.altitudeMeters,
          };
        }
        case 'get_itinerary': {
          const id = String(input.id ?? '');
          const itinerary = await this.itineraryService.findOne(id, null);
          return {
            title: itinerary.title,
            days: itinerary.days,
            itineraryDays: itinerary.itineraryDays.map((day) => ({
              dayNumber: day.dayNumber,
              title: day.title,
              notes: day.notes,
              items: day.items.map((item) => ({ activity: item.activity, notes: item.notes })),
            })),
          };
        }
        default:
          return { error: `Unknown tool "${name}"` };
      }
    } catch {
      return { error: `Could not find a match for the given input.` };
    }
  }
}
