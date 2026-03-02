import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, projectId: string, name: string) {
    // 1. Verify project belongs to organization
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, organizationId },
    });
    if (!project) throw new NotFoundException('Project not found');

    // 2. Generate secure key
    const prefix = 'sk-sas-';
    const secret = crypto.randomBytes(32).toString('hex');
    const fullKey = `${prefix}${secret}`;
    const keyHash = crypto.createHash('sha256').update(fullKey).digest('hex');

    // 3. Save to DB
    const apiKey = await this.prisma.apiKey.create({
      data: {
        name,
        projectId,
        prefix,
        keyHash,
      },
    });

    return {
      ...apiKey,
      key: fullKey, // ONLY SHOW ONCE
    };
  }

  async findAll(organizationId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, organizationId },
    });
    if (!project) throw new NotFoundException('Project not found');

    return this.prisma.apiKey.findMany({
      where: { projectId },
      select: {
        id: true,
        name: true,
        prefix: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
      },
    });
  }

  async delete(organizationId: string, id: string) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { 
        id,
        project: { organizationId }
      },
    });

    if (!apiKey) throw new NotFoundException('API Key not found');

    return this.prisma.apiKey.delete({
      where: { id },
    });
  }
}
