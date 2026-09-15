export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type AiStreamEvent =
  | { type: 'text'; text: string }
  | { type: 'tool_use'; name: string; input: Record<string, unknown> }
  | { type: 'done' }
  | { type: 'error'; message: string };

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/** Manual fetch + ReadableStream parsing, not EventSource — EventSource is
 * GET-only and can't send the message-history POST body this endpoint needs. */
export async function* streamAiChat(messages: AiChatMessage[]): AsyncGenerator<AiStreamEvent> {
  const response = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok || !response.body) {
    yield { type: 'error', message: 'Could not reach the AI assistant.' };
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      const payload = line.replace(/^data: /, '').trim();
      if (!payload) continue;
      try {
        yield JSON.parse(payload) as AiStreamEvent;
      } catch {
        // ignore malformed frame
      }
    }
  }
}
