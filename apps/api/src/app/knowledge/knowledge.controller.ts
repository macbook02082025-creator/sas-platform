import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Req,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { KnowledgeService } from './knowledge.service';
import { AuthGuard } from '../auth/auth.guard';
import { TenantInterceptor } from '../common/tenant.interceptor';

@Controller('knowledge')
@UseGuards(AuthGuard)
@UseInterceptors(TenantInterceptor)
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Req() req: any, @UploadedFile() file: any) {
    return this.knowledgeService.uploadDocument(req.tenantId, file);
  }

  @Get('all')
  async getDocuments(@Req() req: any) {
    return this.knowledgeService.getDocuments(req.tenantId);
  }

  @Post(':id/delete')
  async deleteFile(@Req() req: any, @Param('id') id: string) {
    return this.knowledgeService.deleteDocument(req.tenantId, id);
  }
}
