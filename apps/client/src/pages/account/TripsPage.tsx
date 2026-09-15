import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/auth.store';
import { itineraryApi } from '../../services/itinerary.api';

export function TripsPage() {
  const user = useAuthStore((s) => s.user);
  const { data: trips, isLoading } = useQuery({
    queryKey: ['itineraries', 'mine'],
    queryFn: () => itineraryApi.mine(),
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-stone">My trips</h1>
      <p className="mt-1 text-sm text-stone/60">Signed in as {user?.username}.</p>

      {isLoading ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-sand/30" />
          ))}
        </div>
      ) : trips && trips.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {trips.map((trip) => (
            <Link
              key={trip.id}
              to={`/itineraries/${trip.id}`}
              className="rounded-xl border border-stone/10 bg-white p-4 transition-shadow hover:shadow-lg"
            >
              <h2 className="font-display text-lg font-semibold text-stone">{trip.title}</h2>
              <p className="mt-1 text-sm text-stone/60">
                {trip.days} days{trip.startingCity ? ` · from ${trip.startingCity}` : ''}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-stone/20 p-10 text-center">
          <p className="text-stone/70">No trips yet.</p>
          <p className="mt-1 text-sm text-stone/50">
            Build a day-by-day itinerary and it will show up here.
          </p>
          <Link
            to="/planner"
            className="mt-4 inline-block rounded-full bg-stone px-5 py-2 text-sm font-medium text-snow hover:bg-accent"
          >
            Plan a trip
          </Link>
        </div>
      )}
    </div>
  );
}
