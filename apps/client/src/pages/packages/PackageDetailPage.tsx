import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { packagesApi } from '../../services/packages.api';
import { RouteSummary } from '../../components/packages/RouteSummary';
import { RouteDiagram } from '../../components/packages/RouteDiagram';
import { Seo } from '../../components/seo/Seo';
import { buildBreadcrumbList, buildTouristTrip } from '../../utils/structuredData';

export function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: pkg, isLoading, isError } = useQuery({
    queryKey: ['package', slug],
    queryFn: () => packagesApi.bySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return <div className="mx-auto max-w-4xl px-4 py-16 text-stone/60">Loading…</div>;
  }

  if (isError || !pkg) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-stone">Package not found</h1>
        <Link to="/packages" className="mt-4 inline-block text-accent hover:underline">
          Back to Packages
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Seo
        title={`${pkg.title} (${pkg.nights}N/${pkg.days}D)`}
        description={pkg.summary}
        path={`/packages/${pkg.slug}`}
        image={pkg.heroImageUrl ?? undefined}
        jsonLd={[
          buildTouristTrip(pkg),
          buildBreadcrumbList([
            { name: 'Packages', path: '/packages' },
            { name: pkg.title, path: `/packages/${pkg.slug}` },
          ]),
        ]}
      />
      <nav className="mb-4 text-sm text-stone/50">
        <Link to="/packages" className="hover:text-accent">
          Packages
        </Link>{' '}
        / {pkg.title}
      </nav>

      <header className="mb-8">
        <span className="text-xs font-medium uppercase tracking-wide text-accent">{pkg.tagline}</span>
        <h1 className="mt-1 font-display text-3xl font-semibold text-stone sm:text-4xl">{pkg.title}</h1>
        <p className="mt-3 text-lg text-stone/70">{pkg.summary}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-stone/10 bg-sand/10 p-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-stone/50">Duration</dt>
            <dd className="font-medium text-stone">
              {pkg.nights}N / {pkg.days}D
            </dd>
          </div>
          <div>
            <dt className="text-stone/50">Difficulty</dt>
            <dd className="font-medium text-stone">{pkg.difficulty}</dd>
          </div>
          <div>
            <dt className="text-stone/50">Starts from</dt>
            <dd className="font-medium text-stone">{pkg.startCity}</dd>
          </div>
          <div>
            <dt className="text-stone/50">Best time</dt>
            <dd className="font-medium text-stone">{pkg.bestTime}</dd>
          </div>
          {pkg.estimatedBudget && (
            <div className="col-span-2 sm:col-span-4">
              <dt className="text-stone/50">Typical budget (self-planned)</dt>
              <dd className="font-medium text-stone">{pkg.estimatedBudget}</dd>
            </div>
          )}
        </dl>

        {pkg.bestFor.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {pkg.bestFor.map((tag) => (
              <span key={tag} className="rounded-full bg-sand/30 px-2.5 py-1 text-xs text-stone/70">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {pkg.highlights.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 font-display text-xl font-semibold text-stone">Highlights</h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {pkg.highlights.map((h, i) => (
              <li key={i} className="flex gap-2 text-sm text-stone/80">
                <span className="text-accent">✦</span>
                {h}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-10">
        <h2 className="mb-3 font-display text-xl font-semibold text-stone">The route</h2>
        <RouteSummary days={pkg.itinerary} />
      </section>

      <section className="mb-10">
        <h2 className="mb-4 font-display text-xl font-semibold text-stone">Day by day</h2>
        <RouteDiagram days={pkg.itinerary} />
      </section>

      {pkg.thingsToKnow.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-3 font-display text-xl font-semibold text-stone">Things to know</h2>
          <ul className="flex flex-col gap-2">
            {pkg.thingsToKnow.map((t, i) => (
              <li key={i} className="rounded-lg bg-sand/20 p-3 text-sm text-stone/80">
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-8 rounded-lg bg-sand/20 p-4 text-sm text-stone/60">
        This is an editorial route guide, not a bookable package — road conditions, permit rules,
        and highway opening dates change frequently. Confirm current status with the relevant
        local authority before you travel, and use our{' '}
        <Link to="/planner" className="text-accent hover:underline">
          trip planner
        </Link>{' '}
        to adapt this route to your own dates.
      </p>
    </article>
  );
}
