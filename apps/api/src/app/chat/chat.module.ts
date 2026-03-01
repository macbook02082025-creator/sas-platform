import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { HttpModule } from '@nestjs/axios';
import { SkillsModule } from '../skills/skills.module';

@Module({
  imports: [HttpModule, SkillsModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
