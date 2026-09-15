import { api } from './api';
import type { TripPackage, TripPackageDetail } from '../types/api';

export const packagesApi = {
  async list() {
    const { data } = await api.get<TripPackage[]>('/packages');
    return data;
  },

  async bySlug(slug: string) {
    const { data } = await api.get<TripPackageDetail>(`/packages/${slug}`);
    return data;
  },
};
