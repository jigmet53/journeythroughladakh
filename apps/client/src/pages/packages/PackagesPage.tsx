import { useQuery } from '@tanstack/react-query';
import { packagesApi } from '../../services/packages.api';
import { PackageCard } from '../../components/packages/PackageCard';
import { CardSkeleton } from '../../components/ui/CardSkeleton';
import { PageHero } from '../../components/ui/PageHero';
import { Seo } from '../../components/seo/Seo';

export function PackagesPage() {
  const { data: packages, isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: () => packagesApi.list(),
  });

  return (
    <div>
      <Seo
        title="Hand-picked Ladakh Trip Packages"
        description="Curated day-by-day Ladakh routes — a 5-day quick escape, the classic 7-day Nubra-Pangong loop, the Manali-Leh motorcycle trip, and an off-beat Tso Moriri and Hanle circuit."
        path="/packages"
      />
      <PageHero
        photo="lahaul-road"
        eyebrow="Trip packages"
        title={<>Hand-picked <em>trip packages</em></>}
        subtitle="Curated, day-by-day routes — from a quick 5-day introduction to the iconic Manali–Leh ride and an off-beat Tso Moriri circuit."
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="max-w-3xl text-stone/70">
          Each one is a real route you can follow yourself, with the distances, overnight stops and
          things to know before you go. Found one you like? Send a booking request from its page — no payment online.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : packages?.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
        </div>
      </div>
    </div>
  );
}
