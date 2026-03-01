import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, Observable } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly AI_ENGINE_URL = process.env['AI_ENGINE_URL'] || 'http://localhost:8000';

  constructor(private readonly httpService: HttpService) {}

  async streamChat(
    tenantId: string,
    skillId: string,
    systemPrompt: string,
    userInput: string,
    res: Response,
  ) {
    try {
      this.logger.log(`Proxying chat request to AI Engine for tenant: ${tenantId}, skill: ${skillId}`);
      
      const response = (await firstValueFrom(
        this.httpService.post(
          `${this.AI_ENGINE_URL}/api/v1/chat`,
          { tenant_id: tenantId, system_prompt: systemPrompt, user_input: userInput },
          { responseType: 'stream' },
        ),
      )) as any;

      // Forward headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      response.data.on('data', (chunk: any) => {
        res.write(`data: ${JSON.stringify({ content: chunk.toString() })}\n\n`);
      });

      response.data.on('end', () => {
        res.write('event: end\ndata: [DONE]\n\n');
        res.end();
      });

      response.data.on('error', (err: any) => {
        this.logger.error('Error from AI Engine stream:', err);
        res.end();
      });
    } catch (error) {
      this.logger.error('Failed to connect to AI Engine:', error.message);
      res.status(500).send('AI Engine connection failure');
    }
  }
}
