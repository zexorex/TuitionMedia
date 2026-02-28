import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { RequestStatus, UserRole } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface CreateTuitionRequestDto {
  title: string;
  description: string;
  subject: string;
  budget?: number;
  location?: string;
}

export interface UpdateTuitionRequestDto {
  title?: string;
  description?: string;
  subject?: string;
  budget?: number;
  status?: RequestStatus;
  location?: string;
}

@Injectable()
export class TuitionRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(studentId: string, dto: CreateTuitionRequestDto) {
    return this.prisma.tuitionRequest.create({
      data: {
        studentId,
        title: dto.title,
        description: dto.description,
        subject: dto.subject,
        budget: dto.budget != null ? new Decimal(dto.budget) : null,
        location: dto.location,
      },
      include: {
        student: { select: { email: true, name: true } },
      },
    });
  }

  async findAll(filters?: { status?: RequestStatus; subject?: string }) {
    return this.prisma.tuitionRequest.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.subject && { subject: { contains: filters.subject, mode: "insensitive" } }),
      },
      include: {
        student: { select: { email: true, name: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOpenForTutors() {
    return this.prisma.tuitionRequest.findMany({
      where: { status: "OPEN" },
      include: {
        student: { select: { email: true, name: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    const req = await this.prisma.tuitionRequest.findUnique({
      where: { id },
      include: {
        student: { select: { email: true, name: true } },
        applications: {
          include: {
            tutor: { select: { email: true, name: true } },
          },
        },
      },
    });
    if (!req) throw new NotFoundException("Tuition request not found");
    return req;
  }

  async findByStudentId(studentId: string) {
    return this.prisma.tuitionRequest.findMany({
      where: { studentId },
      include: {
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async close(id: string, userId: string) {
    const req = await this.findById(id);
    if (req.studentId !== userId) {
      throw new ForbiddenException("Not authorized to close this request");
    }
    return this.prisma.tuitionRequest.update({
      where: { id },
      data: { status: "CLOSED", closed_at: new Date() },
    });
  }

  async update(id: string, userId: string, role: UserRole, dto: UpdateTuitionRequestDto) {
    const req = await this.findById(id);
    if (req.studentId !== userId && role !== "ADMIN") {
      throw new ForbiddenException("Not authorized to update this request");
    }
    return this.prisma.tuitionRequest.update({
      where: { id },
      data: {
        ...(dto.title != null && { title: dto.title }),
        ...(dto.description != null && { description: dto.description }),
        ...(dto.subject != null && { subject: dto.subject }),
        ...(dto.budget != null && { budget: new Decimal(dto.budget) }),
        ...(dto.status != null && { status: dto.status }),
        ...(dto.location != null && { location: dto.location }),
      },
    });
  }
}
