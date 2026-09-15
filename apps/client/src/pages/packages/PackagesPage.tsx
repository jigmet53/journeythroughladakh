import { useQuery } from '@tanstack/react-query';
import { packagesApi } from '../../services/packages.api';
import { PackageCard } from '../../components/packages/PackageCard';

export function PackagesPage() {
  const { data: packages, isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: () => packagesApi.list(),
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-stone">Hand-picked Ladakh trip packages</h1>
      <p className="mt-2 max-w-2xl text-stone/70">
        Curated, day-by-day routes — from a quick 5-day introduction to the classic Nubra-Pangong
        loop, to the iconic Manali-Leh motorcycle ride and an off-beat Tso Moriri circuit. Each one
        is a real route you can follow yourself, with everything you need to know before you go.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-sand/30" />
            ))
          : packages?.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
      </div>
    </div>
  );
}
