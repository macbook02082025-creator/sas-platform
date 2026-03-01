import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getOrgStats(organizationId: string) {
    const [projectCount, skillCount, activityCount] = await Promise.all([
      this.prisma.project.count({ where: { organizationId } }),
      this.prisma.skill.count({ where: { project: { organizationId } } }),
      this.prisma.activity.count({ where: { organizationId } }),
    ]);

    // Uptime and Data Vaults are mocked for now as per project stage
    return {
      activeUnits: projectCount,
      skillsDeployed: skillCount,
      dataVaults: Math.floor(activityCount / 2) + 1, // Mock dynamic value
      uptimeScore: 99.8,
      activeUnitsTrend: '+12%',
      skillsTrend: `+${skillCount > 0 ? 1 : 0} new`,
      vaultsTrend: '+2.4GB',
      uptimeTrend: '+0.2%',
    };
  }
}
