import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { itineraryApi } from '../../services/itinerary.api';
import { useAuthStore } from '../../stores/auth.store';
import { ItineraryDaysEditor } from '../../components/itinerary/ItineraryDaysEditor';
import type { ItineraryDay, ItineraryVisibility } from '../../types/api';

const VISIBILITY_LABELS: Record<ItineraryVisibility, string> = {
  PRIVATE: 'Private — only you can see this',
  UNLISTED: 'Unlisted — anyone with the link can view',
  PUBLIC: 'Public — anyone with the link can view',
};

export function ItineraryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuthStore();

  const { data: itinerary, isLoading, isError } = useQuery({
    queryKey: ['itinerary', id],
    queryFn: () => itineraryApi.byId(id!),
    // Wait for the app's initial /auth/me (+ silent refresh) to settle first.
    // Firing this immediately on mount would race that rehydration: a PRIVATE
    // itinerary returns 404 (not 401, since this endpoint allows anonymous
    // viewers) when no access token is attached yet, so axios's refresh-and-
    // retry interceptor never engages and an actually-logged-in owner would
    // see a permanent false "not found".
    enabled: !!id && !authLoading,
  });

  const [editing, setEditing] = useState(false);
  const [draftDays, setDraftDays] = useState<ItineraryDay[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (authLoading || isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-stone/60">Loading…</div>;
  }
  if (isError || !itinerary) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-stone">Itinerary not found</h1>
        <p className="mt-2 text-stone/60">It may be private, or the link may be wrong.</p>
      </div>
    );
  }

  const isOwner = !!user && user.id === itinerary.userId;
  const days = draftDays ?? itinerary.itineraryDays;

  const startEditing = () => {
    setDraftDays(itinerary.itineraryDays);
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraftDays(null);
    setEditing(false);
  };

  const saveEdits = async () => {
    if (!draftDays) return;
    setIsSaving(true);
    try {
      await itineraryApi.update(itinerary.id, {
        title: itinerary.title,
        startingCity: itinerary.startingCity,
        days: draftDays.length,
        budget: itinerary.budget,
        travelStyle: itinerary.travelStyle,
        itineraryDays: draftDays,
      });
      await queryClient.invalidateQueries({ queryKey: ['itinerary', id] });
      setEditing(false);
      setDraftDays(null);
    } finally {
      setIsSaving(false);
    }
  };

  const changeVisibility = async (visibility: ItineraryVisibility) => {
    await itineraryApi.setVisibility(itinerary.id, visibility);
    await queryClient.invalidateQueries({ queryKey: ['itinerary', id] });
  };

  const handleDelete = async () => {
    if (!confirm('Delete this itinerary? This cannot be undone.')) return;
    await itineraryApi.remove(itinerary.id);
    navigate('/account/trips');
  };

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-stone">{itinerary.title}</h1>
          <p className="mt-1 text-sm text-stone/60">
            {itinerary.days} days
            {itinerary.startingCity ? ` · from ${itinerary.startingCity}` : ''}
            {itinerary.travelStyle ? ` · ${itinerary.travelStyle}` : ''}
          </p>
        </div>

        {isOwner && (
          <div className="flex flex-wrap gap-2">
            {editing ? (
              <>
                <button
                  onClick={saveEdits}
                  disabled={isSaving}
                  className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-snow disabled:opacity-60"
                >
                  {isSaving ? 'Saving…' : 'Save changes'}
                </button>
                <button
                  onClick={cancelEditing}
                  className="rounded-full border border-stone/20 px-4 py-2 text-sm text-stone/70"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={startEditing}
                  className="rounded-full border border-stone/20 px-4 py-2 text-sm text-stone hover:border-accent hover:text-accent"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isOwner && !editing && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg bg-sand/10 p-3 text-sm">
          <label className="text-stone/60">Sharing:</label>
          <select
            value={itinerary.visibility}
            onChange={(e) => changeVisibility(e.target.value as ItineraryVisibility)}
            className="rounded-md border border-stone/20 px-2 py-1"
          >
            {Object.entries(VISIBILITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {itinerary.visibility !== 'PRIVATE' && (
            <button onClick={copyShareLink} className="text-accent hover:underline">
              {copySuccess ? 'Link copied!' : 'Copy share link'}
            </button>
          )}
        </div>
      )}

      <div className="mt-8">
        {editing ? (
          <ItineraryDaysEditor days={days} onChange={setDraftDays} />
        ) : (
          <div className="flex flex-col gap-4">
            {days.map((day) => (
              <div key={day.dayNumber} className="rounded-xl border border-stone/10 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-accent">
                  Day {day.dayNumber}
                </p>
                {day.title && <h3 className="font-display text-lg font-semibold text-stone">{day.title}</h3>}
                {day.notes && <p className="mt-1 text-sm text-stone/60">{day.notes}</p>}
                {day.items.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-2">
                    {day.items.map((item, i) => (
                      <li key={i} className="rounded-lg bg-sand/10 p-3 text-sm">
                        <p className="font-medium text-stone">{item.activity}</p>
                        {item.notes && <p className="mt-0.5 text-stone/60">{item.notes}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
