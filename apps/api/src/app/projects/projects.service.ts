import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService
  ) {}

  async create(tenantId: string, name: string, description?: string) {
    const project = await this.prisma.project.create({
      data: {
        name,
        description: description || "Ready for skill deployment. Intelligence pipeline active.",
        load: Math.floor(Math.random() * 50) + 40, // Random load between 40 and 90
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

  async update(tenantId: string, id: string, data: { name?: string; description?: string }) {
    await this.findOne(tenantId, id);
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
