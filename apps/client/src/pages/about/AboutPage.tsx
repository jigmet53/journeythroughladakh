import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { destinationsApi } from '../../services/destinations.api';
import { packagesApi } from '../../services/packages.api';
import { PageHero } from '../../components/ui/PageHero';
import { Photo } from '../../components/ui/Photo';
import { PhotoCredit } from '../../components/ui/PhotoCredit';
import { Reveal } from '../../components/ui/Reveal';
import { emberButton } from '../../components/ui/forms';
import { Seo } from '../../components/seo/Seo';

const pillars = [
  {
    title: 'Explore',
    body: 'Destination guides for lakes, monasteries, valleys and passes, each with altitude, distance from Leh, the best time to go and how to reach it.',
    to: '/places',
    cta: 'Browse destinations',
  },
  {
    title: 'Follow a route',
    body: 'Hand-picked, day-by-day trip packages from 5 to 10 days, with overnight stops, distances and things to know. Follow one yourself, or send a booking request.',
    to: '/packages',
    cta: 'See the routes',
  },
  {
    title: 'Plan your own',
    body: 'Tell the planner your days, pace and interests and get a draft itinerary you can reorder, annotate, save and share.',
    to: '/planner',
    cta: 'Open the planner',
  },
  {
    title: 'Ask the guide',
    body: 'An AI assistant that answers from the destination knowledge on this site, so its replies are grounded rather than guessed.',
    to: '/ai',
    cta: 'Ask a question',
  },
];

const principles = [
  { title: 'Honest about what changes', body: 'Permits, road status and weather change constantly. We say so, and point you to a local source instead of pretending to know today’s answer.' },
  { title: 'Editorial first', body: 'Destination and route information is written and checked by people. The AI guide draws on that same material — it does not invent its own.' },
  { title: 'Credit where it is due', body: 'Every photograph is freely licensed and credited to its photographer, with the licence and a link to the original.' },
  { title: 'Travel with care', body: 'We favour slower, better-acclimatised, lower-impact travel — for your health and for the places you visit.' },
];

export function AboutPage() {
  const { data: destinations } = useQuery({
    queryKey: ['destinations', 'about'],
    queryFn: () => destinationsApi.list({ limit: 1 }),
  });
  const { data: packages } = useQuery({ queryKey: ['packages'], queryFn: () => packagesApi.list() });

  const stats = [
    { value: destinations ? String(destinations.total) : '—', label: 'Destinations' },
    { value: packages ? String(packages.length) : '—', label: 'Trip routes' },
    { value: '5–10', label: 'Days per route' },
    { value: 'Free', label: 'To send a request' },
  ];

  return (
    <div>
      <Seo
        title="About us"
        description="Journey Through Ladakh is a travel guide to Ladakh — destinations, hand-picked routes you can request to book, an itinerary planner and a grounded AI assistant."
        path="/about"
      />
      <PageHero
        photo="tso-moriri"
        eyebrow="About us"
        title={
          <>
            A guide to the <em>Land of High Passes</em>
          </>
        }
        subtitle="Helping travellers plan a Ladakh trip that is safer, slower and richer."
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24">
        <Reveal>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            Our purpose
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium text-stone sm:text-5xl">
            Why this guide <em className="font-medium text-accent">exists</em>
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-stone/75">
            <p>
              Ladakh rewards preparation. It is high, remote and seasonal, and the difference between a good trip and
              a difficult one is often a few pieces of information — how to pace the altitude, which roads are open,
              which places belong on the same day.
            </p>
            <p>
              Journey Through Ladakh puts that in one place: clear destination guides, real day-by-day routes, a
              planner that turns your dates into a draft itinerary, and an assistant that answers from checked
              knowledge. Follow a route on your own, or send us a booking request and we'll get back to you to make it happen.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-night shadow-xl">
            <Photo id="thiksey-monastery" alt="Prayer flags and an ochre courtyard at Thiksey Monastery" sizes="(min-width: 1024px) 40vw, 100vw" />
            <PhotoCredit id="thiksey-monastery" />
          </div>
        </Reveal>
      </section>

      <section className="bg-night text-snow">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 py-10 sm:px-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="px-2 py-4 text-center">
              <dd className="font-display text-4xl font-medium text-ember">{s.value}</dd>
              <dt className="mt-1 text-xs uppercase tracking-wider text-snow/60">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <Reveal>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            What you'll find
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium text-stone sm:text-5xl">
            Four ways to <em className="font-medium text-accent">use it</em>
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-stone/10 bg-white p-6 shadow-sm">
                <span className="font-display text-4xl text-accent/40">0{i + 1}</span>
                <h3 className="mt-2 font-display text-2xl font-medium text-stone">{p.title}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-stone/70">{p.body}</p>
                <Link to={p.to} className="mt-4 text-sm font-medium text-accent hover:underline">
                  {p.cta} →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-sand/20">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <Reveal>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              How we work
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium text-stone sm:text-5xl">
              Principles we <em className="font-medium text-accent">keep</em>
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 0.08}>
                <div className="h-full border-l-4 border-accent pl-5">
                  <h3 className="font-display text-xl font-medium text-stone">{p.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-stone/70">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="rounded-3xl bg-night p-8 text-center text-snow sm:p-14">
          <h2 className="font-display text-3xl font-medium sm:text-4xl">
            Spotted something <em className="font-medium text-ember">wrong?</em>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-snow/75">
            Accurate information matters most when it affects safety. If a fact is out of date, tell us and
            we'll fix it.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className={emberButton}>
              Contact us
            </Link>
            <Link to="/guide" className="rounded-full border border-snow/40 px-7 py-3 text-sm font-medium text-snow hover:border-snow hover:bg-snow/10">
              Read the travel guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
