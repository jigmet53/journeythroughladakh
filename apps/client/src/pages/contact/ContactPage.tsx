import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { contactApi } from '../../services/contact.api';
import { PageHero } from '../../components/ui/PageHero';
import { Field, FormError, inputClass, primaryButton } from '../../components/ui/forms';
import { Seo } from '../../components/seo/Seo';

const TOPICS = [
  { value: 'general', label: 'General question' },
  { value: 'trip-planning', label: 'Trip planning' },
  { value: 'correction', label: 'Correction — something is wrong or out of date' },
  { value: 'feedback', label: 'Feedback on the site' },
  { value: 'partnership', label: 'Partnership or press' },
] as const;

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  email: z.string().trim().email('Enter a valid email address'),
  topic: z.enum(['general', 'trip-planning', 'correction', 'feedback', 'partnership']),
  message: z.string().trim().min(10, 'Please write at least a sentence so we can help').max(2000, 'Please keep it under 2,000 characters'),
  website: z.string().max(200).optional(),
});
type FormValues = z.infer<typeof schema>;

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { topic: 'general', website: '' } });

  const messageLength = watch('message')?.length ?? 0;

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await contactApi.send(values);
      setSent(true);
      reset();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        setServerError('You have sent a few messages already. Please try again in an hour.');
      } else if (axios.isAxiosError(err) && err.response?.status === 400) {
        const m = err.response.data?.message;
        setServerError(Array.isArray(m) ? m.join(' ') : m ?? 'Please check the form and try again.');
      } else {
        setServerError('We could not send your message. Please try again in a moment.');
      }
    }
  };

  return (
    <div>
      <Seo
        title="Contact us"
        description="Get in touch with Journey Through Ladakh — questions, corrections, feedback or partnership enquiries."
        path="/contact"
      />
      <PageHero
        photo="tso-kar"
        eyebrow="Contact"
        title={
          <>
            Get in <em>touch</em>
          </>
        }
        subtitle="Questions, corrections or ideas — we'd like to hear them."
        overlap
      />

      <div className="mx-auto grid max-w-5xl gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative z-10 -mt-14 rounded-3xl border border-stone/10 bg-white p-6 shadow-xl sm:p-9">
          {sent ? (
            <div role="status" className="py-10 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-night text-ember">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12l5 5 9-10" />
                </svg>
              </span>
              <h2 className="mt-5 font-display text-3xl font-medium text-stone">Message sent</h2>
              <p className="mx-auto mt-2 max-w-sm text-stone/65">
                Thank you — we've received it. In the meantime, our FAQ and travel guide answer most questions.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/faq" className={primaryButton}>
                  Read the FAQ
                </Link>
                <button onClick={() => setSent(false)} className="rounded-full border border-stone/25 px-6 py-3 text-sm font-medium text-stone hover:border-accent hover:text-accent">
                  Send another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
              <div>
                <h2 className="font-display text-2xl font-medium text-stone">Send us a message</h2>
                <p className="mt-1 text-sm text-stone/60">All fields are required.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Your name" htmlFor="contact-name" error={errors.name?.message}>
                  <input id="contact-name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'contact-name-error' : undefined} {...register('name')} className={inputClass} />
                </Field>
                <Field label="Email" htmlFor="contact-email" error={errors.email?.message}>
                  <input id="contact-email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'contact-email-error' : undefined} {...register('email')} className={inputClass} />
                </Field>
              </div>

              <Field label="What is it about?" htmlFor="contact-topic" error={errors.topic?.message}>
                <select id="contact-topic" {...register('topic')} className={inputClass}>
                  {TOPICS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Message" htmlFor="contact-message" error={errors.message?.message}>
                <textarea
                  id="contact-message"
                  rows={6}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  {...register('message')}
                  className={inputClass}
                />
                <p className={`mt-1 text-right text-xs ${messageLength > 2000 ? 'text-red-600' : 'text-stone/40'}`}>{messageLength} / 2000</p>
              </Field>

              {/* Honeypot: invisible and unreachable for people; bots fill it in. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="contact-website">Leave this field empty</label>
                <input id="contact-website" tabIndex={-1} autoComplete="off" {...register('website')} />
              </div>

              {serverError && <FormError>{serverError}</FormError>}

              <button type="submit" disabled={isSubmitting} className={`${primaryButton} w-full py-3.5 sm:w-auto sm:self-start`}>
                {isSubmitting ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>

        <aside className="flex flex-col gap-5 lg:pt-6">
          <div className="rounded-2xl border border-stone/10 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-medium text-stone">Before you write</h2>
            <p className="mt-1 text-sm text-stone/60">You may get an answer faster here:</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link to="/faq" className="font-medium text-accent hover:underline">
                  FAQ →
                </Link>{' '}
                <span className="text-stone/60">permits, altitude, seasons</span>
              </li>
              <li>
                <Link to="/guide" className="font-medium text-accent hover:underline">
                  Travel guide →
                </Link>{' '}
                <span className="text-stone/60">getting there, packing</span>
              </li>
              <li>
                <Link to="/ai" className="font-medium text-accent hover:underline">
                  Ask the AI guide →
                </Link>{' '}
                <span className="text-stone/60">instant answers</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-display text-xl font-medium text-red-900">In an emergency</h2>
            <p className="mt-2 text-sm leading-relaxed text-red-900/80">
              This form is not monitored in real time. For a medical or road emergency, call the local
              emergency number (112 in India) or contact local authorities straight away.
            </p>
          </div>

          <p className="px-1 text-xs leading-relaxed text-stone/50">
            Please don't include passwords or payment details. We use your details only to reply — see the{' '}
            <Link to="/privacy" className="underline hover:text-accent">
              privacy notice
            </Link>
            .
          </p>
        </aside>
      </div>
    </div>
  );
}
