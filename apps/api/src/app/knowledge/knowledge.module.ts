import { Module } from '@nestjs/common';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeService } from './knowledge.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma.module';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [HttpModule, PrismaModule, ActivityModule],
  controllers: [KnowledgeController],
  providers: [KnowledgeService],
})
export class KnowledgeModule {}
