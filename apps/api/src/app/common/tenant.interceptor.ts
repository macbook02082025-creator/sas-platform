import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Tenant context requires authentication');
    }

    // Find the organization this user belongs to
    const tenantIdFromHeader = request.headers['x-tenant-id'] as string;

    const membership = await this.prisma.organizationMember.findFirst({
      where: {
        userId: request.user.sub,
        ...(tenantIdFromHeader ? { organizationId: tenantIdFromHeader } : {}),
      },
      include: {
        organization: true,
      },
    });

    if (!membership) {
      throw new UnauthorizedException(
        tenantIdFromHeader
          ? 'Access to this organization is denied'
          : 'User does not belong to any organization'
      );
    }

    // Attach tenant info to request
    request.tenantId = membership.organizationId;
    request.organization = membership.organization;

    return next.handle();
  }
}
