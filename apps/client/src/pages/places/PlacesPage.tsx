import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { destinationsApi, searchApi } from '../../services/destinations.api';
import { DestinationCard } from '../../components/places/DestinationCard';
import { Seo } from '../../components/seo/Seo';

export function PlacesPage() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Seo
        title="Explore Ladakh — Lakes, Monasteries, Valleys & Passes"
        description="Browse Ladakh's destinations by geography, interest, and travel style, or search in plain language — lakes, monasteries, valleys, and mountain passes."
        path="/places"
      />
      <h1 className="font-display text-3xl font-semibold text-stone">Explore Ladakh</h1>
      <p className="mt-2 max-w-2xl text-stone/70">
        Browse destinations by geography, interest, and travel style — or search in plain
        language, like "blue lake near Leh".
      </p>

      <form
        className="mt-6 flex flex-wrap gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setActiveQuery(searchInput.trim());
        }}
      >
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search destinations…"
          className="w-full max-w-sm rounded-full border border-stone/20 px-4 py-2 text-sm focus:border-accent focus:outline-none"
        />
        {isSearching && (
          <button
            type="button"
            onClick={() => {
              setSearchInput('');
              setActiveQuery('');
            }}
            className="rounded-full border border-stone/20 px-4 py-2 text-sm text-stone/70 hover:border-accent"
          >
            Clear
          </button>
        )}
      </form>

      {!isSearching && (
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(undefined)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              !category ? 'bg-stone text-snow' : 'border border-stone/20 text-stone/70'
            }`}
          >
            All
          </button>
          {categories?.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.slug)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                category === c.slug ? 'bg-stone text-snow' : 'border border-stone/20 text-stone/70'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        {isSearching ? (
          searchLoading ? (
            <p className="text-stone/60">Searching…</p>
          ) : searchData && searchData.results.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {searchData.results.map((r) => (
                <DestinationCard key={r.id} destination={r} />
              ))}
            </div>
          ) : (
            <p className="text-stone/60">No destinations matched "{activeQuery}".</p>
          )
        ) : listLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-xl bg-sand/30" />
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
  );
}
