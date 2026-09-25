import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { itineraryApi } from '../../services/itinerary.api';
import { useAuthStore } from '../../stores/auth.store';
import { ItineraryDaysEditor } from '../../components/itinerary/ItineraryDaysEditor';
import { ItineraryDaysView } from '../../components/itinerary/ItineraryDaysView';
import { PageHero } from '../../components/ui/PageHero';
import { dangerButton, emberButton, ghostButton, inputClass } from '../../components/ui/forms';
import { Seo } from '../../components/seo/Seo';
import { tripCover } from '../../data/imagery';
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
    return (
      <div aria-busy="true" aria-label="Loading itinerary">
        <div className="h-[15rem] animate-pulse bg-sand/40 sm:h-[18rem]" />
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-10 sm:px-6">
          <div className="h-24 animate-pulse rounded-2xl bg-sand/30" />
          <div className="h-24 animate-pulse rounded-2xl bg-sand/30" />
        </div>
      </div>
    );
  }
  if (isError || !itinerary) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-medium text-stone">Itinerary not found</h1>
        <p className="mt-2 text-stone/60">It may be private, or the link may be wrong.</p>
        <Link to="/planner" className={`${emberButton} mt-6 inline-block`}>
          Plan a new trip
        </Link>
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

  const facts = [
    `${itinerary.days} ${itinerary.days === 1 ? 'day' : 'days'}`,
    itinerary.startingCity && `From ${itinerary.startingCity}`,
    itinerary.travelStyle,
    itinerary.budget,
  ].filter(Boolean) as string[];

  return (
    <div>
      <Seo title={itinerary.title} description={`A ${itinerary.days}-day Ladakh itinerary.`} path={`/itineraries/${itinerary.id}`} />
      <PageHero photo={tripCover(itinerary.id)} eyebrow="Itinerary" title={itinerary.title} overlap={isOwner}>
        <ul className="mt-4 flex flex-wrap gap-2">
          {facts.map((f) => (
            <li key={f} className="rounded-full border border-snow/25 bg-night/40 px-3 py-1 text-xs font-medium text-snow backdrop-blur-sm">
              {f}
            </li>
          ))}
        </ul>
      </PageHero>

      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        {isOwner && (
          <div className="relative z-10 -mt-12 flex flex-col gap-4 rounded-2xl border border-stone/10 bg-white p-5 shadow-xl sm:flex-row sm:items-center sm:justify-between">
            {editing ? (
              <p className="text-sm text-stone/60">Editing — reorder days, add notes or places, then save.</p>
            ) : (
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <label htmlFor="visibility" className="font-medium text-stone">
                  Sharing
                </label>
                <select
                  id="visibility"
                  value={itinerary.visibility}
                  onChange={(e) => changeVisibility(e.target.value as ItineraryVisibility)}
                  className={`${inputClass} w-auto py-2`}
                >
                  {Object.entries(VISIBILITY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {itinerary.visibility !== 'PRIVATE' && (
                  <button onClick={copyShareLink} className="font-medium text-accent hover:underline">
                    {copySuccess ? 'Link copied!' : 'Copy share link'}
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {editing ? (
                <>
                  <button onClick={saveEdits} disabled={isSaving} className={`${emberButton} py-2.5`}>
                    {isSaving ? 'Saving…' : 'Save changes'}
                  </button>
                  <button onClick={cancelEditing} className={ghostButton}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button onClick={startEditing} className={ghostButton}>
                    Edit
                  </button>
                  <button onClick={handleDelete} className={dangerButton}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <div className={isOwner ? 'mt-10' : 'mt-12'}>
          {editing ? <ItineraryDaysEditor days={days} onChange={setDraftDays} /> : <ItineraryDaysView days={days} />}
        </div>
      </div>
    </div>
  );
}
