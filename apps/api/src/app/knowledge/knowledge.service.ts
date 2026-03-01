import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';

@Injectable()
export class KnowledgeService {
  private readonly logger = new Logger(KnowledgeService.name);
  private readonly AI_ENGINE_URL = process.env['AI_ENGINE_URL'] || 'http://localhost:8000';

  constructor(private readonly httpService: HttpService) {}

  async uploadDocument(tenantId: string, file: any) {
    try {
      this.logger.log(`Uploading document for tenant: ${tenantId}`);
      
      const formData = new FormData();
      formData.append('tenant_id', tenantId);
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const response = (await firstValueFrom(
        this.httpService.post(
          `${this.AI_ENGINE_URL}/api/v1/knowledge/upload`,
          formData,
          {
            headers: formData.getHeaders(),
          },
        ),
      )) as any;

      return response.data;
    } catch (error) {
      this.logger.error('Failed to upload document to AI Engine:', error.message);
      throw error;
    }
  }
}
