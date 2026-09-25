import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { packagesApi } from '../../services/packages.api';
import { RouteSummary } from '../../components/packages/RouteSummary';
import { RouteDiagram } from '../../components/packages/RouteDiagram';
import { BookingForm } from '../../components/packages/BookingForm';
import { Gallery } from '../../components/ui/Gallery';
import { emberButton } from '../../components/ui/forms';
import { PageHero } from '../../components/ui/PageHero';
import { Seo } from '../../components/seo/Seo';
import { packageImagery, photoSrc } from '../../data/imagery';
import { buildBreadcrumbList, buildTouristTrip } from '../../utils/structuredData';

/** True while the #book section is in view — the mobile bar hides then. */
function useBookingInView(enabled: boolean) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const el = document.getElementById('book');
    if (!el || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);
  return inView;
}

export function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: pkg, isLoading, isError } = useQuery({
    queryKey: ['package', slug],
    queryFn: () => packagesApi.bySlug(slug!),
    enabled: !!slug,
  });

  const bookingInView = useBookingInView(!!pkg);

  if (isLoading) {
    return (
      <div aria-busy="true" aria-label="Loading package">
        <div className="h-[22rem] animate-pulse bg-sand/40 sm:h-[26rem]" />
        <div className="mx-auto max-w-4xl space-y-4 px-4 py-10 sm:px-6">
          <div className="h-4 w-full animate-pulse rounded bg-sand/30" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-sand/30" />
        </div>
      </div>
    );
  }

  if (isError || !pkg) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-stone">Package not found</h1>
        <p className="mt-2 text-stone/60">It may have been moved or removed.</p>
        <Link to="/packages" className="mt-6 inline-block rounded-full bg-stone px-6 py-2.5 text-sm font-medium text-snow hover:bg-accent">
          Back to Packages
        </Link>
      </div>
    );
  }

  const imagery = packageImagery[pkg.slug];

  return (
    <article>
      <Seo
        title={`${pkg.title} (${pkg.nights}N/${pkg.days}D)`}
        description={pkg.summary}
        path={`/packages/${pkg.slug}`}
        image={pkg.heroImageUrl ?? (imagery ? photoSrc(imagery.hero) : undefined)}
        jsonLd={[
          buildTouristTrip(pkg),
          buildBreadcrumbList([
            { name: 'Packages', path: '/packages' },
            { name: pkg.title, path: `/packages/${pkg.slug}` },
          ]),
        ]}
      />

      <PageHero
        photo={imagery?.hero ?? 'hero-indus-road'}
        src={pkg.heroImageUrl}
        eyebrow={pkg.tagline}
        title={pkg.title}
        subtitle={pkg.summary}
        size="lg"
      >
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href="#book" className={emberButton}>
            Request this trip <span aria-hidden="true">→</span>
          </a>
          <nav aria-label="Breadcrumb" className="text-sm text-snow/70">
            <Link to="/packages" className="hover:text-snow">
              Packages
            </Link>{' '}
            / <span className="text-snow">{pkg.title}</span>
          </nav>
        </div>
      </PageHero>

      <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <dl className="relative z-10 -mt-6 grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border border-stone/10 bg-white p-5 shadow-lg sm:grid-cols-4">
          {[
            { label: 'Duration', value: `${pkg.nights}N / ${pkg.days}D` },
            { label: 'Difficulty', value: pkg.difficulty },
            { label: 'Starts from', value: pkg.startCity },
            { label: 'Best time', value: pkg.bestTime },
          ].map((f) => (
            <div key={f.label}>
              <dt className="text-xs font-medium uppercase tracking-wider text-stone/50">{f.label}</dt>
              <dd className="mt-0.5 font-display text-lg font-semibold text-stone">{f.value}</dd>
            </div>
          ))}
          {pkg.estimatedBudget && (
            <div className="col-span-2 sm:col-span-4">
              <dt className="text-xs font-medium uppercase tracking-wider text-stone/50">
                Typical budget (self-planned)
              </dt>
              <dd className="mt-0.5 text-stone/80">{pkg.estimatedBudget}</dd>
            </div>
          )}
        </dl>

        {pkg.bestFor.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {pkg.bestFor.map((tag) => (
              <span key={tag} className="rounded-full bg-sand/30 px-3 py-1 text-xs text-stone/70">
                {tag}
              </span>
            ))}
          </div>
        )}

        {pkg.highlights.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 font-display text-2xl font-semibold text-stone">Highlights</h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {pkg.highlights.map((h, i) => (
                <li key={i} className="flex gap-3 rounded-xl bg-sand/20 p-3 text-sm text-stone/80">
                  <span className="text-accent" aria-hidden="true">
                    ✦
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </section>
        )}

        {imagery && imagery.gallery.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 font-display text-2xl font-semibold text-stone">Along the way</h2>
            <Gallery ids={imagery.gallery} />
          </section>
        )}

        <section className="mt-10">
          <h2 className="mb-4 font-display text-2xl font-semibold text-stone">The route</h2>
          <RouteSummary days={pkg.itinerary} />
        </section>

        <section className="mt-10">
          <h2 className="mb-4 font-display text-2xl font-semibold text-stone">Day by day</h2>
          <RouteDiagram days={pkg.itinerary} />
        </section>

        {pkg.thingsToKnow.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 font-display text-2xl font-semibold text-stone">Things to know</h2>
            <ul className="flex flex-col gap-2">
              {pkg.thingsToKnow.map((t, i) => (
                <li key={i} className="rounded-xl border-l-4 border-accent bg-sand/20 p-4 text-sm text-stone/80">
                  {t}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="book" className="mt-14 scroll-mt-24">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            Book this trip
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium text-stone sm:text-4xl">
            Request this <em className="font-medium text-accent">route</em>
          </h2>
          <p className="mt-2 max-w-2xl text-stone/65">
            Tell us your dates and group size and we'll contact you to confirm availability, the price and the
            details. There's no payment online and no commitment until you confirm with us.
          </p>
          <div className="mt-8">
            <BookingForm pkg={pkg} />
          </div>
        </section>

        <p className="mt-10 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm text-stone/70">
          Road conditions, permit rules and highway opening dates change frequently, so dates and details are
          confirmed with you after your request. Always check current status with the relevant local authority
          before you travel, and use our{' '}
          <Link to="/planner" className="font-medium text-accent hover:underline">
            trip planner
          </Link>{' '}
          to adapt this route to your own dates.
        </p>
      </div>
      {!bookingInView && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone/10 bg-snow/95 p-3 backdrop-blur lg:hidden">
          <a href="#book" className={`${emberButton} block w-full py-3.5 text-center`}>
            Request this trip →
          </a>
        </div>
      )}
    </article>
  );
}
