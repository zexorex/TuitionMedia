import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import type { UserRole } from "@prisma/client";

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  user: { id: string; email: string; name: string | null; role: UserRole };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    role: UserRole,
    name?: string,
    profileData?: { bio?: string; subjects?: string[]; hourlyRate?: number; education?: string } | { gradeLevel?: string; preferredLocation?: string },
  ): Promise<AuthTokens> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException("Email already registered");
    }

    if (!password || password.length < 8) {
      throw new BadRequestException("Password must be at least 8 characters");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        email,
        name: name ?? null,
        password_hash: passwordHash,
        role,
        updated_at: new Date(),
      },
    });

    if (role === "TUTOR" && profileData && "bio" in profileData) {
      await this.prisma.tutorProfile.create({
        data: {
          id: crypto.randomUUID(),
          user_id: user.id,
          bio: profileData.bio,
          subjects: profileData.subjects ?? [],
          hourly_rate: profileData.hourlyRate ?? 0,
          education: profileData.education,
          qualifications: [],
          updated_at: new Date(),
        },
      });
    }
    if (role === "STUDENT" && profileData && "gradeLevel" in profileData) {
      await this.prisma.studentProfile.create({
        data: {
          id: crypto.randomUUID(),
          user_id: user.id,
          grade: profileData.gradeLevel,
          location: profileData.preferredLocation,
          subjects: [],
          updated_at: new Date(),
        },
      });
    }

    return this.signUser(user);
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({ where: { email }, select: { id: true, email: true, name: true, role: true, password_hash: true } });
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw new UnauthorizedException("Invalid email or password");
    }
    return this.signUser(user);
  }

  async validateUser(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true },
    });
    return user ?? null;
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, phone: true, is_verified: true, created_at: true },
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async updateProfile(userId: string, data: { name?: string; phone?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { ...(data.name !== undefined && { name: data.name }), ...(data.phone !== undefined && { phone: data.phone }), updated_at: new Date() },
      select: { id: true, email: true, name: true, role: true, phone: true },
    });
  }

  async getTutorProfile(userId: string) {
    const profile = await this.prisma.tutorProfile.findUnique({ where: { user_id: userId } });
    if (!profile) throw new NotFoundException("Tutor profile not found");
    return profile;
  }

  async upsertTutorProfile(userId: string, data: { bio?: string; subjects?: string[]; hourly_rate?: number; education?: string; location?: string; experience?: number }) {
    const existing = await this.prisma.tutorProfile.findUnique({ where: { user_id: userId } });
    if (existing) {
      return this.prisma.tutorProfile.update({
        where: { user_id: userId },
        data: { ...data, updated_at: new Date() },
      });
    }
    return this.prisma.tutorProfile.create({
      data: {
        id: crypto.randomUUID(),
        user_id: userId,
        bio: data.bio,
        subjects: data.subjects ?? [],
        hourly_rate: data.hourly_rate ?? 0,
        education: data.education,
        location: data.location,
        experience: data.experience ?? 0,
        qualifications: [],
        updated_at: new Date(),
      },
    });
  }

  async getStudentProfile(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({ where: { user_id: userId } });
    if (!profile) throw new NotFoundException("Student profile not found");
    return profile;
  }

  async upsertStudentProfile(userId: string, data: { grade?: string; school?: string; subjects?: string[]; goals?: string; location?: string }) {
    const existing = await this.prisma.studentProfile.findUnique({ where: { user_id: userId } });
    if (existing) {
      return this.prisma.studentProfile.update({
        where: { user_id: userId },
        data: { ...data, updated_at: new Date() },
      });
    }
    return this.prisma.studentProfile.create({
      data: {
        id: crypto.randomUUID(),
        user_id: userId,
        grade: data.grade,
        school: data.school,
        subjects: data.subjects ?? [],
        goals: data.goals,
        location: data.location,
        updated_at: new Date(),
      },
    });
  }

  private signUser(user: { id: string; email: string; name?: string | null; role: UserRole }): AuthTokens {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      user: { id: user.id, email: user.email, name: user.name ?? null, role: user.role },
    };
  }
}
