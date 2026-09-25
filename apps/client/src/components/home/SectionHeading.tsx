import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface SectionHeadingProps {
  eyebrow: string;
  /** Title; wrap an accent word in <em> for the italic highlight. */
  title: ReactNode;
  subtitle?: string;
  action?: { to: string; label: string };
  tone?: 'light' | 'dark';
  className?: string;
}

export function SectionHeading({ eyebrow, title, subtitle, action, tone = 'light', className = '' }: SectionHeadingProps) {
  const dark = tone === 'dark';
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div>
        <p className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] ${dark ? 'text-ember' : 'text-accent'}`}>
          <span className={`h-px w-8 ${dark ? 'bg-ember' : 'bg-accent'}`} aria-hidden="true" />
          {eyebrow}
        </p>
        <h2
          className={`mt-3 font-display text-3xl font-medium leading-tight sm:text-5xl [&_em]:font-medium ${
            dark ? 'text-snow [&_em]:text-ember' : 'text-stone [&_em]:text-accent'
          }`}
        >
          {title}
        </h2>
        {subtitle && <p className={`mt-3 max-w-xl ${dark ? 'text-snow/70' : 'text-stone/65'}`}>{subtitle}</p>}
      </div>
      {action && (
        <Link
          to={action.to}
          className={`shrink-0 text-sm font-medium hover:underline ${dark ? 'text-ember' : 'text-accent'}`}
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}
