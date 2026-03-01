import { Controller, Get, UseGuards, UseInterceptors, Req, Query } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { TenantInterceptor } from '../common/tenant.interceptor';
import { ActivityService } from './activity.service';

@Controller('activity')
@UseGuards(AuthGuard)
@UseInterceptors(TenantInterceptor)
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Get()
  async getRecent(@Req() req: any, @Query('limit') limit?: string) {
    return this.activityService.getRecentActivity(
      req.tenantId, 
      limit ? parseInt(limit, 10) : 10
    );
  }
}
