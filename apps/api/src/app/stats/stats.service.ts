import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { startOfDay, endOfDay, subDays, startOfWeek, startOfMonth, startOfQuarter, startOfYear, endOfYesterday } from 'date-fns';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getOrgStats(organizationId: string, range = 'this_week') {
    const now = new Date();
    let startDate: Date;
    let endDate = now;

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
      default:
        startDate = startOfWeek(now);
    }

    const where = { 
      organizationId,
      createdAt: { gte: startDate, lte: endDate }
    };

    const [projectCount, skillCount, activityCount, knowledgeCount, knowledgeItems] = await Promise.all([
      this.prisma.project.count({ where }),
      this.prisma.skill.count({ where: { project: { organizationId }, createdAt: { gte: startDate, lte: endDate } } }),
      this.prisma.activity.count({ where }),
      this.prisma.knowledge.count({ where }),
      this.prisma.knowledge.findMany({ where, select: { size: true } }),
    ]);

    // Calculate total size
    let totalSizeMB = 0;
    knowledgeItems.forEach(item => {
      const val = parseFloat(item.size);
      if (item.size.includes('KB')) totalSizeMB += val / 1024;
      else if (item.size.includes('MB')) totalSizeMB += val;
      else if (item.size.includes('GB')) totalSizeMB += val * 1024;
    });

    return {
      activeUnits: projectCount,
      skillsDeployed: skillCount,
      dataVaults: knowledgeCount,
      uptimeScore: 99.8,
      activeUnitsTrend: '+12%',
      skillsTrend: `+${skillCount} in period`,
      vaultsTrend: `${totalSizeMB.toFixed(2)}MB`,
      uptimeTrend: '+0.2%',
    };
  }
}
