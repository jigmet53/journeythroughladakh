import { useRef, useState } from 'react';
import { streamAiChat, type AiChatMessage } from '../../services/ai.api';

const SUGGESTED_PROMPTS = [
  'Is September a good time to visit Ladakh?',
  'Build me a 5-day itinerary',
  'Where should I stay in Leh?',
];

interface ChatMessage extends AiChatMessage {
  id: string;
  toolStatus?: string;
}

export function AiPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }));
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
    <div className="mx-auto flex max-w-2xl flex-col px-4 py-8 sm:px-6" style={{ minHeight: '70vh' }}>
      <h1 className="font-display text-2xl font-semibold text-stone">Ask AI about Ladakh</h1>
      <p className="mt-1 text-sm text-stone/60">
        Grounded in verified destination knowledge — not live weather, roads, or permits.
      </p>

      <div className="mt-6 flex-1 overflow-y-auto rounded-xl border border-stone/10 bg-white p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-stone/50">Try asking:</p>
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => send(prompt)}
                className="rounded-lg border border-stone/10 bg-sand/10 px-4 py-2 text-left text-sm text-stone hover:border-accent"
              >
                {prompt}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'self-end text-right' : 'self-start'}>
                <div
                  className={`inline-block max-w-md whitespace-pre-wrap rounded-xl px-4 py-2 text-sm ${
                    m.role === 'user' ? 'bg-stone text-snow' : 'bg-sand/20 text-stone'
                  }`}
                >
                  {m.content || (m.toolStatus ? '' : isStreaming ? '…' : '')}
                </div>
                {m.toolStatus && <p className="mt-1 text-xs italic text-stone/50">{m.toolStatus}</p>}
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
        className="mt-4 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about Ladakh…"
          className="flex-1 rounded-full border border-stone/20 px-4 py-2 text-sm focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-snow disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
