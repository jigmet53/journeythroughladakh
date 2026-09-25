import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AccordionItem } from '../../components/ui/Accordion';
import { PageHero } from '../../components/ui/PageHero';
import { Reveal } from '../../components/ui/Reveal';
import { emberButton, inputClass } from '../../components/ui/forms';
import { Seo } from '../../components/seo/Seo';
import { allFaqItems, faqCategories, type FaqItem } from '../../data/faq';
import { buildBreadcrumbList, buildFaqPage } from '../../utils/structuredData';

function Answer({ item }: { item: FaqItem }) {
  return (
    <>
      <p>{item.a}</p>
      {item.link && (
        <Link to={item.link.to} className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
          {item.link.label} →
        </Link>
      )}
    </>
  );
}

export function FaqPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');

  const q = query.trim().toLowerCase();
  const results = useMemo(
    () => (q ? allFaqItems.filter((i) => `${i.q} ${i.a}`.toLowerCase().includes(q)) : []),
    [q],
  );
  const visibleCategories = category === 'all' ? faqCategories : faqCategories.filter((c) => c.id === category);

  const chip = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
      active ? 'bg-night text-snow' : 'border border-stone/20 text-stone/70 hover:border-accent hover:text-accent'
    }`;

  return (
    <div>
      <Seo
        title="Ladakh travel FAQ — permits, altitude, best time & more"
        description="Answers to the questions travellers ask most about visiting Ladakh: the best time to go, permits, altitude sickness, getting to Leh, money and connectivity."
        path="/faq"
        jsonLd={[
          buildFaqPage(allFaqItems),
          buildBreadcrumbList([{ name: 'FAQ', path: '/faq' }]),
        ]}
      />
      <PageHero
        photo="thiksey-monastery"
        eyebrow="FAQ"
        title={
          <>
            Questions, <em>answered</em>
          </>
        }
        subtitle="The things travellers ask most before a Ladakh trip — permits, altitude, seasons and getting around."
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div role="search">
          <label htmlFor="faq-search" className="sr-only">
            Search the FAQ
          </label>
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions — try “permit” or “altitude”"
            className={`${inputClass} rounded-full px-5 py-3`}
          />
        </div>

        {!q && (
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
            <button aria-pressed={category === 'all'} onClick={() => setCategory('all')} className={chip(category === 'all')}>
              All
            </button>
            {faqCategories.map((c) => (
              <button key={c.id} aria-pressed={category === c.id} onClick={() => setCategory(c.id)} className={chip(category === c.id)}>
                {c.title}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10" aria-live="polite">
          {q ? (
            results.length > 0 ? (
              <>
                <p className="mb-2 text-sm text-stone/60">
                  {results.length} result{results.length === 1 ? '' : 's'} for "{query.trim()}"
                </p>
                <div className="rounded-2xl border border-stone/10 bg-white px-5 shadow-sm sm:px-7">
                  {results.map((item) => (
                    <AccordionItem key={item.q} question={item.q} defaultOpen={results.length <= 3}>
                      <Answer item={item} />
                    </AccordionItem>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-stone/25 p-10 text-center">
                <p className="font-display text-xl font-medium text-stone">No answers matched "{query.trim()}"</p>
                <p className="mt-1 text-sm text-stone/60">Try a shorter word, or ask us directly.</p>
                <Link to="/contact" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
                  Contact us →
                </Link>
              </div>
            )
          ) : (
            <div className="flex flex-col gap-10">
              {visibleCategories.map((cat) => (
                <Reveal key={cat.id}>
                  <section aria-labelledby={`faq-${cat.id}`}>
                    <h2 id={`faq-${cat.id}`} className="mb-2 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                      <span className="h-px w-8 bg-accent" aria-hidden="true" />
                      {cat.title}
                    </h2>
                    <div className="rounded-2xl border border-stone/10 bg-white px-5 shadow-sm sm:px-7">
                      {cat.items.map((item) => (
                        <AccordionItem key={item.q} question={item.q}>
                          <Answer item={item} />
                        </AccordionItem>
                      ))}
                    </div>
                  </section>
                </Reveal>
              ))}
            </div>
          )}
        </div>

        <div className="mt-14 overflow-hidden rounded-3xl bg-night p-8 text-center text-snow sm:p-10">
          <h2 className="font-display text-3xl font-medium">
            Still have a <em className="font-medium text-ember">question?</em>
          </h2>
          <p className="mx-auto mt-2 max-w-md text-snow/75">Ask the AI guide for a quick answer, or send us a message.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/ai" className={emberButton}>
              Ask the AI guide
            </Link>
            <Link to="/contact" className="rounded-full border border-snow/40 px-7 py-3 text-sm font-medium text-snow hover:border-snow hover:bg-snow/10">
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
