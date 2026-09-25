import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { destinationsApi } from '../../services/destinations.api';
import { packagesApi } from '../../services/packages.api';
import { PackageCard } from '../../components/packages/PackageCard';
import { DestinationTile } from '../../components/home/DestinationTile';
import { Hero, HERO_PHOTO } from '../../components/home/Hero';
import { JourneyMap } from '../../components/home/JourneyMap';
import { RouteTimeline } from '../../components/home/RouteTimeline';
import { SectionHeading } from '../../components/home/SectionHeading';
import { ThemeStrip } from '../../components/home/ThemeStrip';
import { AccordionItem } from '../../components/ui/Accordion';
import { CardSkeleton } from '../../components/ui/CardSkeleton';
import { Photo } from '../../components/ui/Photo';
import { PhotoCredit } from '../../components/ui/PhotoCredit';
import { Reveal } from '../../components/ui/Reveal';
import { Seo } from '../../components/seo/Seo';
import { homeFaqItems } from '../../data/faq';
import { photoSrc } from '../../data/imagery';
import { buildWebSite } from '../../utils/structuredData';

// The route shown as a day-by-day timeline on the home page. If it is ever
// removed, the section simply doesn't render.
const FEATURED_PACKAGE_SLUG = '7-days-ladakh-classic-nubra-pangong';

const features: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: 'Verified local info',
    body: 'Destination guides and an assistant grounded in checked sources.',
    icon: <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3zm-3 9l2 2 4-4" />,
  },
  {
    title: 'Day-by-day routes',
    body: 'Real itineraries with distances, overnight stops and altitudes.',
    icon: <path d="M5 19c0-6 14-4 14-10M5 19a2 2 0 100-4 2 2 0 000 4zm14-10a2 2 0 100-4 2 2 0 000 4z" />,
  },
  {
    title: 'Ask the AI guide',
    body: 'Permits, acclimatisation, best season — answered in plain language.',
    icon: <path d="M4 5h16a1 1 0 011 1v9a1 1 0 01-1 1h-8l-5 4v-4H4a1 1 0 01-1-1V6a1 1 0 011-1z" />,
  },
  {
    title: 'Save your trips',
    body: 'Build an itinerary, tweak every day and keep it in your account.',
    icon: <path d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z" />,
  },
];

const beforeYouGo = [
  {
    title: 'Acclimatise first',
    body: 'Leh sits at about 3,500 m. Most travellers rest for their first day or two before heading higher to the lakes and passes.',
  },
  {
    title: 'Check permits',
    body: 'Some areas, including parts of Nubra and Pangong, need permits. Rules change — confirm current requirements before you travel.',
  },
  {
    title: 'Watch road status',
    body: 'High passes can close for snow or repairs. Verify road conditions with local authorities on the day, not from a guide.',
  },
];

export function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['destinations', 'home'],
    queryFn: () => destinationsApi.list({ limit: 24 }),
  });
  const { data: packages, isLoading: packagesLoading } = useQuery({
    queryKey: ['packages', 'home'],
    queryFn: () => packagesApi.list(),
  });
  const { data: featured } = useQuery({
    queryKey: ['package', FEATURED_PACKAGE_SLUG],
    queryFn: () => packagesApi.bySlug(FEATURED_PACKAGE_SLUG),
    retry: false,
  });

  const destinations = data?.items ?? [];
  const highest = Math.max(0, ...destinations.map((d) => d.altitudeMeters ?? 0));
  const stats = [
    { value: data ? String(data.total) : '—', label: 'Destinations' },
    { value: packages ? String(packages.length) : '—', label: 'Trip routes' },
    { value: highest ? `${highest.toLocaleString()} m` : '—', label: 'Highest pass' },
    { value: 'May–Sep', label: 'Best season' },
  ];

  return (
    <div>
      <Seo
        title="Your intelligent guide to the Land of High Passes"
        description="Explore Ladakh. Plan smarter. Travel deeper — destination knowledge, hand-picked trip packages, an itinerary planner, and an AI assistant grounded in verified local information."
        path="/"
        image={photoSrc(HERO_PHOTO)}
        jsonLd={buildWebSite()}
      />

      <Hero stats={stats} />

      <ThemeStrip />

      {/* Why this site */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <li key={f.title}>
              <Reveal delay={i * 0.08} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sand/40 text-earth">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {f.icon}
                  </svg>
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-stone">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone/65">{f.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Popular destinations — bento grid */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:pb-28">
        <Reveal>
          <SectionHeading
            eyebrow="Destinations"
            title={
              <>
                Places worth <em>the journey</em>
              </>
            }
            subtitle="Lakes, monasteries, valleys and passes — each with altitude, distance from Leh and the best time to go."
            action={{ to: '/places', label: 'View all destinations' }}
          />
        </Reveal>
        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[15rem] lg:grid-cols-4">
            {destinations.slice(0, 5).map((d, i) => (
              <Reveal key={d.id} delay={i * 0.06} className={i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}>
                <DestinationTile destination={d} large={i === 0} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <JourneyMap destinations={destinations} />

      {featured && <RouteTimeline pkg={featured} />}

      {/* Packages */}
      <section className="bg-sand/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Trip packages"
              title={
                <>
                  Hand-picked <em>routes</em> to follow
                </>
              }
              subtitle="Real day-by-day routes from 5 to 10 days — follow one yourself, or send a booking request."
              action={{ to: '/packages', label: 'View all routes' }}
            />
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packagesLoading
              ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
              : packages?.slice(0, 3).map((pkg, i) => (
                  <Reveal key={pkg.id} delay={i * 0.08}>
                    <PackageCard pkg={pkg} />
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      {/* Know before you go */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Good to know"
            title={<>Before you <em>go</em></>}
            action={{ to: '/guide', label: 'Read the full travel guide' }}
          />
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {beforeYouGo.map((tip, i) => (
            <Reveal key={tip.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-stone/10 bg-white p-6 shadow-sm">
                <span className="font-display text-4xl text-accent/40">0{i + 1}</span>
                <h3 className="mt-2 font-display text-xl font-semibold text-stone">{tip.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone/70">{tip.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="bg-sand/20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="FAQ"
              title={
                <>
                  Common <em>questions</em>
                </>
              }
              subtitle="Quick answers to what travellers ask most before a Ladakh trip."
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/faq" className="rounded-full bg-night px-6 py-3 text-sm font-semibold text-snow transition hover:bg-accent">
                See all questions
              </Link>
              <Link to="/contact" className="rounded-full border border-stone/25 px-6 py-3 text-sm font-medium text-stone transition hover:border-accent hover:text-accent">
                Contact us
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-stone/10 bg-white px-5 shadow-sm sm:px-7">
              {homeFaqItems.map((item) => (
                <AccordionItem key={item.q} question={item.q}>
                  {item.a}
                </AccordionItem>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl bg-night text-snow">
            <Photo id="spangmik-sunset" alt="" sizes="(min-width: 1280px) 1200px, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-night/90 via-night/60 to-night/10" />
            <div className="relative flex min-h-[26rem] flex-col justify-center px-6 py-14 sm:px-14">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-ember">
                <span className="h-px w-8 bg-ember" aria-hidden="true" />
                Start here
              </p>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-medium leading-tight sm:text-5xl">
                Your next adventure <em className="text-ember">starts here.</em>
              </h2>
              <p className="mt-4 max-w-md text-snow/80">
                Build a day-by-day itinerary in a couple of minutes, or ask the assistant anything
                you're unsure about first.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/planner" className="rounded-full bg-ember px-7 py-3.5 text-sm font-semibold text-night hover:brightness-110">
                  Start planning <span aria-hidden="true">→</span>
                </Link>
                <Link
                  to="/packages"
                  className="rounded-full border border-snow/40 px-7 py-3.5 text-sm font-medium text-snow hover:border-snow hover:bg-snow/10"
                >
                  See trip packages
                </Link>
              </div>
            </div>
            <PhotoCredit id="spangmik-sunset" />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
