export type Role = 'USER' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';

export interface PublicUser {
  id: string;
  username: string;
  email: string;
  role: Role;
}

export interface DestinationCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  summary: string;
  overview: string;
  bestTime: string | null;
  howToReach: string | null;
  distanceFromLeh: number | null;
  altitudeMeters: number | null;
  latitude: number | null;
  longitude: number | null;
  heroImageUrl: string | null;
  status: string;
  categoryId: string | null;
  category: DestinationCategory | null;
  createdAt: string;
  updatedAt: string;
}

export interface DestinationDetail extends Destination {
  related: Destination[];
}

export interface DestinationListResponse {
  items: Destination[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchResult {
  id: string;
  slug: string;
  name: string;
  summary: string;
  heroImageUrl: string | null;
  rank: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
}
