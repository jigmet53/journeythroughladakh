import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '../../components/ui/PageHero';
import { Reveal } from '../../components/ui/Reveal';
import { emberButton } from '../../components/ui/forms';
import { Seo } from '../../components/seo/Seo';
import { buildBreadcrumbList } from '../../utils/structuredData';

const sections = [
  { id: 'best-time', label: 'Best time to visit' },
  { id: 'getting-there', label: 'Getting there' },
  { id: 'permits', label: 'Permits & rules' },
  { id: 'altitude', label: 'Altitude & health' },
  { id: 'packing', label: 'What to pack' },
  { id: 'responsible', label: 'Travel with care' },
];

type Level = 'peak' | 'good' | 'limited' | 'winter';

// Broad seasonal patterns, not forecasts — conditions vary year to year.
const months: { m: string; level: Level; note: string }[] = [
  { m: 'Jan', level: 'winter', note: 'Deep winter; most high roads closed' },
  { m: 'Feb', level: 'winter', note: 'Very cold; limited services' },
  { m: 'Mar', level: 'winter', note: 'Still freezing; few visitors' },
  { m: 'Apr', level: 'limited', note: 'Thawing; some roads reopening' },
  { m: 'May', level: 'good', note: 'Passes reopening; cool and quiet' },
  { m: 'Jun', level: 'peak', note: 'Warm days; routes generally open' },
  { m: 'Jul', level: 'peak', note: 'Peak season; book ahead' },
  { m: 'Aug', level: 'peak', note: 'Peak season; landslides possible on approach roads' },
  { m: 'Sep', level: 'good', note: 'Clear skies, cooler nights, fewer crowds' },
  { m: 'Oct', level: 'limited', note: 'Cold nights; early snow can close passes' },
  { m: 'Nov', level: 'winter', note: 'Winter sets in' },
  { m: 'Dec', level: 'winter', note: 'Very cold; roads mostly closed' },
];

const levelStyle: Record<Level, { tile: string; label: string }> = {
  peak: { tile: 'bg-night text-snow', label: 'Peak season' },
  good: { tile: 'bg-ember text-night', label: 'Great shoulder month' },
  limited: { tile: 'bg-sand/50 text-stone', label: 'Limited access' },
  winter: { tile: 'bg-stone/10 text-stone/70', label: 'Winter' },
};

const packing = [
  { title: 'Clothing', items: ['Warm layers — fleece and a down jacket', 'Windproof and waterproof shell', 'Thermal base layers', 'Sun hat, warm hat and gloves', 'Sturdy, broken-in shoes'] },
  { title: 'Health', items: ['Sunscreen (UV is strong at altitude) and lip balm', 'Sunglasses with UV protection', 'Personal medication and a basic first-aid kit', 'Water bottle and purification tablets', 'Talk to your doctor about altitude prevention'] },
  { title: 'Gear', items: ['Power bank and a universal adapter', 'Torch or headlamp', 'Daypack with a rain cover', 'Offline maps downloaded in advance', 'Reusable bag to carry out your rubbish'] },
  { title: 'Documents & money', items: ['Photo ID and several photocopies', 'Permit paperwork, if your route needs it', 'Travel insurance covering altitude and evacuation', 'Enough cash for remote stays', 'Printed or offline copy of your itinerary'] },
];

const care = [
  { title: 'Acclimatise, don’t rush', body: 'Give your body time. Overloaded itineraries are the most common cause of avoidable altitude trouble.' },
  { title: 'Respect sacred places', body: 'In monasteries, dress modestly, remove shoes and hats where asked, and ask before photographing people or inside prayer halls. Walk clockwise around stupas and prayer wheels.' },
  { title: 'Carry out what you carry in', body: 'Waste is hard to manage in this fragile, arid region. Avoid single-use plastic, refill your bottle, and take rubbish back to town.' },
  { title: 'Save water', body: 'Water is scarce, especially in villages. Keep showers short and choose stays that treat and reuse water.' },
  { title: 'Spend locally', body: 'Stay in family-run guesthouses, eat local food and hire local drivers and guides. It keeps your money in the community.' },
  { title: 'Give wildlife space', body: 'Keep your distance from animals such as marmots, wild asses and cranes, and never feed them.' },
];

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    if (!('IntersectionObserver' in window) || els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -60% 0px' },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-stone/10 py-12 first:pt-0 last:border-b-0">
      <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
        <span className="h-px w-8 bg-accent" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-medium text-stone sm:text-4xl [&_em]:font-medium [&_em]:text-accent">{title}</h2>
      <div className="mt-6 space-y-5 text-stone/75 leading-relaxed">{children}</div>
    </section>
  );
}

const ids = sections.map((s) => s.id);

export function GuidePage() {
  const active = useActiveSection(ids);

  return (
    <div>
      <Seo
        title="Ladakh travel guide — best time, permits, altitude & packing"
        description="A practical guide to visiting Ladakh: the best months to go, getting to Leh, permits, avoiding altitude sickness, what to pack and how to travel responsibly."
        path="/guide"
        jsonLd={buildBreadcrumbList([{ name: 'Travel guide', path: '/guide' }])}
      />
      <PageHero
        photo="baralacha-la"
        eyebrow="Travel guide"
        title={
          <>
            Know before <em>you go</em>
          </>
        }
        subtitle="The practical basics of a Ladakh trip — when to go, how to get there, staying healthy at altitude and travelling with care."
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[14rem_1fr]">
        <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-stone/50">On this page</p>
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            {sections.map((s) => (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  aria-current={active === s.id ? 'true' : undefined}
                  className={`block whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition lg:rounded-lg lg:border-l-2 lg:rounded-l-none lg:py-2 ${
                    active === s.id
                      ? 'bg-night text-snow lg:border-accent lg:bg-transparent lg:font-medium lg:text-accent'
                      : 'border border-stone/15 text-stone/70 hover:text-accent lg:border-y-0 lg:border-r-0 lg:border-transparent'
                  }`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <Section id="best-time" eyebrow="When to go" title={<>Best time to <em>visit</em></>}>
            <p>
              Most travellers visit between May and September, when the high passes are generally open. Snow
              blocks many roads for the rest of the year. These are broad seasonal patterns rather than forecasts —
              conditions change year to year, so check road status locally before you travel.
            </p>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {months.map(({ m, level, note }) => (
                <li key={m} className={`rounded-2xl p-4 ${levelStyle[level].tile}`}>
                  <p className="font-display text-xl font-medium">{m}</p>
                  <p className="mt-1 text-xs leading-snug opacity-80">{note}</p>
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-stone/60" aria-label="Legend">
              {(Object.keys(levelStyle) as Level[]).map((l) => (
                <li key={l} className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${levelStyle[l].tile.split(' ')[0]} ring-1 ring-stone/15`} aria-hidden="true" />
                  {levelStyle[l].label}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="getting-there" eyebrow="Arriving" title={<>Getting <em>there</em></>}>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { t: 'By air', b: 'Leh airport has flights from Delhi and some other cities, and is the fastest way in. It gives no acclimatisation, so plan a full rest day on arrival.' },
                { t: 'Manali to Leh road', b: 'A roughly 430–480 km highway usually driven over two days, crossing several passes above 4,800 m. Typically open from early summer to autumn — dates vary.' },
                { t: 'Srinagar to Leh road', b: 'Around 420 km via Zoji La and Kargil, generally open for more of the year than the Manali road but still seasonal. Check status before you set out.' },
              ].map((c) => (
                <div key={c.t} className="rounded-2xl border border-stone/10 bg-white p-5 shadow-sm">
                  <h3 className="font-display text-xl font-medium text-stone">{c.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{c.b}</p>
                </div>
              ))}
            </div>
            <p>
              Whichever way you arrive, the first day should be easy. Our{' '}
              <Link to="/packages" className="font-medium text-accent hover:underline">
                trip packages
              </Link>{' '}
              all build this in.
            </p>
          </Section>

          <Section id="permits" eyebrow="Rules" title={<>Permits &amp; <em>rules</em></>}>
            <p>
              Some areas close to the border — including parts of the Nubra, Pangong and Tso Moriri regions — are
              restricted and need a permit. The rules differ for Indian and foreign nationals, and the fees, forms and
              places to apply change.
            </p>
            <ol className="list-decimal space-y-2 pl-6 marker:font-semibold marker:text-accent">
              <li>Check which permits your route needs with the Leh district administration or tourism office, or the official portal.</li>
              <li>Apply through the official channel, or ask your Leh hotel or a registered travel agent to arrange it.</li>
              <li>Carry the permit and several photocopies, plus photo ID, and expect checkpoints.</li>
            </ol>
            <p className="rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm">
              We do not issue permits and cannot confirm current requirements. Always verify with an official local source.
            </p>
          </Section>

          <Section id="altitude" eyebrow="Health" title={<>Altitude &amp; <em>health</em></>}>
            <p>
              Leh sits at about 3,500 m and many of the best places are far higher. Altitude sickness can affect anyone,
              regardless of fitness, and the best defence is going up slowly.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-stone/10 bg-white p-5 shadow-sm">
                <h3 className="font-display text-xl font-medium text-stone">Do</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {['Rest for the first 24–48 hours', 'Drink plenty of water', 'Eat light, regular meals', 'Gain height gradually; sleep lower when you can', 'Tell your group how you feel'].map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="text-accent" aria-hidden="true">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-stone/10 bg-white p-5 shadow-sm">
                <h3 className="font-display text-xl font-medium text-stone">Avoid</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {['Alcohol and smoking in the first days', 'Heavy exercise on arrival', 'Flying in and going straight to a high pass', 'Ignoring a headache or nausea', 'Travelling alone with symptoms'].map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="text-red-600" aria-hidden="true">✕</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
              <strong>Warning signs:</strong> a worsening headache, vomiting, confusion, unsteadiness, or breathlessness
              at rest. Do not go higher. If symptoms are severe, descend and get medical help. This is general
              information, not medical advice — talk to your doctor before you travel.
            </p>
          </Section>

          <Section id="packing" eyebrow="Checklist" title={<>What to <em>pack</em></>}>
            <p>Weather swings from hot sun to freezing wind in a day, so layers matter more than any single heavy item.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {packing.map((g) => (
                <div key={g.title} className="rounded-2xl border border-stone/10 bg-white p-5 shadow-sm">
                  <h3 className="font-display text-xl font-medium text-stone">{g.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {g.items.map((i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section id="responsible" eyebrow="Etiquette" title={<>Travel with <em>care</em></>}>
            <p>Ladakh is fragile and its communities live with the effects of every visitor. A few habits go a long way.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {care.map((c, i) => (
                <Reveal key={c.title} delay={(i % 2) * 0.08}>
                  <div className="h-full rounded-2xl bg-sand/25 p-5">
                    <h3 className="font-display text-lg font-medium text-stone">{c.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed">{c.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Section>

          <div className="mt-10 rounded-3xl bg-night p-8 text-center text-snow sm:p-10">
            <h2 className="font-display text-3xl font-medium">
              Ready to <em className="font-medium text-ember">plan?</em>
            </h2>
            <p className="mx-auto mt-2 max-w-md text-snow/75">Turn this into a day-by-day itinerary, or get answers to your specific questions.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/planner" className={emberButton}>
                Plan my trip
              </Link>
              <Link to="/faq" className="rounded-full border border-snow/40 px-7 py-3 text-sm font-medium text-snow hover:border-snow hover:bg-snow/10">
                Read the FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
