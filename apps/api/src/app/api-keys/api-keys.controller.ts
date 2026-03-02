import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  Req,
  Query,
} from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { AuthGuard } from '../auth/auth.guard';
import { TenantInterceptor } from '../common/tenant.interceptor';

@Controller('api-keys')
@UseGuards(AuthGuard)
@UseInterceptors(TenantInterceptor)
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  create(
    @Req() req: any,
    @Body('projectId') projectId: string,
    @Body('name') name: string
  ) {
    return this.apiKeysService.create(req.tenantId, projectId, name);
  }

  @Get()
  findAll(@Req() req: any, @Query('projectId') projectId: string) {
    return this.apiKeysService.findAll(req.tenantId, projectId);
  }

  @Post(':id/delete')
  delete(@Req() req: any, @Param('id') id: string) {
    return this.apiKeysService.delete(req.tenantId, id);
  }
}
