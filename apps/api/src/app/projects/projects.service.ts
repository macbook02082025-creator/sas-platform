import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService
  ) {}

  async create(tenantId: string, name: string) {
    const project = await this.prisma.project.create({
      data: {
        name,
        organizationId: tenantId,
      },
    });

    await this.activityService.logActivity({
      type: 'PROJECT_CREATED',
      description: `Project "${name}" was added to the intelligence network.`,
      organizationId: tenantId,
      projectId: project.id,
    });

    return project;
  }

  async findAll(tenantId: string) {
    return this.prisma.project.findMany({
      where: { organizationId: tenantId },
      include: {
        skills: {
          select: {
            id: true,
            name: true,
          }
        },
        _count: {
          select: { skills: true, apiKeys: true },
        },
      },
    });
  }

  async findOne(tenantId: string, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, organizationId: tenantId },
      include: {
        skills: true,
        apiKeys: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }
}
