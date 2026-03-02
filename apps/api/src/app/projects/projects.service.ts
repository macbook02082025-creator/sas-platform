import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ActivityService } from '../activity/activity.service';

import { Project } from '@sas-platform/shared-dto';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService
  ) {}

  async create(tenantId: string, name: string, description?: string): Promise<Project> {
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

    return project as unknown as Project;
  }

  async findAll(tenantId: string): Promise<Project[]> {
    return (await this.prisma.project.findMany({
      where: { organizationId: tenantId },
      include: {
        skills: {
          select: {
            id: true,
            name: true,
            projectId: true,
          }
        },
        _count: {
          select: { skills: true, apiKeys: true },
        },
      },
    })) as unknown as Project[];
  }

  async findOne(tenantId: string, id: string): Promise<Project> {
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

    return project as unknown as Project;
  }

  async update(tenantId: string, id: string, data: { name?: string; description?: string }): Promise<Project> {
    const project = await this.findOne(tenantId, id);
    const updated = await this.prisma.project.update({
      where: { id },
      data,
    });

    await this.activityService.logActivity({
      type: 'PROJECT_UPDATED',
      description: `Configuration for Unit "${updated.name}" was modified.`,
      organizationId: tenantId,
      projectId: id,
    });

    return updated as unknown as Project;
  }

  async delete(tenantId: string, id: string): Promise<Project> {
    const project = await this.findOne(tenantId, id);
    const deleted = await this.prisma.project.delete({
      where: { id },
    });

    await this.activityService.logActivity({
      type: 'PROJECT_DELETED',
      description: `Unit "${project.name}" was decommissioned and neural links severed.`,
      organizationId: tenantId,
    });

    return deleted as unknown as Project;
  }
}
