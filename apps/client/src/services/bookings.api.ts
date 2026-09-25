import { api } from './api';
import type { BookingRequest, BookingStatus } from '../types/api';

export interface BookingPayload {
  packageSlug: string;
  name: string;
  email: string;
  phone: string;
  adults: number;
  children: number;
  /** YYYY-MM-DD */
  startDate: string;
  flexibleDates: boolean;
  startingCity?: string;
  notes?: string;
  consent: boolean;
  /** Honeypot — always empty from real users. */
  website?: string;
}

export const bookingsApi = {
  async create(payload: BookingPayload) {
    const { data } = await api.post<{ ok: true; reference: string }>('/bookings', payload);
    return data;
  },

  // Admin only
  async list(status?: BookingStatus) {
    const { data } = await api.get<BookingRequest[]>('/bookings', { params: status ? { status } : undefined });
    return data;
  },

  async updateStatus(id: string, status: BookingStatus) {
    const { data } = await api.patch<BookingRequest>(`/bookings/${id}/status`, { status });
    return data;
  },
};
