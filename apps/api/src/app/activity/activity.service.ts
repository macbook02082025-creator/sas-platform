import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async logActivity(data: {
    type: string;
    description: string;
    organizationId: string;
    projectId?: string;
  }) {
    return this.prisma.activity.create({
      data,
    });
  }

  async getRecentActivity(organizationId: string, limit = 10) {
    return this.prisma.activity.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        project: {
          select: { name: true }
        }
      }
    });
  }
}
