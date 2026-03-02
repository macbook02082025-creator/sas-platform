import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { RegisterDto, LoginDto, AuthResponse } from '@sas-platform/shared-dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        memberships: {
          create: {
            organization: {
              create: {
                name: dto.organizationName,
                slug: dto.organizationName.toLowerCase().replace(/\s+/g, '-'),
              },
            },
            role: 'OWNER',
          },
        },
      },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });

    const session = await this.prisma.session.create({
      data: { userId: user.id }
    });

    const payload = { sub: user.id, email: user.email, sid: session.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        sid: session.id,
        organizations: user.memberships.map((m) => m.organization),
      },
    };
  }

  async getMe(userId: string, sid?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException();

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      sid: sid,
      organizations: user.memberships.map((m) => m.organization),
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user || !(await argon2.verify(user.passwordHash, dto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const session = await this.prisma.session.create({
      data: { userId: user.id }
    });

    const payload = { sub: user.id, email: user.email, sid: session.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        sid: session.id,
        organizations: user.memberships.map((m) => m.organization),
      },
    };
  }
}
