import { useRef, useState } from 'react';
import { streamAiChat, type AiChatMessage } from '../../services/ai.api';
import { PageHero } from '../../components/ui/PageHero';
import { Seo } from '../../components/seo/Seo';

const SUGGESTED_PROMPTS = [
  { text: 'Is September a good time to visit Ladakh?', hint: 'Season & weather' },
  { text: 'Build me a 5-day itinerary', hint: 'Trip planning' },
  { text: 'Where should I stay in Leh?', hint: 'Where to stay' },
  { text: 'How do I avoid altitude sickness?', hint: 'Health & safety' },
];

interface ChatMessage extends AiChatMessage {
  id: string;
  toolStatus?: string;
}

function GuideAvatar() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-night" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 32 32">
        <path d="M4 25l8.5-14 5 8 3.5-5 7 11z" className="fill-sand" />
        <circle cx="23" cy="9" r="2.5" className="fill-ember" />
      </svg>
    </span>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" role="status" aria-label="The guide is typing">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone/40" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  );
}

export function AiPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  };

  const send = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const history = [...messages, { id: crypto.randomUUID(), role: 'user' as const, content: text }];
    setMessages(history);
    setInput('');
    setIsStreaming(true);
    scrollToBottom();

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      for await (const event of streamAiChat(history.map(({ role, content }) => ({ role, content })))) {
        if (event.type === 'text') {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + event.text, toolStatus: undefined } : m)),
          );
          scrollToBottom();
        } else if (event.type === 'tool_use') {
          const label =
            event.name === 'get_destination'
              ? `Looking up ${event.input.slug ?? 'a destination'}…`
              : 'Checking your itinerary…';
          setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, toolStatus: label } : m)));
        } else if (event.type === 'error') {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: event.message, toolStatus: undefined } : m)),
          );
        }
      }
    } finally {
      setIsStreaming(false);
      scrollToBottom();
    }
  };

  return (
    <div>
      <Seo
        title="Ask the AI guide about Ladakh"
        description="Ask about routes, altitude, permits and the best time to visit — answers grounded in verified Ladakh destination knowledge."
        path="/ai"
      />
      <PageHero
        photo="khardung-la"
        eyebrow="AI guide"
        title={
          <>
            Ask anything about <em>Ladakh</em>
          </>
        }
        subtitle="Routes, altitude, the best season — answered from verified destination knowledge."
        overlap
      />

      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <div className="relative z-10 -mt-14 overflow-hidden rounded-3xl border border-stone/10 bg-white shadow-xl">
          <div className="flex items-center gap-3 border-b border-stone/10 px-5 py-4">
            <GuideAvatar />
            <div>
              <p className="font-display text-lg font-medium leading-tight text-stone">Ladakh guide</p>
              <p className="text-xs text-stone/50">Not live weather, road status or permits — always confirm those locally.</p>
            </div>
          </div>

          <div role="log" aria-live="polite" className="h-[26rem] overflow-y-auto px-4 py-5 sm:px-6">
            {messages.length === 0 ? (
              <div>
                <p className="font-display text-2xl font-medium text-stone">
                  Where would you like to <em className="font-medium text-accent">begin?</em>
                </p>
                <p className="mt-1 text-sm text-stone/60">Pick a question, or type your own below.</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {SUGGESTED_PROMPTS.map((p) => (
                    <button
                      key={p.text}
                      onClick={() => send(p.text)}
                      className="rounded-2xl border border-stone/10 bg-sand/15 p-4 text-left transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">{p.hint}</span>
                      <span className="mt-1 block text-sm font-medium text-stone">{p.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {messages.map((m) => (
                  <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
                    {m.role === 'assistant' && <GuideAvatar />}
                    <div className={`min-w-0 max-w-[85%] ${m.role === 'user' ? 'text-right' : ''}`}>
                      <div
                        className={`inline-block whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-left text-sm leading-relaxed ${
                          m.role === 'user' ? 'rounded-br-md bg-night text-snow' : 'rounded-bl-md bg-sand/25 text-stone'
                        }`}
                      >
                        {m.content || (m.toolStatus ? '' : isStreaming ? <TypingDots /> : '')}
                      </div>
                      {m.toolStatus && <p className="mt-1 text-xs italic text-stone/50">{m.toolStatus}</p>}
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t border-stone/10 p-4"
          >
            <label htmlFor="ai-input" className="sr-only">
              Ask anything about Ladakh
            </label>
            <input
              id="ai-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Ladakh…"
              className="min-w-0 flex-1 rounded-full border border-stone/20 bg-snow px-5 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              aria-label="Send message"
              className="flex items-center gap-2 rounded-full bg-ember px-6 text-sm font-semibold text-night transition hover:brightness-110 disabled:opacity-50"
            >
              <span className="hidden sm:inline">Send</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
