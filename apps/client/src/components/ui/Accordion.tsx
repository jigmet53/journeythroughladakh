import { useId, useState, type ReactNode } from 'react';

interface AccordionItemProps {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

/** One disclosure row. A real button controls the panel (aria-expanded /
 * aria-controls), and the panel animates open with a grid-rows transition, so
 * it works by keyboard and screen reader without any layout-measuring JS. */
export function AccordionItem({ question, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-stone/10 last:border-b-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-lg font-medium text-stone transition hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-xl"
        >
          <span>{question}</span>
          <span
            aria-hidden="true"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone/20 text-lg leading-none transition-transform duration-300 ${
              open ? 'rotate-45 border-accent text-accent' : ''
            }`}
          >
            +
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className={`pb-5 pr-12 text-stone/75 leading-relaxed ${open ? '' : 'invisible'}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
