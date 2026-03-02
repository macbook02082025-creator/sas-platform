import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { startOfDay, endOfDay, subDays, startOfWeek, startOfMonth, startOfQuarter, startOfYear, endOfYesterday } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async logActivity(data: {
    type: string;
    description: string;
    organizationId: string;
    projectId?: string;
  }) {
    try {
      const logMsg = `[${new Date().toISOString()}] LOGGING: ${data.type} - ${data.description}\n`;
      fs.appendFileSync(path.join(process.cwd(), 'activity.log'), logMsg);
    } catch (fsError) {
      console.error('Failed to write to activity.log:', fsError.message);
    }
    
    return this.prisma.activity.create({
      data,
    });
  }

  async getRecentActivity(organizationId: string, limit = 10, range?: string) {
    const now = new Date();
    let startDate: Date | undefined;
    let endDate = endOfDay(now);

    if (range) {
      switch (range) {
        case 'today':
          startDate = startOfDay(now);
          break;
        case 'yesterday':
          startDate = startOfDay(subDays(now, 1));
          endDate = endOfYesterday();
          break;
        case 'this_week':
          startDate = startOfWeek(now);
          break;
        case 'this_month':
          startDate = startOfMonth(now);
          break;
        case 'this_quarter':
          startDate = startOfQuarter(now);
          break;
        case 'this_year':
          startDate = startOfYear(now);
          break;
      }
    }

    return this.prisma.activity.findMany({
      where: { 
        organizationId,
        ...(startDate ? { createdAt: { gte: startDate, lte: endDate } } : {})
      },
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
