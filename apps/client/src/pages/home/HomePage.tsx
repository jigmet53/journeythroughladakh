import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { destinationsApi } from '../../services/destinations.api';
import { DestinationCard } from '../../components/places/DestinationCard';

export function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['destinations', 'home'],
    queryFn: () => destinationsApi.list({ limit: 6 }),
  });

  return (
    <div>
      <section className="relative overflow-hidden bg-stone text-snow">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:px-6 sm:py-32">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl"
          >
            Your intelligent guide to the Land of High Passes.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-xl text-lg text-snow/80"
          >
            Explore Ladakh. Plan smarter. Travel deeper — destination knowledge, an itinerary
            planner, and an AI assistant grounded in verified local information.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              to="/places"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-snow hover:opacity-90"
            >
              Explore Ladakh
            </Link>
            <Link
              to="/planner"
              className="rounded-full border border-snow/30 px-6 py-3 text-sm font-medium text-snow hover:border-snow"
            >
              Plan My Trip
            </Link>
            <Link
              to="/ai"
              className="rounded-full border border-snow/30 px-6 py-3 text-sm font-medium text-snow hover:border-snow"
            >
              Ask AI
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-stone">Popular destinations</h2>
          <Link to="/places" className="text-sm font-medium text-accent hover:underline">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-xl bg-sand/30" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.items.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={{ ...destination, categoryName: destination.category?.name }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
