import type { ReactNode } from 'react';

/** Shared frame for one itinerary day — the number badge on a connecting line —
 * so the editor and the read-only view look identical. */
export function DayCard({ dayNumber, last, children }: { dayNumber: number; last: boolean; children: ReactNode }) {
  return (
    <li className="relative flex gap-4 sm:gap-5">
      {!last && <span aria-hidden="true" className="absolute bottom-[-1.25rem] left-5 top-12 w-px bg-stone/15" />}
      <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-night text-sm font-semibold text-ember">
        {dayNumber}
      </span>
      <div className="min-w-0 flex-1 rounded-2xl border border-stone/10 bg-white p-4 shadow-sm sm:p-5">{children}</div>
    </li>
  );
}
