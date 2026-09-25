import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { itineraryApi } from '../../services/itinerary.api';
import { useAuthStore } from '../../stores/auth.store';
import { ItineraryDaysEditor } from '../../components/itinerary/ItineraryDaysEditor';
import { PageHero } from '../../components/ui/PageHero';
import {
  ChoiceChips,
  DayStepper,
  emberButton,
  Field,
  FormError,
  inputClass,
  MultiChips,
  primaryButton,
} from '../../components/ui/forms';
import { Seo } from '../../components/seo/Seo';
import type { ItineraryDay, PlannerInput } from '../../types/api';

const DRAFT_STORAGE_KEY = 'jtl:pendingItinerary';

const TRAVEL_STYLES = ['Adventure', 'Couple', 'Family', 'Friends', 'Solo'].map((s) => ({ value: s.toLowerCase(), label: s }));
const BUDGETS = [
  { value: 'budget', label: 'Budget' },
  { value: 'mid-range', label: 'Mid-range' },
  { value: 'comfortable', label: 'Comfortable' },
];
const INTERESTS = ['lakes', 'monasteries', 'valleys', 'mountain passes', 'heritage'].map((s) => ({
  value: s,
  label: s.charAt(0).toUpperCase() + s.slice(1),
}));
const FITNESS_LEVELS = [
  { value: 'easy', label: 'Easy — low altitude only' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'strenuous', label: 'Strenuous' },
];

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
  // The home page hero card links here with ?from=&days=&style= to pre-fill the form.
  const [params] = useSearchParams();
  const initialDays = Number(params.get('days'));

  const [form, setForm] = useState({
    startingCity: params.get('from') ?? '',
    days: Number.isInteger(initialDays) && initialDays >= 1 && initialDays <= 21 ? initialDays : 5,
    budget: '',
    travelStyle: params.get('style') ?? '',
    interests: [] as string[],
    fitnessLevel: '',
  });
  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[] | null>(null);
  const [meta, setMeta] = useState<{ startingCity: string | null; days: number; budget: string | null; travelStyle: string | null } | null>(null);
  const [title, setTitle] = useState('My Ladakh Trip');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLElement>(null);

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

  // Bring the generated itinerary into view — on a phone it lands below the fold.
  useEffect(() => {
    if (itineraryDays) resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Only when a draft first appears, not on every edit of it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta]);

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
        interests: form.interests.length ? form.interests : undefined,
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
    <div>
      <Seo
        title="Plan your Ladakh trip"
        description="Tell us your days, pace and interests and get a day-by-day Ladakh itinerary you can edit and save."
        path="/planner"
      />
      <PageHero
        photo="hero-indus-road"
        eyebrow="Trip planner"
        title={
          <>
            Plan your <em>journey</em>
          </>
        }
        subtitle="Tell us a bit about your trip and we'll put together a day-by-day starting point you can edit and save."
        overlap
      />

      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <form
          onSubmit={handleGenerate}
          className="relative z-10 -mt-14 grid gap-7 rounded-3xl border border-stone/10 bg-white p-6 shadow-xl sm:p-9"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Where are you starting from?" htmlFor="planner-from">
              <input
                id="planner-from"
                value={form.startingCity}
                onChange={(e) => setForm((f) => ({ ...f, startingCity: e.target.value }))}
                placeholder="e.g. Delhi"
                className={inputClass}
              />
            </Field>
            <DayStepper value={form.days} onChange={(days) => setForm((f) => ({ ...f, days }))} />
          </div>

          <ChoiceChips label="Travel style" options={TRAVEL_STYLES} value={form.travelStyle} onChange={(travelStyle) => setForm((f) => ({ ...f, travelStyle }))} />
          <ChoiceChips label="Budget" options={BUDGETS} value={form.budget} onChange={(budget) => setForm((f) => ({ ...f, budget }))} />
          <MultiChips label="Interests" options={INTERESTS} values={form.interests} onChange={(interests) => setForm((f) => ({ ...f, interests }))} />
          <ChoiceChips label="Fitness level" options={FITNESS_LEVELS} value={form.fitnessLevel} onChange={(fitnessLevel) => setForm((f) => ({ ...f, fitnessLevel }))} />

          {error && !itineraryDays && <FormError>{error}</FormError>}

          <button type="submit" disabled={isGenerating} className={`${emberButton} w-full py-3.5 sm:w-auto sm:justify-self-start`}>
            {isGenerating ? 'Building your itinerary…' : 'Build my itinerary →'}
          </button>
        </form>

        {itineraryDays && (
          <section ref={resultsRef} className="mt-16 scroll-mt-24">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              Your draft
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium text-stone sm:text-4xl">
              {itineraryDays.length}-day <em className="font-medium text-accent">itinerary</em>
            </h2>
            <p className="mt-2 text-stone/60">Rename it, reorder days, add notes or places — then save it to your account.</p>

            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-stone/10 bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
              <div className="flex-1">
                <Field label="Trip name" htmlFor="trip-title">
                  <input id="trip-title" value={title} onChange={(e) => setTitle(e.target.value)} className={`${inputClass} sm:max-w-sm`} />
                </Field>
              </div>
              <button onClick={handleSave} disabled={isSaving} className={primaryButton}>
                {isSaving ? 'Saving…' : isAuthenticated ? 'Save trip' : 'Log in to save'}
              </button>
            </div>
            {error && <div className="mt-4"><FormError>{error}</FormError></div>}

            <div className="mt-8">
              <ItineraryDaysEditor days={itineraryDays} onChange={setItineraryDays} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
