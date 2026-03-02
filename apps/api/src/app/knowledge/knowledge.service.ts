import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';
import { PrismaService } from '../prisma.service';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class KnowledgeService {
  private readonly logger = new Logger(KnowledgeService.name);
  private readonly AI_ENGINE_URL = process.env['AI_ENGINE_URL'] || 'http://localhost:8000';

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly activityService: ActivityService,
  ) {}

  async getDocuments(organizationId: string) {
    return this.prisma.knowledge.findMany({
      where: { organizationId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async uploadDocument(organizationId: string, file: any) {
    try {
      this.logger.log(`Uploading document for organization: ${organizationId}`);
      
      const formData = new FormData();
      formData.append('tenant_id', organizationId);
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      await firstValueFrom(
        this.httpService.post(
          `${this.AI_ENGINE_URL}/api/v1/knowledge/upload`,
          formData,
          {
            headers: formData.getHeaders(),
          },
        ),
      );

      // Save to Database
      const knowledge = await this.prisma.knowledge.create({
        data: {
          name: file.originalname,
          size: this.formatBytes(file.size),
          type: file.originalname.split('.').pop() || 'unknown',
          status: 'indexed',
          organizationId: organizationId,
        },
      });

      await this.activityService.logActivity({
        type: 'KNOWLEDGE_UPLOADED',
        description: `New knowledge fragment "${file.originalname}" was integrated into the vault.`,
        organizationId: organizationId,
      });

      return knowledge;
    } catch (error) {
      this.logger.error('Failed to upload document to AI Engine:', error.message);
      throw error;
    }
  }

  async deleteDocument(organizationId: string, id: string) {
    try {
      const doc = await this.prisma.knowledge.findFirst({
        where: { id, organizationId },
      });

      if (!doc) {
        throw new NotFoundException('Document not found or access denied');
      }

      // Notify AI Engine
      await firstValueFrom(
        this.httpService.post(`${this.AI_ENGINE_URL}/api/v1/knowledge/delete`, {
          tenant_id: organizationId,
          file_name: doc.name,
        }),
      );

      // Delete from DB
      const deleted = await this.prisma.knowledge.delete({
        where: { id },
      });

      await this.activityService.logActivity({
        type: 'KNOWLEDGE_DELETED',
        description: `Knowledge fragment "${doc.name}" was purged from the neural network.`,
        organizationId: organizationId,
      });

      return deleted;
    } catch (error) {
      this.logger.error(`Failed to delete document ${id}:`, error.message);
      throw error;
    }
  }

  private formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
