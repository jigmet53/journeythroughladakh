import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AiService } from './ai.service';
import { AiChatDto } from './dto/ai-chat.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /** Public: the assistant only ever reads published destinations/public
   * itineraries via its tools — no user-specific data is exposed. Manual
   * SSE (not Nest's @Sse(), which targets browser EventSource/GET) because
   * the frontend needs a POST body for the message history. */
  @Public()
  @Post('chat')
  async chat(@Body() dto: AiChatDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    for await (const event of this.aiService.chat(dto.messages)) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    res.end();
  }
}
