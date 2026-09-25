import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Photo } from '../ui/Photo';
import { PhotoCredit } from '../ui/PhotoCredit';
import type { PhotoId } from '../../data/photos';

// Three moods of Ladakh, crossfaded: golden dusk on the Indus, the deep blue of
// Pangong, and a pink-lit peak at Spangmik.
const SLIDES: { photo: PhotoId; place: string; detail: string }[] = [
  { photo: 'hero-sunset-indus', place: 'The Indus valley', detail: 'Leh, 3,500 m' },
  { photo: 'pangong-lake', place: 'Pangong Tso', detail: '4,225 m' },
  { photo: 'spangmik-sunset', place: 'Spangmik', detail: 'Pangong Lake' },
];
export const HERO_PHOTO: PhotoId = SLIDES[0].photo;
const SLIDE_MS = 7000;

const STYLES = ['Adventure', 'Couple', 'Family', 'Friends', 'Solo'];

// Film grain: a tiny inline SVG noise tile, blended over the photo at low opacity.
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

interface HeroProps {
  stats: { value: string; label: string }[];
}

const barField =
  'w-full bg-transparent px-0 py-1 text-base text-snow placeholder:text-snow/45 focus:outline-none';
const barLabel = 'block text-[11px] font-semibold uppercase tracking-wider text-snow/55';

export function Hero({ stats }: HeroProps) {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Slideshow. Autoplay is paused by the visitor, on hover/focus, and never runs
  // for people who prefer reduced motion.
  const [slide, setSlide] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const playing = !userPaused && !hovering && !reduce;
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [playing]);

  // Parallax: the photo drifts slower than the page and the copy fades as you leave.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0px', '-60px']);

  // Planner bar
  const [tab, setTab] = useState<'plan' | 'find'>('plan');
  const [from, setFrom] = useState('');
  const [days, setDays] = useState(7);
  const [style, setStyle] = useState('');
  const [query, setQuery] = useState('');

  const submitPlan = (e: FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams({ days: String(days) });
    if (from.trim()) p.set('from', from.trim());
    if (style) p.set('style', style.toLowerCase());
    navigate(`/planner?${p}`);
  };
  const submitFind = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/places?q=${encodeURIComponent(q)}` : '/places');
  };

  const tabClass = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition ${
      active ? 'bg-snow text-night' : 'text-snow/75 hover:text-snow'
    }`;
  const lines = ['Where the road', <>meets the <em className="font-medium text-ember">sky.</em></>];
  const current = SLIDES[slide];

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="relative isolate -mt-16 flex min-h-[100svh] flex-col overflow-hidden bg-night text-snow"
    >
      {/* Photo slides, crossfaded, with a slow zoom and scroll parallax */}
      <motion.div className="absolute inset-x-0 -top-[8%] -z-10 h-[116%]" style={reduce ? undefined : { y: photoY }}>
        {SLIDES.map((s, i) => (
          <div key={s.photo} className={`absolute inset-0 transition-opacity duration-[1800ms] ease-in-out ${i === slide ? 'opacity-100' : 'opacity-0'}`} aria-hidden={i !== slide}>
            <Photo id={s.photo} alt="" priority={i === 0} sizes="100vw" className="animate-kenburns motion-reduce:animate-none" />
          </div>
        ))}
      </motion.div>

      {/* Cinematic grade: vignette, warm light leak, bottom + left shade, grain */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(20,22,26,0.6) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 12% 92%, rgba(231,168,111,0.28), transparent 55%)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-night/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-night/70 via-night/15 to-transparent" />
        <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      </div>

      <motion.div
        className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pt-24 sm:px-6"
        style={reduce ? undefined : { opacity: copyOpacity, y: copyY }}
      >
        <div className="flex flex-1 flex-col justify-center pb-10">
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-ember"
          >
            <span className="h-px w-12 bg-ember" aria-hidden="true" />
            The land of high passes
          </motion.p>

          <h1 className="mt-5 font-display text-[2.75rem] font-medium leading-[0.98] sm:text-[min(6rem,12vh)] lg:text-[min(7.25rem,12.5vh)]">
            {lines.map((line, i) => (
              <span key={i} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                <motion.span
                  className="block"
                  initial={{ y: '112%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.25 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mt-6 max-w-xl text-base text-snow/85 sm:text-lg"
          >
            Lakes that change colour by the hour, monasteries on cliff edges and the world's highest
            roads — planned day by day, with an assistant that knows the way.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/places" className="rounded-full bg-ember px-7 py-3.5 text-sm font-semibold text-night transition hover:brightness-110">
              Explore destinations <span aria-hidden="true">→</span>
            </Link>
            <Link to="/ai" className="rounded-full border border-snow/40 px-7 py-3.5 text-sm font-medium text-snow backdrop-blur-sm transition hover:border-snow hover:bg-snow/10">
              Ask the AI guide
            </Link>
          </motion.div>

          {/* Planner: a wide glass bar, like a film's title card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.05 }}
            className="mt-8 max-w-5xl"
          >
            <div role="tablist" aria-label="What would you like to do?" className="mb-3 inline-flex gap-1 rounded-full border border-snow/15 bg-night/40 p-1 backdrop-blur-md">
              <button role="tab" aria-selected={tab === 'plan'} onClick={() => setTab('plan')} className={tabClass(tab === 'plan')}>
                Plan a trip
              </button>
              <button role="tab" aria-selected={tab === 'find'} onClick={() => setTab('find')} className={tabClass(tab === 'find')}>
                Find a place
              </button>
            </div>

            {tab === 'plan' ? (
              <form
                onSubmit={submitPlan}
                className="grid gap-4 rounded-3xl border border-snow/15 bg-night/45 p-4 shadow-2xl backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-[1.3fr_auto_1fr_auto] lg:items-center lg:gap-0 lg:p-3 lg:pl-7"
              >
                <div className="lg:pr-6">
                  <label htmlFor="hero-from" className={barLabel}>Starting from</label>
                  <input id="hero-from" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="e.g. Delhi" className={barField} />
                </div>
                <div className="lg:border-l lg:border-snow/15 lg:px-6">
                  <span id="hero-days-label" className={barLabel}>Days</span>
                  <div role="group" aria-labelledby="hero-days-label" className="mt-0.5 flex items-center gap-3">
                    <button type="button" aria-label="Fewer days" onClick={() => setDays((d) => Math.max(1, d - 1))} className="h-7 w-7 rounded-full border border-snow/25 text-snow/80 hover:bg-snow/10">−</button>
                    <span aria-live="polite" className="w-6 text-center text-base font-semibold">{days}</span>
                    <button type="button" aria-label="More days" onClick={() => setDays((d) => Math.min(21, d + 1))} className="h-7 w-7 rounded-full border border-snow/25 text-snow/80 hover:bg-snow/10">+</button>
                  </div>
                </div>
                <div className="lg:border-l lg:border-snow/15 lg:px-6">
                  <label htmlFor="hero-style" className={barLabel}>Travel style</label>
                  <select id="hero-style" value={style} onChange={(e) => setStyle(e.target.value)} className={`${barField} cursor-pointer [&>option]:text-night`}>
                    <option value="">Any style</option>
                    {STYLES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="rounded-2xl bg-ember px-8 py-4 text-sm font-semibold text-night transition hover:brightness-110 sm:col-span-2 lg:col-span-1">
                  Build my itinerary <span aria-hidden="true">→</span>
                </button>
              </form>
            ) : (
              <form onSubmit={submitFind} role="search" className="flex flex-col gap-3 rounded-3xl border border-snow/15 bg-night/45 p-4 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center lg:p-3 lg:pl-7">
                <div className="flex-1">
                  <label htmlFor="hero-search" className={barLabel}>Search destinations</label>
                  <input id="hero-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try “blue lake near Leh”" className={barField} />
                </div>
                <button type="submit" className="rounded-2xl bg-ember px-8 py-4 text-sm font-semibold text-night transition hover:brightness-110">
                  Search <span aria-hidden="true">→</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Bottom rail: facts on the left, slide caption and controls on the right */}
        <div className="flex flex-col gap-5 border-t border-snow/15 py-5 lg:flex-row lg:items-center lg:justify-between">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 sm:flex sm:gap-8">
            {stats.map((s) => (
              <div key={s.label} className="whitespace-nowrap">
                <dd className="font-display text-2xl font-medium leading-none">{s.value}</dd>
                <dt className="mt-1 text-[11px] uppercase tracking-wider text-snow/55">{s.label}</dt>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="text-sm" aria-live="off">
              <span className="font-display text-ember">0{slide + 1}</span>
              <span className="text-snow/40"> / 0{SLIDES.length}</span>
              <span className="ml-3 text-snow/85">{current.place}</span>
              <span className="hidden text-snow/50 xl:inline"> · {current.detail}</span>
            </p>
            <div className="flex items-center gap-2" role="group" aria-label="Hero photo slideshow">
              {SLIDES.map((s, i) => (
                <button
                  key={s.photo}
                  type="button"
                  aria-label={`Show photo ${i + 1}: ${s.place}`}
                  aria-current={i === slide}
                  onClick={() => setSlide(i)}
                  className="group py-2"
                >
                  <span className={`block h-0.5 rounded-full transition-all duration-500 ${i === slide ? 'w-10 bg-ember' : 'w-5 bg-snow/40 group-hover:bg-snow/70'}`} />
                </button>
              ))}
              {!reduce && (
                <button
                  type="button"
                  onClick={() => setUserPaused((p) => !p)}
                  aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
                  className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-snow/25 text-snow/80 hover:bg-snow/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                >
                  {userPaused ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l13 8-13 8z" /></svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
                  )}
                </button>
              )}
            </div>
            <PhotoCredit id={current.photo} inline className="max-w-[14rem]" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
