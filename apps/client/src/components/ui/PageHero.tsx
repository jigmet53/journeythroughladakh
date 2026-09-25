import type { ReactNode } from 'react';
import type { PhotoId } from '../../data/photos';
import { Photo } from './Photo';
import { PhotoCredit } from './PhotoCredit';

interface PageHeroProps {
  photo: PhotoId;
  /** Explicit image URL (an admin-set heroImageUrl) that overrides `photo`. */
  src?: string | null;
  eyebrow?: string;
  /** Wrap an accent word in <em> for the italic ember highlight. */
  title: ReactNode;
  subtitle?: string;
  /** Extra content under the subtitle — breadcrumbs, badges, actions. */
  children?: ReactNode;
  size?: 'sm' | 'lg';
  /** Extra room at the bottom for a card that overlaps the hero's lower edge. */
  overlap?: boolean;
}

/** Photo banner used at the top of every inner page. */
export function PageHero({ photo, src, eyebrow, title, subtitle, children, size = 'sm', overlap = false }: PageHeroProps) {
  return (
    <section
      className={`relative isolate overflow-hidden bg-night ${
        size === 'lg' ? 'min-h-[22rem] sm:min-h-[26rem]' : 'min-h-[15rem] sm:min-h-[18rem]'
      }`}
    >
      <Photo id={photo} src={src} alt="" priority sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-night/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-night/60 to-transparent" />
      <div
        className={`relative mx-auto flex h-full min-h-[inherit] max-w-6xl flex-col justify-end px-4 pt-16 sm:px-6 ${
          overlap ? 'pb-20 sm:pb-24' : 'pb-8 sm:pb-10'
        }`}
      >
        {eyebrow && (
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-ember">
            <span className="h-px w-8 bg-ember" aria-hidden="true" />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-medium leading-tight text-snow sm:text-5xl [&_em]:font-medium [&_em]:text-ember">
          {title}
        </h1>
        {subtitle && <p className="mt-3 max-w-2xl text-base text-snow/80 sm:text-lg">{subtitle}</p>}
        {children}
      </div>
      <PhotoCredit id={photo} className={overlap ? 'bottom-14' : ''} />
    </section>
  );
}
