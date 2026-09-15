import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, type Content, type Part } from '@google/genai';
import { RagService } from '../rag/rag.service';
import { DestinationsService } from '../destinations/destinations.service';
import { ItineraryService } from '../itinerary/itinerary.service';
import { AI_TOOLS, AiToolExecutor } from './ai-tools';
import type { AiChatMessageDto } from './dto/ai-chat.dto';

// gemini-3.8-flash (newest) returned frequent 503 "high demand" errors on
// the free tier during testing; gemini-2.5-flash was consistently reliable.
const MODEL = 'gemini-2.5-flash';
const MAX_OUTPUT_TOKENS = 4096;
const MAX_TOOL_ITERATIONS = 4;
const MAX_RETRIES_PER_TURN = 2;
const RETRY_DELAY_MS = 800;

function isRetryable(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return message.includes('UNAVAILABLE') || message.includes('"code":503');
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SYSTEM_PROMPT = `You are the Journey Through Ladakh travel assistant. You help travelers plan trips to Ladakh, India, using only the destination knowledge provided to you (in the context block below and via your tools) — never invent facts.

Your domain is destinations and itineraries only. You do NOT have live weather, road-condition, or permit data. If asked about anything you cannot verify from your context or tools — current weather, road closures, permit requirements, medical advice, or other time-sensitive/operational information — respond exactly with: "I don't have verified current information for that. Please confirm with the relevant local authority." Do not guess or fabricate an answer instead.

Use get_destination when you need structured facts (altitude, distance, best time) about a specific place rather than relying on the context block alone. Use get_itinerary only when the user references a specific saved trip by id. You have no tool to build a new multi-day itinerary — if asked to build, plan, or generate one, don't attempt it yourself; tell the user to use the "Plan a Trip" page, which builds a real day-by-day itinerary from the destination database.

Keep answers concise and structured: a short direct answer first, then supporting detail only if useful. Avoid unnecessarily long responses.`;

export type AiStreamEvent =
  | { type: 'text'; text: string }
  | { type: 'tool_use'; name: string; input: Record<string, unknown> }
  | { type: 'done' }
  | { type: 'error'; message: string };

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private client: GoogleGenAI | null = null;
  private readonly toolExecutor: AiToolExecutor;

  constructor(
    private readonly config: ConfigService,
    private readonly rag: RagService,
    destinationsService: DestinationsService,
    itineraryService: ItineraryService,
  ) {
    this.toolExecutor = new AiToolExecutor(destinationsService, itineraryService);
  }

  private getClient(): GoogleGenAI {
    if (!this.client) {
      this.client = new GoogleGenAI({ apiKey: this.config.get<string>('GEMINI_API_KEY') });
    }
    return this.client;
  }

  async *chat(messages: AiChatMessageDto[]): AsyncGenerator<AiStreamEvent> {
    const latestUserMessage = [...messages].reverse().find((m) => m.role === 'user');

    let retrievedContext = '';
    if (latestUserMessage) {
      try {
        const chunks = await this.rag.retrieve(latestUserMessage.content);
        if (chunks.length > 0) {
          retrievedContext =
            '\n\nRetrieved context (verified destination knowledge — cite it, don\'t contradict it):\n' +
            chunks.map((c) => `[${c.title}] ${c.chunkText}`).join('\n');
        }
      } catch (err) {
        this.logger.error(`RAG retrieval failed, continuing without context: ${(err as Error).message}`);
      }
    }

    const systemInstruction = SYSTEM_PROMPT + retrievedContext;
    const contents: Content[] = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    try {
      const client = this.getClient();

      for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
        // The free tier intermittently returns 503 "high demand" mid-stream
        // (observed repeatedly in testing). Once we've yielded real text to
        // the caller, retrying would show a duplicated/garbled reply, so a
        // retry only happens while this attempt's output is still empty —
        // otherwise the failure surfaces normally via the outer catch.
        let accumulatedParts: Part[] = [];
        let attempt = 0;
        for (;;) {
          accumulatedParts = [];
          let yieldedAnything = false;
          try {
            const stream = await client.models.generateContentStream({
              model: MODEL,
              contents,
              config: {
                systemInstruction,
                maxOutputTokens: MAX_OUTPUT_TOKENS,
                tools: [{ functionDeclarations: AI_TOOLS }],
              },
            });

            // Gemini's streaming chunks carry deltas, not the running total —
            // there's no SDK helper to reconstruct the full turn (unlike
            // Anthropic's stream.finalMessage()), so every part is also
            // accumulated to rebuild the complete model Content afterward.
            for await (const chunk of stream) {
              const parts = chunk.candidates?.[0]?.content?.parts ?? [];
              accumulatedParts.push(...parts);
              for (const part of parts) {
                if (part.text) {
                  yield { type: 'text', text: part.text };
                  yieldedAnything = true;
                }
              }
            }
            break;
          } catch (err) {
            if (yieldedAnything || attempt >= MAX_RETRIES_PER_TURN || !isRetryable(err)) throw err;
            attempt++;
            this.logger.warn(`Retrying Gemini call after transient error (attempt ${attempt}): ${(err as Error).message}`);
            await sleep(RETRY_DELAY_MS * attempt);
          }
        }

        const functionCalls = accumulatedParts
          .filter((p) => p.functionCall)
          .map((p) => p.functionCall!);

        if (functionCalls.length === 0) break;

        contents.push({ role: 'model', parts: accumulatedParts });

        const responseParts: Part[] = [];
        for (const call of functionCalls) {
          const name = call.name ?? '';
          const input = call.args ?? {};
          yield { type: 'tool_use', name, input };
          const result = await this.toolExecutor.execute(name, input);
          responseParts.push({
            functionResponse: { id: call.id, name, response: { output: result } },
          });
        }
        contents.push({ role: 'user', parts: responseParts });
      }

      yield { type: 'done' };
    } catch (err) {
      this.logger.error(`AI chat failed: ${(err as Error).message}`);
      yield { type: 'error', message: 'The AI assistant is unavailable right now. Please try again.' };
    }
  }
}
