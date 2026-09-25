import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../../services/bookings.api';
import { contactApi } from '../../services/contact.api';
import { useAuthStore } from '../../stores/auth.store';
import { PageHero } from '../../components/ui/PageHero';
import { inputClass } from '../../components/ui/forms';
import { Seo } from '../../components/seo/Seo';
import type { BookingRequest, BookingStatus } from '../../types/api';

const STATUSES: { value: BookingStatus; label: string; tone: string }[] = [
  { value: 'new', label: 'New', tone: 'bg-ember text-night' },
  { value: 'contacted', label: 'Contacted', tone: 'bg-sky/60 text-night' },
  { value: 'confirmed', label: 'Confirmed', tone: 'bg-green-200 text-green-900' },
  { value: 'cancelled', label: 'Cancelled', tone: 'bg-stone/15 text-stone/70' },
];
const TOPIC_LABELS: Record<string, string> = {
  general: 'General question',
  'trip-planning': 'Trip planning',
  correction: 'Correction',
  feedback: 'Feedback',
  partnership: 'Partnership / press',
};

const fmtDate = (iso: string) =>
  new Date(iso.length === 10 || iso.endsWith('T00:00:00.000Z') ? iso.slice(0, 10) + 'T00:00:00' : iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

function BookingCard({ b }: { b: BookingRequest }) {
  const qc = useQueryClient();
  const update = useMutation({
    mutationFn: (status: BookingStatus) => bookingsApi.updateStatus(b.id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'bookings'] }),
  });
  const tone = STATUSES.find((s) => s.value === b.status)?.tone ?? '';
  const subject = encodeURIComponent(`Your booking request ${b.reference} — ${b.packageTitle}`);

  return (
    <article className="rounded-2xl border border-stone/10 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-sm font-semibold tracking-wider text-accent">{b.reference}</p>
          <h3 className="mt-0.5 font-display text-xl font-medium text-stone">{b.name}</h3>
          <p className="text-sm text-stone/60">
            {b.packageId ? (
              <Link to={`/packages/${b.packageSlug}`} className="hover:text-accent hover:underline">
                {b.packageTitle}
              </Link>
            ) : (
              b.packageTitle
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{STATUSES.find((s) => s.value === b.status)?.label}</span>
          <select
            aria-label={`Change status for ${b.reference}`}
            value={b.status}
            disabled={update.isPending}
            onChange={(e) => update.mutate(e.target.value as BookingStatus)}
            className={`${inputClass} w-auto py-1.5 text-xs`}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-wider text-stone/50">Start date</dt>
          <dd className="font-medium text-stone">
            {fmtDate(b.startDate)}
            {b.flexibleDates && <span className="text-stone/50"> · flexible</span>}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-stone/50">Travellers</dt>
          <dd className="font-medium text-stone">
            {b.adults} adult{b.adults === 1 ? '' : 's'}
            {b.children > 0 && `, ${b.children} child${b.children === 1 ? '' : 'ren'}`}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-stone/50">From</dt>
          <dd className="font-medium text-stone">{b.startingCity ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-stone/50">Received</dt>
          <dd className="font-medium text-stone">{fmtDateTime(b.createdAt)}</dd>
        </div>
      </dl>

      {b.notes && <p className="mt-4 whitespace-pre-wrap rounded-xl bg-sand/25 p-3 text-sm text-stone/75">{b.notes}</p>}

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <a href={`mailto:${b.email}?subject=${subject}`} className="rounded-full bg-night px-4 py-2 font-medium text-snow hover:bg-accent">
          Email {b.email}
        </a>
        <a href={`tel:${b.phone.replace(/[^+\d]/g, '')}`} className="rounded-full border border-stone/25 px-4 py-2 font-medium text-stone hover:border-accent hover:text-accent">
          Call {b.phone}
        </a>
      </div>
    </article>
  );
}

export function InboxPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const [tab, setTab] = useState<'bookings' | 'messages'>('bookings');
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');

  const bookings = useQuery({ queryKey: ['admin', 'bookings'], queryFn: () => bookingsApi.list(), enabled: isAdmin });
  const messages = useQuery({ queryKey: ['admin', 'messages'], queryFn: () => contactApi.list(), enabled: isAdmin });

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-medium text-stone">Staff only</h1>
        <p className="mt-2 text-stone/60">This page is for site administrators. If you should have access, ask an admin to promote your account.</p>
        <Link to="/" className="mt-6 inline-block text-accent hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  const all = bookings.data ?? [];
  const shown = filter === 'all' ? all : all.filter((b) => b.status === filter);
  const newCount = all.filter((b) => b.status === 'new').length;
  const chip = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition ${active ? 'bg-night text-snow' : 'border border-stone/20 text-stone/70 hover:border-accent hover:text-accent'}`;

  return (
    <div>
      <Seo title="Inbox" description="Booking requests and contact messages." path="/admin/inbox" />
      <PageHero
        photo="hero-sunset-indus"
        eyebrow="Admin"
        title={
          <>
            Booking <em>inbox</em>
          </>
        }
        subtitle="Requests and messages from visitors. Reply by email or phone, and update the status as you go."
      />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div role="tablist" aria-label="Inbox" className="inline-flex gap-1 rounded-full border border-stone/15 bg-white p-1">
          <button role="tab" aria-selected={tab === 'bookings'} onClick={() => setTab('bookings')} className={chip(tab === 'bookings')}>
            Booking requests{newCount > 0 && <span className="ml-2 rounded-full bg-ember px-2 py-0.5 text-xs font-semibold text-night">{newCount} new</span>}
          </button>
          <button role="tab" aria-selected={tab === 'messages'} onClick={() => setTab('messages')} className={chip(tab === 'messages')}>
            Messages{messages.data ? ` (${messages.data.length})` : ''}
          </button>
        </div>

        {tab === 'bookings' ? (
          <div className="mt-6">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
              <button aria-pressed={filter === 'all'} onClick={() => setFilter('all')} className={chip(filter === 'all')}>
                All ({all.length})
              </button>
              {STATUSES.map((s) => (
                <button key={s.value} aria-pressed={filter === s.value} onClick={() => setFilter(s.value)} className={chip(filter === s.value)}>
                  {s.label} ({all.filter((b) => b.status === s.value).length})
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {bookings.isLoading ? (
                <div className="h-40 animate-pulse rounded-2xl bg-sand/30" />
              ) : bookings.isError ? (
                <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Could not load booking requests.</p>
              ) : shown.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone/25 p-10 text-center text-stone/60">
                  {all.length === 0 ? 'No booking requests yet. They will appear here as visitors send them.' : 'No requests with this status.'}
                </div>
              ) : (
                shown.map((b) => <BookingCard key={b.id} b={b} />)
              )}
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {messages.isLoading ? (
              <div className="h-32 animate-pulse rounded-2xl bg-sand/30" />
            ) : messages.isError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Could not load messages.</p>
            ) : (messages.data ?? []).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone/25 p-10 text-center text-stone/60">No messages yet.</div>
            ) : (
              messages.data!.map((m) => (
                <article key={m.id} className="rounded-2xl border border-stone/10 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl font-medium text-stone">{m.name}</h3>
                    <span className="text-xs text-stone/50">{fmtDateTime(m.createdAt)}</span>
                  </div>
                  <span className="mt-1 inline-block rounded-full bg-sand/40 px-3 py-0.5 text-xs font-medium text-stone/70">{TOPIC_LABELS[m.topic] ?? m.topic}</span>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-stone/75">{m.message}</p>
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your message to Journey Through Ladakh')}`}
                    className="mt-4 inline-block rounded-full bg-night px-4 py-2 text-sm font-medium text-snow hover:bg-accent"
                  >
                    Reply to {m.email}
                  </a>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
