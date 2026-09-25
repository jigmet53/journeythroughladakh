import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { destinationImagery } from '../../data/imagery';
import type { Destination } from '../../types/api';
import { Photo } from '../ui/Photo';
import { SectionHeading } from './SectionHeading';

// The arc, in travel order. Stops with a photo pin are the anchors; the rest are
// waypoints on the way (Khardung La sits ~12 km from Leh, so a photo pin there
// would just overlap Leh's).
const ARC = ['leh-palace', 'khardung-la', 'nubra-valley', 'pangong-lake', 'tso-moriri'];
const WAYPOINTS = new Set(['khardung-la']);

const W = 520;
const H = 680;
// Room around the route: a little at the top, more at the bottom for the label
// that hangs under the lowest pin.
const PAD_X = 70;
const PAD_TOP = 44;
const PAD_BOTTOM = 84;

interface Stop {
  d: Destination;
  x: number;
  y: number;
}

/** Equirectangular projection with longitude scaled by cos(latitude), fitted
 * to the viewBox — accurate enough for a schematic of a ~200 km region. */
function layout(destinations: Destination[]): Stop[] {
  const found = ARC.map((slug) => destinations.find((d) => d.slug === slug)).filter(
    (d): d is Destination => !!d && d.latitude != null && d.longitude != null,
  );
  if (found.length < 2) return [];
  const midLat = found.reduce((s, d) => s + d.latitude!, 0) / found.length;
  const k = Math.cos((midLat * Math.PI) / 180);
  const xs = found.map((d) => d.longitude! * k);
  const ys = found.map((d) => -d.latitude!);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const availH = H - PAD_TOP - PAD_BOTTOM;
  const scale = Math.min((W - 2 * PAD_X) / (maxX - minX || 1), availH / (maxY - minY || 1));
  const offX = (W - (maxX - minX) * scale) / 2;
  const offY = PAD_TOP + (availH - (maxY - minY) * scale) / 2;
  return found.map((d, i) => ({ d, x: offX + (xs[i] - minX) * scale, y: offY + (ys[i] - minY) * scale }));
}

/** Catmull-Rom through the stops, converted to cubic Béziers, so the route
 * reads as a flowing road rather than straight segments. */
function smoothPath(pts: Stop[]): string {
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C${p1.x + (p2.x - p0.x) / 6},${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6},${p2.y - (p3.y - p1.y) / 6} ${p2.x},${p2.y}`;
  }
  return d;
}

export function JourneyMap({ destinations }: { destinations: Destination[] }) {
  // The stop the visitor is pointing at, in the list or on the map — the other
  // side lights up to match.
  const [active, setActive] = useState<string | null>(null);
  const stops = layout(destinations);
  if (stops.length === 0) return null;

  const highest = Math.max(...stops.map((s) => s.d.altitudeMeters ?? 0));
  const farthest = Math.max(...stops.map((s) => s.d.distanceFromLeh ?? 0));
  const stats = [
    { value: String(stops.length), label: 'Stops' },
    highest ? { value: `${highest.toLocaleString()} m`, label: 'Highest point' } : null,
    farthest ? { value: `${farthest} km`, label: 'Farthest from Leh' } : null,
  ].filter((s): s is { value: string; label: string } => !!s);

  return (
    <section className="relative isolate overflow-hidden bg-night text-snow">
      {/* Soft glows behind each column */}
      <div className="absolute -right-40 top-1/2 h-[40rem] w-[40rem] -translate-y-1/2 rounded-full bg-ember/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-sky/5 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:py-28">
        <div>
          <SectionHeading
            tone="dark"
            eyebrow="Journey map"
            title={
              <>
                One arc across <em>the roof</em> of India
              </>
            }
            subtitle="Most Ladakh routes are variations on the same great arc — from Leh over Khardung La into Nubra, across to Pangong, and out to the quiet lakes of Changthang."
          />

          <dl className="mt-8 grid grid-cols-3 divide-x divide-snow/10 rounded-2xl border border-snow/10 bg-snow/[0.03]">
            {stats.map((s) => (
              <div key={s.label} className="px-4 py-4 text-center">
                <dd className="font-display text-2xl font-medium text-ember sm:text-3xl">{s.value}</dd>
                <dt className="mt-1 text-[10px] uppercase tracking-wider text-snow/50 sm:text-[11px]">{s.label}</dt>
              </div>
            ))}
          </dl>

          <ol className="mt-6 space-y-3">
            {stops.map(({ d }, i) => {
              const isActive = active === d.slug;
              return (
                <li key={d.id} onMouseEnter={() => setActive(d.slug)} onMouseLeave={() => setActive(null)}>
                  <Link
                    to={`/places/${d.slug}`}
                    onFocus={() => setActive(d.slug)}
                    onBlur={() => setActive(null)}
                    className={`group flex items-center gap-4 rounded-2xl border p-3 pr-4 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ember ${
                      isActive ? 'border-ember/60 bg-snow/10' : 'border-snow/10 bg-snow/[0.04] hover:border-ember/40'
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ember/60 text-xs font-semibold text-ember">
                      {i + 1}
                    </span>
                    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-night">
                      <Photo id={destinationImagery[d.slug]?.hero} src={d.heroImageUrl} alt="" sizes="64px" className="transition-transform duration-500 group-hover:scale-110" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg leading-tight">{d.name}</span>
                      <span className="mt-0.5 line-clamp-1 block text-xs text-snow/55">{d.summary}</span>
                      <span className="mt-1.5 flex flex-wrap gap-x-3 text-[11px] font-medium text-ember">
                        {d.altitudeMeters != null && <span>{d.altitudeMeters.toLocaleString()} m</span>}
                        {d.distanceFromLeh != null && <span>{d.distanceFromLeh === 0 ? 'In Leh' : `${d.distanceFromLeh} km from Leh`}</span>}
                      </span>
                    </span>
                    <span aria-hidden="true" className={`text-ember transition ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>

          <Link
            to="/packages"
            className="mt-8 inline-flex rounded-full bg-ember px-7 py-3.5 text-sm font-semibold text-night transition hover:brightness-110"
          >
            See routes that follow it <span aria-hidden="true" className="ml-1">→</span>
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-xl" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" role="img" aria-label="Schematic map of the route: Leh, Khardung La, Nubra Valley, Pangong Lake and Tso Moriri">
            {/* faint contour rings for a topographic feel */}
            {[70, 120, 175, 235, 300].map((r, i) => (
              <ellipse key={r} cx={W / 2} cy={H / 2} rx={r * 0.95} ry={r * 1.05} fill="none" stroke="currentColor" strokeWidth="1" className="text-snow/[0.06]" strokeDasharray={i % 2 ? '2 6' : undefined} />
            ))}
            <motion.path
              d={smoothPath(stops)}
              fill="none"
              stroke="#E7A86F"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="1 9"
              className="animate-flow motion-reduce:animate-none"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
            />
          </svg>

          {stops.map(({ d, x, y }, i) => {
            const isWaypoint = WAYPOINTS.has(d.slug);
            const isActive = active === d.slug;
            // Photo pins carry their label centred underneath, so it can never clip at
            // the map's left/right edge on a narrow screen. A waypoint (Khardung La
            // sits ~12 km from Leh) puts a small backed label to its right instead.
            const label = isWaypoint ? (
              <span className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-night/80 px-1.5 py-0.5 text-[11px] text-snow/90 sm:text-xs">
                {d.name}
                {d.altitudeMeters != null && <span className="text-snow/55"> · {d.altitudeMeters.toLocaleString()} m</span>}
              </span>
            ) : (
              <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 w-28 -translate-x-1/2 text-center [text-shadow:0_0_6px_#14161A,0_0_12px_#14161A] sm:w-36">
                <span className={`block font-display text-sm font-medium leading-tight transition-colors sm:text-base ${isActive ? 'text-ember' : ''}`}>{d.name}</span>
                {d.altitudeMeters != null && (
                  <span className="block text-[11px] text-snow/55 sm:text-xs">{d.altitudeMeters.toLocaleString()} m</span>
                )}
              </span>
            );
            return (
              <motion.div
                key={d.id}
                className="absolute"
                style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.15 * i }}
              >
                <Link
                  to={`/places/${d.slug}`}
                  aria-label={d.name}
                  onMouseEnter={() => setActive(d.slug)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(d.slug)}
                  onBlur={() => setActive(null)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                >
                  {isWaypoint ? (
                    <span className="relative flex h-4 w-4 items-center justify-center">
                      <span className={`absolute inset-0 rounded-full bg-ember/30 transition ${isActive ? 'scale-150' : ''}`} />
                      <span className="h-2.5 w-2.5 rounded-full bg-ember" />
                      {label}
                    </span>
                  ) : (
                    <span className="relative block h-11 w-11 sm:h-12 sm:w-12">
                      {isActive && <span className="absolute inset-0 animate-ping rounded-full bg-ember/40 motion-reduce:animate-none" aria-hidden="true" />}
                      <span className={`absolute inset-0 overflow-hidden rounded-full ring-2 ring-ember ring-offset-2 ring-offset-night transition ${isActive ? 'scale-125' : ''}`}>
                        <Photo id={destinationImagery[d.slug]?.hero} src={d.heroImageUrl} alt="" sizes="60px" />
                      </span>
                      {label}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
      <p className="relative mx-auto max-w-7xl px-4 pb-6 text-xs text-snow/40 sm:px-6">
        Schematic map, not for navigation. Roads and passes open and close with the season — check current status before you go.
      </p>
    </section>
  );
}
