import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { SkillsService, CreateSkillDto } from './skills.service';
import { AuthGuard } from '../auth/auth.guard';
import { TenantInterceptor } from '../common/tenant.interceptor';

@Controller('skills')
@UseGuards(AuthGuard)
@UseInterceptors(TenantInterceptor)
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateSkillDto) {
    return this.skillsService.create(req.tenantId, dto);
  }

  @Get()
  findAll(@Req() req: any, @Query('projectId') projectId: string) {
    return this.skillsService.findAll(req.tenantId, projectId);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.skillsService.findOne(req.tenantId, id);
  }

  @Post(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() data: Partial<CreateSkillDto>
  ) {
    return this.skillsService.update(req.tenantId, id, data);
  }

  @Post(':id/delete')
  delete(@Req() req: any, @Param('id') id: string) {
    return this.skillsService.delete(req.tenantId, id);
  }
}
