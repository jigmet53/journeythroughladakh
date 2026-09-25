import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { bookingsApi } from '../../services/bookings.api';
import { useAuthStore } from '../../stores/auth.store';
import { Field, FormError, NumberStepper, inputClass, primaryButton, emberButton } from '../ui/forms';
import type { TripPackageDetail } from '../../types/api';

/** Today as YYYY-MM-DD in the visitor's own timezone, for the date input's `min`. */
const todayLocal = () => new Date().toLocaleDateString('en-CA');

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9()\-\s]{7,20}$/, 'Enter a valid phone number, including the country code'),
  startDate: z
    .string()
    .min(1, 'Choose a preferred start date')
    .refine((v) => v >= todayLocal(), 'The start date cannot be in the past'),
  flexibleDates: z.boolean(),
  adults: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(20),
  startingCity: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(1000, 'Please keep it under 1,000 characters').optional(),
  consent: z.boolean().refine((v) => v, 'Please agree so we can contact you about this request'),
  website: z.string().max(200).optional(),
});
type FormValues = z.infer<typeof schema>;

const nextSteps = [
  { t: 'We review your request', b: 'We check availability for your dates and group size.' },
  { t: 'We contact you', b: 'By email or phone, to confirm details, the price and what is included.' },
  { t: 'You decide', b: 'Nothing is charged online, and you are not committed until you confirm with us.' },
];

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });

export function BookingForm({ pkg }: { pkg: TripPackageDetail }) {
  const user = useAuthStore((s) => s.user);
  const [done, setDone] = useState<{ reference: string; values: FormValues } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: user?.email ?? '',
      phone: '',
      startDate: '',
      flexibleDates: false,
      adults: 2,
      children: 0,
      startingCity: '',
      notes: '',
      consent: false,
      website: '',
    },
  });
  const adults = watch('adults');
  const children = watch('children');
  const notesLength = watch('notes')?.length ?? 0;

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const res = await bookingsApi.create({ ...values, packageSlug: pkg.slug });
      setDone({ reference: res.reference, values });
      reset();
      document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        setServerError('You have sent a few requests already. Please try again in an hour.');
      } else if (axios.isAxiosError(err) && err.response?.status === 400) {
        const m = err.response.data?.message;
        setServerError(Array.isArray(m) ? m.join(' ') : m ?? 'Please check the form and try again.');
      } else if (axios.isAxiosError(err) && err.response?.status === 404) {
        setServerError('This package is no longer available. Please choose another route.');
      } else {
        setServerError('We could not send your request. Please try again in a moment.');
      }
    }
  };

  const copyReference = async () => {
    if (!done) return;
    try {
      await navigator.clipboard.writeText(done.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the code is on screen anyway */
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="rounded-3xl border border-stone/10 bg-white p-6 shadow-xl sm:p-8">
        {done ? (
          <div role="status" className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-night text-ember">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12l5 5 9-10" />
              </svg>
            </span>
            <h3 className="mt-5 font-display text-3xl font-medium text-stone">Request received</h3>
            <p className="mx-auto mt-2 max-w-md text-stone/65">
              Thank you, {done.values.name.split(' ')[0]}. We'll contact you at <strong className="font-medium text-stone">{done.values.email}</strong> or on
              the phone number you gave to confirm your trip.
            </p>

            <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-night p-5 text-snow">
              <p className="text-xs uppercase tracking-[0.2em] text-snow/55">Your reference</p>
              <p className="mt-1 font-mono text-3xl font-semibold tracking-widest text-ember">{done.reference}</p>
              <button onClick={copyReference} className="mt-2 text-xs text-snow/70 underline hover:text-snow">
                {copied ? 'Copied!' : 'Copy code'}
              </button>
            </div>

            <dl className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-3 text-left text-sm">
              <div className="col-span-2">
                <dt className="text-stone/50">Trip</dt>
                <dd className="font-medium text-stone">{pkg.title}</dd>
              </div>
              <div>
                <dt className="text-stone/50">Start date</dt>
                <dd className="font-medium text-stone">
                  {formatDate(done.values.startDate)}
                  {done.values.flexibleDates && <span className="text-stone/50"> (flexible)</span>}
                </dd>
              </div>
              <div>
                <dt className="text-stone/50">Travellers</dt>
                <dd className="font-medium text-stone">
                  {done.values.adults} adult{done.values.adults === 1 ? '' : 's'}
                  {done.values.children > 0 && `, ${done.values.children} child${done.values.children === 1 ? '' : 'ren'}`}
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-xs text-stone/50">Please keep your reference — quote it if you contact us about this request.</p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/packages" className={primaryButton}>
                Browse more routes
              </Link>
              <button onClick={() => setDone(null)} className="rounded-full border border-stone/25 px-6 py-3 text-sm font-medium text-stone hover:border-accent hover:text-accent">
                Send another request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
            <div className="rounded-2xl bg-sand/25 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">You're requesting</p>
              <p className="mt-0.5 font-display text-xl font-medium text-stone">{pkg.title}</p>
              <p className="text-sm text-stone/60">
                {pkg.nights}N / {pkg.days}D · {pkg.difficulty} · from {pkg.startCity}
              </p>
            </div>

            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="sr-only">Your details</legend>
              <Field label="Full name" htmlFor="bk-name" error={errors.name?.message}>
                <input id="bk-name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'bk-name-error' : undefined} {...register('name')} className={inputClass} />
              </Field>
              <Field label="Email" htmlFor="bk-email" error={errors.email?.message}>
                <input id="bk-email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'bk-email-error' : undefined} {...register('email')} className={inputClass} />
              </Field>
              <Field label="Phone / WhatsApp" htmlFor="bk-phone" error={errors.phone?.message} hint="Include the country code, e.g. +91 98765 43210">
                <input id="bk-phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'bk-phone-error' : undefined} {...register('phone')} className={inputClass} />
              </Field>
              <Field label="Travelling from" htmlFor="bk-city" error={errors.startingCity?.message} hint="Optional">
                <input id="bk-city" autoComplete="address-level2" placeholder="e.g. Delhi" {...register('startingCity')} className={inputClass} />
              </Field>
            </fieldset>

            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="sr-only">Trip details</legend>
              <div>
                <Field label="Preferred start date" htmlFor="bk-date" error={errors.startDate?.message}>
                  <input id="bk-date" type="date" min={todayLocal()} aria-invalid={!!errors.startDate} aria-describedby={errors.startDate ? 'bk-date-error' : undefined} {...register('startDate')} className={inputClass} />
                </Field>
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-stone/70">
                  <input type="checkbox" {...register('flexibleDates')} className="h-4 w-4 rounded border-stone/30 accent-[#C08457]" />
                  My dates are flexible
                </label>
                <p className="mt-2 text-xs text-stone/50">Best season is {pkg.bestTime}.</p>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                <NumberStepper id="bk-adults" label="Adults" value={adults} min={1} max={20} onChange={(n) => setValue('adults', n, { shouldValidate: true })} />
                <NumberStepper id="bk-children" label="Children" value={children} min={0} max={20} onChange={(n) => setValue('children', n, { shouldValidate: true })} />
              </div>
            </fieldset>

            <Field label="Anything we should know?" htmlFor="bk-notes" error={errors.notes?.message} hint="Optional — dietary needs, mobility, fitness, occasions, questions.">
              <textarea id="bk-notes" rows={4} aria-describedby={errors.notes ? 'bk-notes-error' : undefined} {...register('notes')} className={inputClass} />
              <p className={`mt-1 text-right text-xs ${notesLength > 1000 ? 'text-red-600' : 'text-stone/40'}`}>{notesLength} / 1000</p>
            </Field>

            {/* Honeypot: invisible and unreachable for people; bots fill it in. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="bk-website">Leave this field empty</label>
              <input id="bk-website" tabIndex={-1} autoComplete="off" {...register('website')} />
            </div>

            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-stone/75">
                <input type="checkbox" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'bk-consent-error' : undefined} {...register('consent')} className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone/30 accent-[#C08457]" />
                <span>
                  I agree to be contacted about this request. See the{' '}
                  <Link to="/privacy" className="text-accent underline">
                    privacy notice
                  </Link>
                  .
                </span>
              </label>
              {errors.consent && (
                <p id="bk-consent-error" role="alert" className="mt-1 text-xs text-red-600">
                  {errors.consent.message}
                </p>
              )}
            </div>

            {serverError && <FormError>{serverError}</FormError>}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="submit" disabled={isSubmitting} className={`${emberButton} py-3.5`}>
                {isSubmitting ? 'Sending…' : 'Send booking request →'}
              </button>
              <p className="text-xs text-stone/50">No payment is taken online.</p>
            </div>
          </form>
        )}
      </div>

      <aside className="flex flex-col gap-5">
        <div className="rounded-2xl bg-night p-6 text-snow">
          <h3 className="font-display text-2xl font-medium">
            How it <em className="font-medium text-ember">works</em>
          </h3>
          <ol className="mt-5 space-y-5">
            {nextSteps.map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ember/60 text-sm font-semibold text-ember">{i + 1}</span>
                <div>
                  <p className="font-medium">{s.t}</p>
                  <p className="mt-0.5 text-sm text-snow/65">{s.b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl border border-stone/10 bg-white p-6 text-sm text-stone/70 shadow-sm">
          <p className="font-medium text-stone">Questions first?</p>
          <p className="mt-1">
            Read the{' '}
            <Link to="/faq" className="text-accent hover:underline">
              FAQ
            </Link>
            , ask the{' '}
            <Link to="/ai" className="text-accent hover:underline">
              AI guide
            </Link>
            , or{' '}
            <Link to="/contact" className="text-accent hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>
      </aside>
    </div>
  );
}
