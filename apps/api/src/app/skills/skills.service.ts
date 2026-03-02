import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ActivityService } from '../activity/activity.service';

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
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService
  ) {}

  async create(tenantId: string, dto: CreateSkillDto) {
    // Ensure project belongs to tenant
    const project = await this.prisma.project.findFirst({
      where: { id: dto.projectId, organizationId: tenantId }
    });

    if (!project) throw new NotFoundException('Project not found');

    const { projectId, ...rest } = dto;

    const skill = await this.prisma.skill.create({
      data: {
        ...rest,
        project: { connect: { id: projectId } }
      }
    });

    await this.activityService.logActivity({
      type: 'SKILL_CREATED',
      description: `New Intelligence Skill "${dto.name}" forged using ${dto.modelName || 'gpt-4o'} (Temp: ${dto.temperature || 0.7}) for Unit "${project.name}".`,
      organizationId: tenantId,
      projectId: projectId,
    });

    return skill;
  }

  async findAll(tenantId: string, projectId?: string) {
    return this.prisma.skill.findMany({
      where: { 
        project: { 
          organizationId: tenantId,
          ...(projectId ? { id: projectId } : {})
        } 
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        project: {
          select: {
            name: true
          }
        }
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

  async update(tenantId: string, id: string, data: Partial<CreateSkillDto>) {
    const skill = await this.findOne(tenantId, id);
    const { projectId, ...rest } = data;
    const updated = await this.prisma.skill.update({
      where: { id },
      data: {
        ...rest,
        ...(projectId ? { project: { connect: { id: projectId } } } : {})
      }
    });

    await this.activityService.logActivity({
      type: 'SKILL_UPDATED',
      description: `Skill "${updated.name}" logic recalibrated. Model: ${updated.modelName}, Temp: ${updated.temperature}.`,
      organizationId: tenantId,
      projectId: updated.projectId,
    });

    return updated;
  }

  async delete(tenantId: string, id: string) {
    const skill = (await this.prisma.skill.findFirst({
      where: { id, project: { organizationId: tenantId } },
      include: { project: { select: { name: true } } }
    })) as any;

    if (!skill) throw new NotFoundException('Skill not found');

    const deleted = await this.prisma.skill.delete({
      where: { id }
    });

    await this.activityService.logActivity({
      type: 'SKILL_DELETED',
      description: `Skill "${skill.name}" was purged from Unit "${skill.project.name}".`,
      organizationId: tenantId,
      projectId: skill.projectId,
    });

    return deleted;
  }
}
