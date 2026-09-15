import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itineraryApi } from '../../services/itinerary.api';
import { useAuthStore } from '../../stores/auth.store';
import { ItineraryDaysEditor } from '../../components/itinerary/ItineraryDaysEditor';
import type { ItineraryDay, PlannerInput } from '../../types/api';

const DRAFT_STORAGE_KEY = 'jtl:pendingItinerary';

const FITNESS_LEVELS = [
  { value: '', label: 'No preference' },
  { value: 'easy', label: 'Easy — low altitude only' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'strenuous', label: 'Strenuous' },
] as const;

interface PendingDraft {
  title: string;
  startingCity: string | null;
  days: number;
  budget: string | null;
  travelStyle: string | null;
  itineraryDays: ItineraryDay[];
}

export function PlannerPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [form, setForm] = useState({
    startingCity: '',
    days: 5,
    budget: '',
    travelStyle: '',
    interests: '',
    fitnessLevel: '',
  });
  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[] | null>(null);
  const [meta, setMeta] = useState<{ startingCity: string | null; days: number; budget: string | null; travelStyle: string | null } | null>(null);
  const [title, setTitle] = useState('My Ladakh Trip');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If we redirected to /login mid-save, finish the save once back here and logged in.
  useEffect(() => {
    if (!isAuthenticated) return;
    const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return;
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    const pending: PendingDraft = JSON.parse(raw);
    setIsSaving(true);
    itineraryApi
      .create(pending)
      .then((saved) => navigate(`/itineraries/${saved.id}`))
      .catch(() => setError('Could not save your itinerary. Please try again.'))
      .finally(() => setIsSaving(false));
  }, [isAuthenticated, navigate]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsGenerating(true);
    try {
      const input: PlannerInput = {
        startingCity: form.startingCity || undefined,
        days: form.days,
        budget: form.budget || undefined,
        travelStyle: form.travelStyle || undefined,
        interests: form.interests
          ? form.interests.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined,
        fitnessLevel: (form.fitnessLevel || undefined) as PlannerInput['fitnessLevel'],
      };
      const draft = await itineraryApi.generate(input);
      setItineraryDays(draft.itineraryDays);
      setMeta({
        startingCity: draft.startingCity,
        days: draft.days,
        budget: draft.budget,
        travelStyle: draft.travelStyle,
      });
    } catch {
      setError('Could not generate an itinerary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!meta || !itineraryDays) return;
    const payload: PendingDraft = { title, ...meta, itineraryDays };

    if (!isAuthenticated) {
      sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
      navigate('/login', { state: { from: '/planner' } });
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const saved = await itineraryApi.create(payload);
      navigate(`/itineraries/${saved.id}`);
    } catch {
      setError('Could not save your itinerary. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-stone">Plan your trip</h1>
      <p className="mt-2 text-stone/70">
        Tell us a bit about your trip and we'll put together a day-by-day starting point you can
        edit and save.
      </p>

      <form onSubmit={handleGenerate} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone">Where are you starting from?</label>
          <input
            value={form.startingCity}
            onChange={(e) => setForm((f) => ({ ...f, startingCity: e.target.value }))}
            placeholder="e.g. Delhi"
            className="w-full rounded-lg border border-stone/20 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone">How many days?</label>
          <input
            type="number"
            min={1}
            max={21}
            value={form.days}
            onChange={(e) => setForm((f) => ({ ...f, days: Number(e.target.value) }))}
            className="w-full rounded-lg border border-stone/20 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone">Budget</label>
          <input
            value={form.budget}
            onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
            placeholder="e.g. mid-range"
            className="w-full rounded-lg border border-stone/20 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone">Travel style</label>
          <input
            value={form.travelStyle}
            onChange={(e) => setForm((f) => ({ ...f, travelStyle: e.target.value }))}
            placeholder="e.g. adventure, family, couple"
            className="w-full rounded-lg border border-stone/20 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone">Interests</label>
          <input
            value={form.interests}
            onChange={(e) => setForm((f) => ({ ...f, interests: e.target.value }))}
            placeholder="lakes, monasteries, trekking…"
            className="w-full rounded-lg border border-stone/20 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone">Fitness level</label>
          <select
            value={form.fitnessLevel}
            onChange={(e) => setForm((f) => ({ ...f, fitnessLevel: e.target.value }))}
            className="w-full rounded-lg border border-stone/20 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          >
            {FITNESS_LEVELS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isGenerating}
            className="rounded-full bg-stone px-6 py-2.5 text-sm font-medium text-snow hover:bg-accent disabled:opacity-60"
          >
            {isGenerating ? 'Building your itinerary…' : 'Build my itinerary'}
          </button>
        </div>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {itineraryDays && (
        <section className="mt-12">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone">Trip name</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full max-w-sm rounded-lg border border-stone/20 px-3 py-2 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="self-start rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-snow hover:opacity-90 disabled:opacity-60 sm:self-end"
            >
              {isSaving ? 'Saving…' : isAuthenticated ? 'Save trip' : 'Log in to save'}
            </button>
          </div>

          <ItineraryDaysEditor days={itineraryDays} onChange={setItineraryDays} />
        </section>
      )}
    </div>
  );
}
