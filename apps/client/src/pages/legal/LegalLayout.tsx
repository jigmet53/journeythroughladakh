import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../../components/seo/Seo';

interface LegalLayoutProps {
  title: string;
  description: string;
  path: string;
  updated: string;
  intro: string;
  children: ReactNode;
}

/** Plain, readable long-form layout for the privacy notice and terms. */
export function LegalLayout({ title, description, path, updated, intro, children }: LegalLayoutProps) {
  return (
    <div>
      <Seo title={title} description={description} path={path} />
      <header className="bg-night text-snow">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-ember">
            <span className="h-px w-8 bg-ember" aria-hidden="true" />
            Legal
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-snow/60">Last updated {updated}</p>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-lg leading-relaxed text-stone/80">{intro}</p>
        <div className="mt-8 space-y-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-stone [&_li]:leading-relaxed [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:marker:text-accent text-stone/75">
          {children}
        </div>
        <p className="mt-12 rounded-2xl bg-sand/25 p-5 text-sm text-stone/70">
          Questions about this page? <Link to="/contact" className="font-medium text-accent hover:underline">Contact us</Link>.
        </p>
      </div>
    </div>
  );
}
