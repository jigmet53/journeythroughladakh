import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';

// Shared form styling so every page's inputs and buttons match.
export const inputClass =
  'w-full rounded-xl border border-stone/20 bg-white px-4 py-2.5 text-sm text-stone placeholder:text-stone/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20';
export const primaryButton =
  'rounded-full bg-night px-7 py-3 text-sm font-semibold text-snow transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60';
export const emberButton =
  'rounded-full bg-ember px-7 py-3 text-sm font-semibold text-night transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60';
export const ghostButton =
  'rounded-full border border-stone/25 px-5 py-2.5 text-sm font-medium text-stone transition hover:border-accent hover:text-accent disabled:opacity-60';
export const dangerButton =
  'rounded-full border border-red-300 px-5 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50';

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-stone">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-stone/50">{hint}</p>}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {children}
    </p>
  );
}

const chipClass = (active: boolean) =>
  `rounded-full border px-4 py-1.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
    active ? 'border-night bg-night text-snow' : 'border-stone/20 bg-white text-stone/75 hover:border-accent hover:text-accent'
  }`;

interface Option {
  value: string;
  label: string;
}

/** Pick one option (click again to clear). A value not in `options` — say,
 * one arriving from a URL — is shown as an extra selected chip, not dropped. */
export function ChoiceChips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}) {
  const known = options.some((o) => o.value.toLowerCase() === value.toLowerCase());
  const all = value && !known ? [...options, { value, label: value }] : options;
  const labelId = `chips-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div>
      <span id={labelId} className="mb-1.5 block text-sm font-medium text-stone">
        {label}
      </span>
      <div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-2">
        {all.map((o) => {
          const active = o.value.toLowerCase() === value.toLowerCase();
          return (
            <button key={o.value} type="button" aria-pressed={active} onClick={() => onChange(active ? '' : o.value)} className={chipClass(active)}>
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MultiChips({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const labelId = `chips-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div>
      <span id={labelId} className="mb-1.5 block text-sm font-medium text-stone">
        {label}
      </span>
      <div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = values.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active ? values.filter((v) => v !== o.value) : [...values, o.value])}
              className={chipClass(active)}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DayStepper({ value, onChange, min = 1, max = 21 }: { value: number; onChange: (n: number) => void; min?: number; max?: number }) {
  const btn =
    'flex h-10 w-10 items-center justify-center rounded-full border border-stone/20 text-lg text-stone transition hover:border-accent hover:text-accent disabled:opacity-30';
  return (
    <div>
      <span id="days-label" className="mb-1.5 block text-sm font-medium text-stone">
        How many days?
      </span>
      <div role="group" aria-labelledby="days-label" className="flex items-center gap-4">
        <button type="button" className={btn} aria-label="Fewer days" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
          −
        </button>
        <span aria-live="polite" className="min-w-[4.5rem] text-center font-display text-3xl font-medium text-stone">
          {value}
          <span className="ml-1 font-body text-sm text-stone/50">{value === 1 ? 'day' : 'days'}</span>
        </span>
        <button type="button" className={btn} aria-label="More days" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
          +
        </button>
      </div>
    </div>
  );
}

/** Labelled -/+ counter, e.g. for travellers. */
export function NumberStepper({
  id,
  label,
  hint,
  value,
  onChange,
  min,
  max,
}: {
  id: string;
  label: string;
  hint?: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
}) {
  const btn =
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone/20 text-lg text-stone transition hover:border-accent hover:text-accent disabled:opacity-30';
  return (
    <div>
      <span id={`${id}-label`} className="mb-1.5 block text-sm font-medium text-stone">
        {label}
        {hint && <span className="ml-1 font-normal text-stone/50">{hint}</span>}
      </span>
      <div role="group" aria-labelledby={`${id}-label`} className="flex items-center gap-3">
        <button type="button" className={btn} aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
          −
        </button>
        <span aria-live="polite" className="min-w-[2rem] text-center font-display text-2xl font-medium text-stone">
          {value}
        </span>
        <button type="button" className={btn} aria-label={`More ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
          +
        </button>
      </div>
    </div>
  );
}

/** Password input with a show/hide toggle; forwards its ref so it works with
 * react-hook-form's `register`. */
export const PasswordInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input ref={ref} {...props} type={visible ? 'text' : 'password'} className={`${inputClass} pr-16`} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-stone/60 hover:text-accent"
      >
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
});
