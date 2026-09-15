import { api } from './api';
import type { Itinerary, ItineraryDay, ItineraryDraft, ItineraryVisibility, PlannerInput } from '../types/api';

export interface SaveItineraryPayload {
  title: string;
  startingCity?: string | null;
  days: number;
  budget?: string | null;
  travelStyle?: string | null;
  itineraryDays: ItineraryDraft['itineraryDays'];
}

/** The server's ValidationPipe runs with forbidNonWhitelisted — it 400s if
 * asked to save a day/item shape carrying fields the save DTO doesn't
 * define. `ItineraryDay`/`ItineraryItem` (used for both drafts and API
 * responses) carry more than that: `id` on saved days/items, and a full
 * nested `destination` object added client-side when a destination is
 * picked from the "add a destination" dropdown. Strip down to exactly the
 * save shape before every create/update. */
function toSaveDays(days: ItineraryDay[]) {
  return days.map((day) => ({
    dayNumber: day.dayNumber,
    title: day.title ?? undefined,
    notes: day.notes ?? undefined,
    items: day.items.map((item) => ({
      destinationId: item.destinationId ?? undefined,
      order: item.order,
      activity: item.activity ?? undefined,
      notes: item.notes ?? undefined,
    })),
  }));
}

export const itineraryApi = {
  async generate(input: PlannerInput) {
    const { data } = await api.post<ItineraryDraft>('/itineraries/generate', input);
    return data;
  },

  async create(payload: SaveItineraryPayload) {
    const { data } = await api.post<Itinerary>('/itineraries', {
      ...payload,
      itineraryDays: toSaveDays(payload.itineraryDays),
    });
    return data;
  },

  async update(id: string, payload: SaveItineraryPayload) {
    const { data } = await api.patch<Itinerary>(`/itineraries/${id}`, {
      ...payload,
      itineraryDays: toSaveDays(payload.itineraryDays),
    });
    return data;
  },

  async mine() {
    const { data } = await api.get<Itinerary[]>('/itineraries/mine');
    return data;
  },

  async byId(id: string) {
    const { data } = await api.get<Itinerary>(`/itineraries/${id}`);
    return data;
  },

  async setVisibility(id: string, visibility: ItineraryVisibility) {
    const { data } = await api.patch<Itinerary>(`/itineraries/${id}/visibility`, { visibility });
    return data;
  },

  async remove(id: string) {
    await api.delete(`/itineraries/${id}`);
  },
};
