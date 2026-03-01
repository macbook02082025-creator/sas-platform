import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface CreateSkillDto {
  name: string;
  description?: string;
  systemPrompt: string;
  temperature?: number;
  modelName?: string;
  projectId: string;
}

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateSkillDto) {
    // Ensure project belongs to tenant
    const project = await this.prisma.project.findFirst({
      where: { id: dto.projectId, organizationId: tenantId }
    });

    if (!project) throw new NotFoundException('Project not found');

    const { projectId, ...rest } = dto;

    return this.prisma.skill.create({
      data: {
        ...rest,
        project: { connect: { id: projectId } }
      }
    });
  }

  async findAll(tenantId: string, projectId: string) {
    return this.prisma.skill.findMany({
      where: { 
        project: { id: projectId, organizationId: tenantId } 
      }
    });
  }

  async findOne(tenantId: string, id: string) {
    const skill = await this.prisma.skill.findFirst({
      where: { id, project: { organizationId: tenantId } }
    });

    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }
}
