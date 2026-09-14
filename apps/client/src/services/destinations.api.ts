import { api } from './api';
import type {
  DestinationCategory,
  DestinationDetail,
  DestinationListResponse,
  SearchResponse,
} from '../types/api';

export const destinationsApi = {
  async list(params: { category?: string; page?: number; limit?: number } = {}) {
    const { data } = await api.get<DestinationListResponse>('/destinations', { params });
    return data;
  },

  async bySlug(slug: string) {
    const { data } = await api.get<DestinationDetail>(`/destinations/${slug}`);
    return data;
  },

  async categories() {
    const { data } = await api.get<DestinationCategory[]>('/destinations/categories');
    return data;
  },
};

export const searchApi = {
  async search(q: string) {
    const { data } = await api.post<SearchResponse>('/search', { q });
    return data;
  },
};
