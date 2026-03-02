import { Controller, Get, UseGuards, UseInterceptors, Req, Query } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { TenantInterceptor } from '../common/tenant.interceptor';
import { StatsService } from './stats.service';

@Controller('stats')
@UseGuards(AuthGuard)
@UseInterceptors(TenantInterceptor)
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get()
  async getStats(@Req() req: any, @Query('range') range?: string) {
    return this.statsService.getOrgStats(req.tenantId, range);
  }
}
