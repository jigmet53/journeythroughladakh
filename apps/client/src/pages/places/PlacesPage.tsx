import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { destinationsApi, searchApi } from '../../services/destinations.api';
import { DestinationCard } from '../../components/places/DestinationCard';
import { CardSkeleton } from '../../components/ui/CardSkeleton';
import { PageHero } from '../../components/ui/PageHero';
import { Seo } from '../../components/seo/Seo';

export function PlacesPage() {
  // The home page search box links here as /places?q=…, so the query lives in
  // the URL — it survives refresh and back/forward.
  const [params, setParams] = useSearchParams();
  const activeQuery = params.get('q')?.trim() ?? '';
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [searchInput, setSearchInput] = useState(activeQuery);

  const { data: categories } = useQuery({
    queryKey: ['destination-categories'],
    queryFn: () => destinationsApi.categories(),
  });

  const { data: listData, isLoading: listLoading } = useQuery({
    queryKey: ['destinations', category],
    queryFn: () => destinationsApi.list({ category, limit: 24 }),
    enabled: !activeQuery,
  });

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ['search', activeQuery],
    queryFn: () => searchApi.search(activeQuery),
    enabled: !!activeQuery,
  });

  const isSearching = !!activeQuery;
  const clearSearch = () => {
    setSearchInput('');
    setParams({});
  };

  const chip = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
      active ? 'bg-night text-snow' : 'border border-stone/20 text-stone/70 hover:border-accent hover:text-accent'
    }`;

  return (
    <div>
      <Seo
        title="Explore Ladakh — Lakes, Monasteries, Valleys & Passes"
        description="Browse Ladakh's destinations by geography, interest, and travel style, or search in plain language — lakes, monasteries, valleys, and mountain passes."
        path="/places"
      />
      <PageHero
        photo="pangong-lake"
        eyebrow="Destinations"
        title={<>Explore <em>Ladakh</em></>}
        subtitle={'Browse by geography, interest and travel style — or search in plain language, like "blue lake near Leh".'}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <form
          role="search"
          className="flex flex-wrap gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const q = searchInput.trim();
            setParams(q ? { q } : {});
          }}
        >
          <label htmlFor="places-search" className="sr-only">
            Search destinations
          </label>
          <input
            id="places-search"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search destinations…"
            className="w-full max-w-md rounded-full border border-stone/20 bg-white px-5 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
          <button
            type="submit"
            className="rounded-full bg-night px-6 py-2.5 text-sm font-medium text-snow hover:bg-accent"
          >
            Search
          </button>
          {isSearching && (
            <button
              type="button"
              onClick={clearSearch}
              className="rounded-full border border-stone/20 px-5 py-2.5 text-sm text-stone/70 hover:border-accent"
            >
              Clear
            </button>
          )}
        </form>

        {!isSearching && (
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            <button onClick={() => setCategory(undefined)} aria-pressed={!category} className={chip(!category)}>
              All
            </button>
            {categories?.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.slug)}
                aria-pressed={category === c.slug}
                className={chip(category === c.slug)}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-8" aria-live="polite">
          {isSearching ? (
            searchLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : searchData && searchData.results.length > 0 ? (
              <>
                <p className="mb-4 text-sm text-stone/60">
                  {searchData.results.length} result{searchData.results.length === 1 ? '' : 's'} for "{activeQuery}"
                </p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {searchData.results.map((r) => (
                    <DestinationCard key={r.id} destination={r} />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-stone/20 p-10 text-center">
                <p className="font-display text-xl font-semibold text-stone">No destinations matched "{activeQuery}"</p>
                <p className="mt-1 text-sm text-stone/60">Try a broader term like "lake", "monastery" or "pass".</p>
                <button onClick={clearSearch} className="mt-4 text-sm font-medium text-accent hover:underline">
                  Browse all destinations
                </button>
              </div>
            )
          ) : listLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : listData && listData.items.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listData.items.map((d) => (
                <DestinationCard key={d.id} destination={{ ...d, categoryName: d.category?.name }} />
              ))}
            </div>
          ) : (
            <p className="text-stone/60">No destinations in this category yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
