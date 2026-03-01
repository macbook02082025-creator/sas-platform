import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Req,
  Res,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/auth.guard';
import { TenantInterceptor } from '../common/tenant.interceptor';
import { SkillsService } from '../skills/skills.service';

@Controller('chat')
@UseGuards(AuthGuard)
@UseInterceptors(TenantInterceptor)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly skillsService: SkillsService,
  ) {}

  @Post('stream')
  @HttpCode(200)
  async streamChat(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: { skillId?: string; systemPrompt?: string; user_input: string },
  ) {
    let systemPrompt = body.systemPrompt;
    
    if (body.skillId) {
      const skill = await this.skillsService.findOne(req.tenantId, body.skillId);
      systemPrompt = skill.systemPrompt;
    }

    if (!systemPrompt) {
      res.status(400).send('Either skillId or systemPrompt must be provided');
      return;
    }
    
    await this.chatService.streamChat(
      req.tenantId,
      body.skillId || 'sandbox',
      systemPrompt,
      body.user_input,
      res,
    );
  }
}
