import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/auth.store';
import { itineraryApi } from '../../services/itinerary.api';
import { tripCover } from '../../data/imagery';
import { CardSkeleton } from '../../components/ui/CardSkeleton';
import { Photo } from '../../components/ui/Photo';
import { PageHero } from '../../components/ui/PageHero';
import { emberButton } from '../../components/ui/forms';
import { Seo } from '../../components/seo/Seo';

export function TripsPage() {
  const user = useAuthStore((s) => s.user);
  const { data: trips, isLoading } = useQuery({
    queryKey: ['itineraries', 'mine'],
    queryFn: () => itineraryApi.mine(),
  });

  return (
    <div>
      <Seo title="My trips" description="Your saved Ladakh itineraries." path="/account/trips" />
      <PageHero
        photo="spangmik-sunset"
        eyebrow={user ? `Signed in as ${user.username}` : 'Your account'}
        title={
          <>
            My <em>trips</em>
          </>
        }
        subtitle="Your saved itineraries — open one to edit, share or delete it."
      >
        <Link to="/planner" className={`${emberButton} mt-5 self-start`}>
          + New trip
        </Link>
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : trips && trips.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                to={`/itineraries/${trip.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-stone/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-night">
                  <Photo id={tripCover(trip.id)} alt="" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-night/80 px-3 py-1 text-xs font-semibold text-snow backdrop-blur-sm">
                    {trip.days} {trip.days === 1 ? 'day' : 'days'}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1 p-5">
                  <h2 className="font-display text-xl font-medium text-stone">{trip.title}</h2>
                  <p className="text-sm text-stone/60">
                    {trip.startingCity ? `From ${trip.startingCity}` : 'Ladakh'}
                    {trip.travelStyle ? ` · ${trip.travelStyle}` : ''}
                  </p>
                  <span className="mt-auto pt-3 text-sm font-medium text-accent">
                    Open <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-stone/25 bg-white px-6 py-16 text-center">
            <p className="font-display text-3xl font-medium text-stone">
              No trips <em className="font-medium text-accent">yet.</em>
            </p>
            <p className="mx-auto mt-2 max-w-md text-stone/60">
              Build a day-by-day itinerary and it will show up here — or start from one of our hand-picked routes.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/planner" className={emberButton}>
                Plan a trip
              </Link>
              <Link to="/packages" className="rounded-full border border-stone/25 px-6 py-3 text-sm font-medium text-stone hover:border-accent hover:text-accent">
                Browse routes
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
