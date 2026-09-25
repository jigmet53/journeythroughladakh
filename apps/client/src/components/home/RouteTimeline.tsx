import { Link } from 'react-router-dom';
import { destinationImagery } from '../../data/imagery';
import type { PhotoId } from '../../data/photos';
import type { TripPackageDetail } from '../../types/api';
import { Photo } from '../ui/Photo';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from './SectionHeading';

/** A real package's itinerary as a vertical timeline, alternating sides on wide
 * screens, with each day's destination photo where we have one. */
/** Pick the destination's hero photo, or the next gallery photo if an earlier day
 * already used it, so consecutive days in the same place don't repeat a picture. */
function pickPhoto(slug: string | undefined, used: Set<PhotoId>) {
  const imagery = slug ? destinationImagery[slug] : undefined;
  const id = imagery && [imagery.hero, ...imagery.gallery].find((p) => !used.has(p));
  if (!id) return undefined;
  used.add(id);
  return { id, isHero: id === imagery!.hero };
}

export function RouteTimeline({ pkg }: { pkg: TripPackageDetail }) {
  const used = new Set<PhotoId>();
  const days = pkg.itinerary.map((day) => ({ day, photo: pickPhoto(day.destination?.slug, used) }));
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <SectionHeading
        eyebrow={`${pkg.nights} nights · ${pkg.days} days`}
        title={
          <>
            The classic route, <em>day by day</em>
          </>
        }
        subtitle={pkg.summary}
        action={{ to: `/packages/${pkg.slug}`, label: 'Full route details' }}
      />

      <ol className="relative mt-14">
        <span aria-hidden="true" className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-accent/60 via-stone/15 to-transparent lg:left-1/2" />
        {days.map(({ day, photo }, i) => {
          const flip = i % 2 === 1;
          return (
            <li key={day.id} className="relative pb-12 pl-12 last:pb-0 lg:pl-0">
              <span aria-hidden="true" className="absolute left-4 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent bg-snow lg:left-1/2" />
              <Reveal className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-24">
                <div className={flip ? 'lg:order-2' : 'lg:text-right'}>
                  <span className="inline-block rounded-full bg-night px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ember">
                    Day {day.dayNumber}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-medium text-stone">{day.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone/70">{day.description}</p>
                  <p className={`mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone/55 ${flip ? '' : 'lg:justify-end'}`}>
                    {day.distanceKm != null && <span>{day.distanceKm} km</span>}
                    {day.driveHours != null && <span>~{day.driveHours} h drive</span>}
                    {day.overnightAt && <span>Overnight: {day.overnightAt}</span>}
                  </p>
                </div>
                {photo ? (
                  <Link
                    to={`/places/${day.destination!.slug}`}
                    className={`group relative mt-5 block aspect-[16/10] overflow-hidden rounded-2xl bg-night shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:mt-0 ${
                      flip ? 'lg:order-1' : ''
                    }`}
                  >
                    <Photo id={photo.id} alt={photo.isHero ? day.destination!.name : undefined} sizes="(min-width: 1024px) 40vw, 90vw" className="transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent" />
                    {photo.isHero && (
                      <span className="absolute bottom-3 left-4 font-display text-lg text-snow">{day.destination!.name}</span>
                    )}
                  </Link>
                ) : (
                  <div className={`hidden lg:block ${flip ? 'lg:order-1' : ''}`} />
                )}
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
