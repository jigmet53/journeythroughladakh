import { api } from './api';
import type { ContactMessage } from '../types/api';

export type ContactTopic = 'general' | 'trip-planning' | 'correction' | 'feedback' | 'partnership';

export interface ContactPayload {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
  /** Honeypot — always empty from real users. */
  website?: string;
}

export const contactApi = {
  async send(payload: ContactPayload) {
    const { data } = await api.post<{ ok: true }>('/contact', payload);
    return data;
  },

  // Admin only
  async list() {
    const { data } = await api.get<ContactMessage[]>('/contact');
    return data;
  },
};
