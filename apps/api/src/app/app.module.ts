import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { ProjectsModule } from './projects/projects.module';
import { SkillsModule } from './skills/skills.module';

@Module({
  imports: [AuthModule, ProjectsModule, SkillsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
