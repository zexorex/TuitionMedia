import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { ApplicationStatus } from "@prisma/client";

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(requestId: string, tutorId: string, message: string) {
    const request = await this.prisma.tuitionRequest.findUnique({
      where: { id: requestId },
    });
    if (!request) throw new NotFoundException("Tuition request not found");
    if (request.status !== "OPEN") {
      throw new ConflictException("This request is no longer accepting applications");
    }

    const existing = await this.prisma.application.findUnique({
      where: { requestId_tutorId: { requestId, tutorId } },
    });
    if (existing) throw new ConflictException("You have already applied");

    return this.prisma.application.create({
      data: { requestId, tutorId, message },
      include: {
        request: { select: { title: true, subject: true } },
        tutor: { select: { email: true } },
      },
    });
  }

  async findByRequest(requestId: string, studentUserId: string) {
    const request = await this.prisma.tuitionRequest.findUnique({
      where: { id: requestId },
    });
    if (!request) throw new NotFoundException("Tuition request not found");
    if (request.studentId !== studentUserId) {
      throw new ForbiddenException("Not authorized");
    }
    return this.prisma.application.findMany({
      where: { requestId },
      include: {
        tutor: { select: { email: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByTutor(tutorId: string) {
    return this.prisma.application.findMany({
      where: { tutorId },
      include: {
        request: {
          include: { student: { select: { email: true, name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async accept(applicationId: string, studentUserId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { request: true },
    });
    if (!app) throw new NotFoundException("Application not found");
    if (app.request.studentId !== studentUserId) {
      throw new ForbiddenException("Not authorized to accept this application");
    }
    if (app.status !== "PENDING") {
      throw new ConflictException("Application already processed");
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.application.update({
        where: { id: applicationId },
        data: { status: "ACCEPTED" as ApplicationStatus },
      }),
      this.prisma.application.updateMany({
        where: {
          requestId: app.requestId,
          id: { not: applicationId },
        },
        data: { status: "REJECTED" as ApplicationStatus },
      }),
      this.prisma.tuitionRequest.update({
        where: { id: app.requestId },
        data: { status: "IN_PROGRESS" },
      }),
    ]);
    return updated;
  }

  async reject(applicationId: string, studentUserId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { request: true },
    });
    if (!app) throw new NotFoundException("Application not found");
    if (app.request.studentId !== studentUserId) {
      throw new ForbiddenException("Not authorized");
    }
    return this.prisma.application.update({
      where: { id: applicationId },
      data: { status: "REJECTED" as ApplicationStatus },
    });
  }
}
