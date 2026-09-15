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

export type ItineraryVisibility = 'PRIVATE' | 'UNLISTED' | 'PUBLIC';

export interface ItineraryItem {
  id?: string;
  destinationId?: string | null;
  destination?: Destination | null;
  order: number;
  activity?: string | null;
  notes?: string | null;
}

export interface ItineraryDay {
  id?: string;
  dayNumber: number;
  title?: string | null;
  notes?: string | null;
  items: ItineraryItem[];
}

export interface ItineraryDraft {
  startingCity: string | null;
  days: number;
  budget: string | null;
  travelStyle: string | null;
  itineraryDays: ItineraryDay[];
}

export interface Itinerary extends ItineraryDraft {
  id: string;
  userId: string;
  title: string;
  visibility: ItineraryVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface PlannerInput {
  startingCity?: string;
  days: number;
  budget?: string;
  travelStyle?: string;
  interests?: string[];
  fitnessLevel?: 'easy' | 'moderate' | 'strenuous';
}

export interface TripPackageDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  overnightAt: string | null;
  distanceKm: number | null;
  driveHours: number | null;
  altitudeMeters: number | null;
  destinationId: string | null;
  destination: Destination | null;
}

export interface TripPackage {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  days: number;
  nights: number;
  difficulty: string;
  bestFor: string[];
  bestTime: string;
  startCity: string;
  estimatedBudget: string | null;
  highlights: string[];
  thingsToKnow: string[];
  heroImageUrl: string | null;
  status: string;
}

export interface TripPackageDetail extends TripPackage {
  itinerary: TripPackageDay[];
}
