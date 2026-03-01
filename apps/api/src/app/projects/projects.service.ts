import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, name: string) {
    return this.prisma.project.create({
      data: {
        name,
        organizationId: tenantId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.project.findMany({
      where: { organizationId: tenantId },
      include: {
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
