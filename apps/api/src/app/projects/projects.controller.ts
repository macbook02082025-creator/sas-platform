import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthGuard } from '../auth/auth.guard';
import { TenantInterceptor } from '../common/tenant.interceptor';

@Controller('projects')
@UseGuards(AuthGuard)
@UseInterceptors(TenantInterceptor)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Req() req: any, @Body('name') name: string) {
    return this.projectsService.create(req.tenantId, name);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.projectsService.findAll(req.tenantId);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.projectsService.findOne(req.tenantId, id);
  }
}
