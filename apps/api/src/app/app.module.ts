import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { SkillsModule } from './skills/skills.module';
import { ActivityModule } from './activity/activity.module';
import { StatsModule } from './stats/stats.module';
import { ChatModule } from './chat/chat.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProjectsModule,
    SkillsModule,
    ActivityModule,
    StatsModule,
    ChatModule,
    KnowledgeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
