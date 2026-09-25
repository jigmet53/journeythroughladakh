import { Link } from 'react-router-dom';
import type { PhotoId } from '../../data/photos';
import { Photo } from '../ui/Photo';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from './SectionHeading';

// Each tile runs a search (or opens the routes page), so they double as the
// "what are you into?" entry points.
const themes: { label: string; sub: string; photo: PhotoId; to: string }[] = [
  { label: 'Blue lakes', sub: 'Pangong, Tso Moriri', photo: 'pangong-lake', to: '/places?q=lake' },
  { label: 'Monasteries', sub: 'Thiksey, Diskit', photo: 'thiksey-monastery', to: '/places?q=monastery' },
  { label: 'High passes', sub: 'Khardung La and beyond', photo: 'khardung-la', to: '/places?q=pass' },
  { label: 'Cold desert', sub: 'Nubra Valley dunes', photo: 'nubra-dunes', to: '/places?q=desert' },
  { label: 'Road trips', sub: 'Manali to Leh', photo: 'baralacha-la', to: '/packages' },
];

export function ThemeStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 pt-16 sm:px-6 lg:pt-20">
      <Reveal>
        <SectionHeading
          eyebrow="Explore by mood"
          title={
            <>
              What are you <em>into?</em>
            </>
          }
        />
      </Reveal>
      <div className="-mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-5 lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {themes.map((t, i) => (
          <Reveal key={t.label} delay={i * 0.06} className="w-44 shrink-0 snap-start sm:w-56 lg:w-auto">
            <Link
              to={t.to}
              className="group relative block aspect-[3/4] overflow-hidden rounded-3xl bg-night focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
            >
              <Photo id={t.photo} alt="" sizes="(min-width: 1024px) 20vw, 224px" className="transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-snow">
                <p className="font-display text-xl font-medium leading-tight">{t.label}</p>
                <p className="mt-0.5 text-xs text-snow/65">{t.sub}</p>
              </div>
              <span aria-hidden="true" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-snow/30 bg-night/30 text-snow opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                →
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
