# System Design Document (SDD)
## TuitionMedia - Digital Tuition Marketplace Platform

**Document Identifier:** TM-SDD-001  
**Version:** 1.0  
**Date:** March 2026  
**Organization:** [University Name] - Department of Computer Science & Engineering  
**Author:** [Your Name]  
**Supervisor:** [Supervisor Name]

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | [Date] | [Your Name] | Initial architecture design |
| 0.5 | [Date] | [Your Name] | Added UML diagrams |
| 1.0 | [Date] | [Your Name] | Final version with UI mockups |

---

## Table of Contents

1. Introduction
2. System Architecture
3. Database Design
4. UML Diagrams
5. API Design
6. User Interface Design
7. Security Design
8. Deployment Architecture

---

## 1. Introduction

### 1.1 Purpose

This System Design Document (SDD) describes the architectural and detailed design of the TuitionMedia platform. It translates the requirements specified in the SRS into a technical blueprint for implementation, covering database schema, system architecture, UML diagrams, API design, and user interface mockups.

### 1.2 Scope

This document covers:
- High-level system architecture
- Database design with Entity-Relationship Diagram (ERD)
- Class diagrams for object-oriented design
- Sequence diagrams for key workflows
- State chart diagrams for status management
- API endpoint specifications
- UI/UX design and mockups
- Security architecture
- Deployment architecture

### 1.3 Definitions and Acronyms

| Term | Definition |
|------|------------|
| **ERD** | Entity-Relationship Diagram |
| **UML** | Unified Modeling Language |
| **API** | Application Programming Interface |
| **REST** | Representational State Transfer |
| **JWT** | JSON Web Token |
| **ORM** | Object-Relational Mapping |
| **MVC** | Model-View-Controller |
| **SSR** | Server-Side Rendering |
| **CSR** | Client-Side Rendering |

### 1.4 References

1. Software Requirement Specification (TM-SRS-001)
2. Next.js Documentation (https://nextjs.org/docs)
3. NestJS Documentation (https://docs.nestjs.com)
4. Prisma Documentation (https://www.prisma.io/docs)
5. UML 2.5 Specification

---

## 2. System Architecture

### 2.1 High-Level Architecture

TuitionMedia follows a **Three-Tier Architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION TIER                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    Next.js 15 Frontend                         │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │  │
│  │  │   Server    │  │   Client    │  │   Static    │          │  │
│  │  │ Components  │  │ Components  │  │   Assets    │          │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │  │
│  │                                                                 │  │
│  │  Technologies: React 19, Tailwind CSS, shadcn/ui, Zustand    │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS/REST API
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         APPLICATION TIER                             │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    NestJS Backend                              │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │  │
│  │  │   Auth      │  │   Request   │  │Application  │          │  │
│  │  │   Module    │  │   Module    │  │   Module    │          │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │  │
│  │                                                                 │  │
│  │  Technologies: Passport JWT, Prisma ORM, TypeScript          │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Prisma ORM
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                            DATA TIER                                 │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                 PostgreSQL Database                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │  │
│  │  │    User     │  │   Request   │  │Application  │          │  │
│  │  │   Tables    │  │   Tables    │  │   Tables    │          │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │  │
│  │                                                                 │  │
│  │  Hosted on: Supabase (Managed PostgreSQL)                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Architecture Patterns

#### 2.2.1 Monorepo Structure

```
tuition-marketplace/
│
├── apps/
│   ├── frontend/          # Next.js Application
│   │   ├── src/
│   │   │   ├── app/       # App Router (Pages)
│   │   │   ├── components/# Reusable Components
│   │   │   ├── lib/       # Utilities & API Client
│   │   │   ├── store/     # Zustand State
│   │   │   └── hooks/     # Custom Hooks
│   │   └── public/        # Static Assets
│   │
│   └── backend/           # NestJS Application
│       ├── src/
│       │   ├── auth/      # Authentication Module
│       │   ├── prisma/    # Database Service
│       │   ├── tuition-request/
│       │   ├── application/
│       │   └── common/    # Shared Utilities
│       └── prisma/
│           └── schema.prisma
│
├── packages/
│   └── shared-schema/     # Shared Zod Schemas
│       └── src/
│           └── index.ts
│
├── turbo.json             # Turborepo Config
├── pnpm-workspace.yaml
└── package.json
```

**Benefits:**
- Code sharing between frontend and backend
- Unified dependency management
- Atomic commits across packages
- Simplified build process with Turborepo

#### 2.2.2 Backend Architecture (NestJS Modules)

```
┌─────────────────────────────────────────────────────────┐
│                     AppModule                           │
│  (Root Module - Imports all feature modules)           │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬────────────┐
        │            │            │            │
        ▼            ▼            ▼            ▼
┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│AuthModule │ │ Request   │ │Application│ │ Prisma    │
│           │ │ Module    │ │ Module    │ │ Module    │
│           │ │           │ │           │ │           │
│- Register │ │- Create   │ │- Submit   │ │- Database │
│- Login    │ │- Browse   │ │- Accept   │ │  Service  │
│- JWT      │ │- Update   │ │- Reject   │ │- Client   │
│- Guards   │ │- Close    │ │- Track    │ │           │
└───────────┘ └───────────┘ └───────────┘ └───────────┘
```

**Module Responsibilities:**

| Module | Responsibility |
|--------|----------------|
| **AppModule** | Root module, imports all feature modules |
| **AuthModule** | User authentication, JWT generation, guards |
| **PrismaModule** | Database connection, Prisma client provider |
| **TuitionRequestModule** | CRUD operations for tuition requests |
| **ApplicationModule** | Application submission and management |

#### 2.2.3 Frontend Architecture (Next.js App Router)

```
┌─────────────────────────────────────────────────────────┐
│                   App Router                            │
│                                                         │
│  / (Public Routes)                                     │
│  ├── page.tsx              # Landing page              │
│  ├── login/page.tsx        # Login form                │
│  └── signup/page.tsx       # Registration form         │
│                                                         │
│  /(dashboard) (Protected Routes)                      │
│  ├── layout.tsx            # Dashboard layout           │
│  ├── dashboard/                                       │
│  │   ├── page.tsx          # Dashboard home            │
│  │   ├── student/          # Student features           │
│  │   │   ├── page.tsx      # Student dashboard         │
│  │   │   ├── new/page.tsx  # Create request            │
│  │   │   └── [id]/page.tsx # Request details           │
│  │   └── tutor/            # Tutor features            │
│  │       ├── page.tsx      # Tutor dashboard           │
│  │       └── applications/ # Application tracking      │
│  └── profile/page.tsx      # Profile management        │
└─────────────────────────────────────────────────────────┘
```

### 2.3 Design Patterns Used

#### 2.3.1 Backend Patterns

| Pattern | Usage | Benefit |
|---------|-------|---------|
| **Dependency Injection** | NestJS services | Loose coupling, testability |
| **Repository Pattern** | Prisma service | Data access abstraction |
| **Guard Pattern** | Authentication guards | Reusable authorization logic |
| **Interceptor Pattern** | Logging, transformation | Cross-cutting concerns |
| **Module Pattern** | Feature organization | Clear boundaries, lazy loading |

#### 2.3.2 Frontend Patterns

| Pattern | Usage | Benefit |
|---------|-------|---------|
| **Component Composition** | UI components | Reusability, maintainability |
| **Custom Hooks** | Form handling, API calls | Logic reuse, separation of concerns |
| **State Management** | Zustand store | Centralized state, persistence |
| **Container/Presentational** | Page vs UI components | Separation of logic and UI |
| **Compound Components** | shadcn/ui | Flexible, accessible components |

---

## 3. Database Design

### 3.1 Entity-Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          ENTITY-RELATIONSHIP DIAGRAM                    │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│        User          │
├──────────────────────┤
│ PK id: UUID          │
│    email: String     │
│    password_hash     │
│    name: String?     │
│    phone: String?    │
│    role: UserRole    │
│    is_verified       │
│    is_active         │
│    created_at        │
│    updated_at        │
└──────────┬───────────┘
           │
           │ 1
           │
           ├────────────────────────┬───────────────────────┐
           │ 1                     │ 1                     │ 1
           │                       │                       │
           ▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  StudentProfile  │    │   TutorProfile   │    │   TutorPost      │
├──────────────────┤    ├──────────────────┤    ├──────────────────┤
│ PK id: UUID      │    │ PK id: UUID      │    │ PK id: UUID      │
│ FK user_id: UUID │    │ FK user_id: UUID │    │ FK tutor_id: UUID│
│    grade         │    │    bio           │    │    title         │
│    school        │    │    education     │    │    description   │
│    subjects[]    │    │    experience    │    │    subject       │
│    goals         │    │    subjects[]   │    │    hourly_rate   │
│    location      │    │    hourly_rate   │    │    location      │
│    budget        │    │    qualifications│    │    is_active     │
└──────────────────┘    │    is_verified   │    │    views         │
                        │    avg_rating    │    └──────────────────┘
                        └──────────────────┘
           │
           │ 1
           │
           ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          TuitionRequest                              │
├──────────────────────────────────────────────────────────────────────┤
│ PK id: CUID                                                          │
│ FK studentId: UUID                                                   │
│    title: String                                                     │
│    description: String                                               │
│    subject: String                                                   │
│    level: String?                                                    │
│    mode: String?                                                     │
│    location: String?                                                 │
│    budget: Decimal?                                                  │
│    duration: Int?                                                    │
│    schedule: JSON?                                                   │
│    status: RequestStatus (OPEN, IN_PROGRESS, CLOSED, CANCELLED)     │
│    contact_unlocked: Boolean                                         │
│    deadline: DateTime?                                               │
│    created_at: DateTime                                              │
│    updated_at: DateTime                                              │
│    closed_at: DateTime?                                              │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
                             │ 1
                             │
                             ├────────────────────────┬─────────────────┐
                             │                        │                 │
                             ▼                        ▼                 ▼
┌──────────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│    Application       │  │   BookingFee     │  │     Review       │
├──────────────────────┤  ├──────────────────┤  ├──────────────────┤
│ PK id: CUID          │  │ PK id: UUID      │  │ PK id: CUID      │
│ FK requestId: CUID   │  │ FK tuition_req   │  │ FK tuition_req   │
│ FK tutorId: UUID     │  │ FK student_id    │  │ FK studentId     │
│    message: String?  │  │ FK tutor_id      │  │ FK tutorId       │
│    proposed_rate     │  │    amount        │  │    rating: Int   │
│    status: AppStatus │  │    payment_method│  │    comment       │
│    created_at        │  │    status        │  │    created_at    │
│    updated_at        │  │    created_at    │  └──────────────────┘
│    responded_at      │  └──────────────────┘
└──────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│    Notification      │         │    AdminAudit        │
├──────────────────────┤         ├──────────────────────┤
│ PK id: UUID          │         │ PK id: UUID          │
│ FK user_id: UUID     │         │ FK admin_id: UUID    │
│    type: NotifType   │         │    action: String    │
│    title: String     │         │    target_type       │
│    message: String   │         │    target_id         │
│    data: JSON?       │         │    metadata: JSON?   │
│    is_read: Boolean  │         │    created_at        │
│    created_at        │         └──────────────────────┘
└──────────────────────┘
```

### 3.2 Database Schema Details

#### 3.2.1 Enumerations

```prisma
enum UserRole {
  STUDENT    // Can post requests, accept applications
  TUTOR      // Can browse requests, submit applications
  ADMIN      // Can manage users, verify tutors, view analytics
}

enum RequestStatus {
  OPEN        // Accepting applications from tutors
  IN_PROGRESS // Tutor assigned, sessions ongoing
  ASSIGNED    // Reserved for specific tutor
  CLOSED      // Completed or fulfilled
  CANCELLED   // Cancelled by student
}

enum ApplicationStatus {
  PENDING     // Submitted, awaiting student decision
  ACCEPTED    // Selected by student
  REJECTED    // Declined by student
  WITHDRAWN   // Withdrawn by tutor
}

enum BookingStatus {
  PENDING     // Payment initiated
  SUBMITTED   // Payment submitted for verification
  VERIFIED    // Payment confirmed
  REJECTED    // Payment rejected
}

enum DocumentStatus {
  PENDING     // Awaiting review
  APPROVED    // Document verified
  REJECTED    // Document rejected
}

enum NotificationType {
  NEW_APPLICATION         // New application on your request
  APPLICATION_ACCEPTED   // Your application was accepted
  APPLICATION_REJECTED   // Your application was rejected
  NEW_MESSAGE            // New message received
  SESSION_REMINDER       // Upcoming session reminder
  SYSTEM                 // System announcement
  PAYMENT_SUBMITTED     // Payment submitted
  PAYMENT_VERIFIED      // Payment confirmed
  PAYMENT_REJECTED      // Payment rejected
}

enum OTPPurpose {
  VERIFY_PHONE    // Phone number verification
  LOGIN           // OTP-based login
  RESET_PASSWORD  // Password reset
}
```

#### 3.2.2 Indexes and Performance Optimization

```prisma
// TuitionRequest indexes
@@index([status])           // Filter by status
@@index([studentId])        // Student's requests
@@index([subject])          // Search by subject

// Application indexes
@@index([status])           // Filter by status
@@index([requestId])        // Applications for a request
@@index([tutorId])          // Tutor's applications

// Notification indexes
@@index([user_id, is_read]) // User's unread notifications

// BookingFee indexes
@@index([status])           // Filter by payment status
@@index([student_id])       // Student's payments
@@index([tutor_id])         // Tutor's received payments
```

**Performance Benefits:**
- Faster query execution for filtered results
- Efficient JOIN operations
- Quick lookup for user-specific data

### 3.3 Data Relationships

| Relationship | Type | Description |
|--------------|------|-------------|
| User → StudentProfile | One-to-One | Each student has one profile |
| User → TutorProfile | One-to-One | Each tutor has one profile |
| User → TuitionRequest | One-to-Many | Student can create multiple requests |
| TuitionRequest → Application | One-to-Many | Request can have multiple applications |
| User → Application | One-to-Many | Tutor can submit multiple applications |
| TuitionRequest → Review | One-to-Many | Request can have reviews |
| User → Notification | One-to-Many | User can have multiple notifications |
| User → Document | One-to-Many | User can upload multiple documents |

---

## 4. UML Diagrams

### 4.1 Class Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLASS DIAGRAM                                 │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                         <<Entity>>                                    │
│                            User                                       │
├──────────────────────────────────────────────────────────────────────┤
│ - id: string                                                         │
│ - email: string                                                      │
│ - passwordHash: string                                               │
│ - name: string | null                                                │
│ - phone: string | null                                               │
│ - role: UserRole                                                     │
│ - isVerified: boolean                                                │
│ - isActive: boolean                                                  │
│ - createdAt: Date                                                    │
│ - updatedAt: Date                                                    │
├──────────────────────────────────────────────────────────────────────┤
│ + updateProfile(name: string, phone: string): User                   │
│ + deactivate(): void                                                 │
└──────────────────────────────────────────────────────────────────────┘
                                    △
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
        ┌───────────┴──────┐ ┌─────┴──────┐ ┌─────┴──────┐
        │  StudentProfile  │ │ TutorProfile│ │  TutorPost │
        ├──────────────────┤ ├─────────────┤ ├────────────┤
        │ - grade: string  │ │ - bio       │ │ - title    │
        │ - school: string │ │ - education │ │ - subject  │
        │ - subjects: []   │ │ - subjects  │ │ - hourly   │
        │ - goals: string  │ │ - hourlyRate│ │ - location │
        │ - location       │ │ - rating    │ │ - isActive │
        └──────────────────┘ └─────────────┘ └────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                         <<Entity>>                                    │
│                      TuitionRequest                                   │
├──────────────────────────────────────────────────────────────────────┤
│ - id: string                                                         │
│ - studentId: string                                                   │
│ - title: string                                                      │
│ - description: string                                                │
│ - subject: string                                                    │
│ - budget: Decimal | null                                             │
│ - location: string | null                                            │
│ - status: RequestStatus                                              │
│ - createdAt: Date                                                    │
│ - updatedAt: Date                                                    │
├──────────────────────────────────────────────────────────────────────┤
│ + close(): void                                                      │
│ + updateStatus(status: RequestStatus): void                         │
│ + getApplicationCount(): number                                      │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1..*
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         <<Entity>>                                    │
│                        Application                                    │
├──────────────────────────────────────────────────────────────────────┤
│ - id: string                                                         │
│ - requestId: string                                                   │
│ - tutorId: string                                                    │
│ - message: string | null                                             │
│ - proposedRate: Decimal | null                                       │
│ - status: ApplicationStatus                                          │
│ - createdAt: Date                                                    │
│ - updatedAt: Date                                                    │
├──────────────────────────────────────────────────────────────────────┤
│ + accept(): void                                                     │
│ + reject(): void                                                     │
│ + withdraw(): void                                                   │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                      <<Service>>                                      │
│                      AuthService                                      │
├──────────────────────────────────────────────────────────────────────┤
│ - prisma: PrismaService                                              │
│ - jwtService: JwtService                                             │
├──────────────────────────────────────────────────────────────────────┤
│ + register(email, password, role, name): AuthTokens                  │
│ + login(email, password): AuthTokens                                 │
│ + validateUser(payload: JwtPayload): User                            │
│ + getMe(userId: string): User                                        │
│ + updateProfile(userId, data): User                                  │
│ - hashPassword(password: string): string                             │
│ - signJwt(user: User): string                                        │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                      <<Service>>                                      │
│                  TuitionRequestService                               │
├──────────────────────────────────────────────────────────────────────┤
│ - prisma: PrismaService                                              │
├──────────────────────────────────────────────────────────────────────┤
│ + create(studentId, dto): TuitionRequest                             │
│ + findAll(filters): TuitionRequest[]                                 │
│ + findOpenForTutors(): TuitionRequest[]                              │
│ + findById(id): TuitionRequest                                       │
│ + findByStudentId(studentId): TuitionRequest[]                       │
│ + update(id, userId, role, dto): TuitionRequest                      │
│ + close(id, userId): TuitionRequest                                  │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                      <<Service>>                                      │
│                    ApplicationService                                 │
├──────────────────────────────────────────────────────────────────────┤
│ - prisma: PrismaService                                              │
├──────────────────────────────────────────────────────────────────────┤
│ + create(requestId, tutorId, message): Application                   │
│ + findByRequest(requestId, studentId): Application[]                │
│ + findByTutor(tutorId): Application[]                                │
│ + accept(applicationId, studentId): Application                      │
│ + reject(applicationId, studentId): Application                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 4.2 Sequence Diagrams

#### 4.2.1 User Registration Sequence

```
┌────────┐  ┌──────────┐  ┌─────────────┐  ┌──────────┐  ┌────────┐
│  User  │  │ Frontend │  │ AuthControl │  │AuthServic│  │Database│
└───┬────┘  └────┬─────┘  └──────┬──────┘  └────┬─────┘  └───┬────┘
    │            │               │              │            │
    │ Fill form  │               │              │            │
    ├───────────>│               │              │            │
    │            │               │              │            │
    │ Submit     │               │              │            │
    ├───────────>│               │              │            │
    │            │ POST /register│              │            │
    │            ├──────────────>│              │            │
    │            │               │ Validate     │            │
    │            │               │ (Zod Pipe)   │            │
    │            │               ├──────┐       │            │
    │            │               │      │       │            │
    │            │               │<─────┘       │            │
    │            │               │              │            │
    │            │               │ register()   │            │
    │            │               ├─────────────>│            │
    │            │               │              │ Find user  │
    │            │               │              ├───────────>│
    │            │               │              │    null     │
    │            │               │              │<───────────┤
    │            │               │              │            │
    │            │               │              │ Hash pwd   │
    │            │               │              ├──────┐     │
    │            │               │              │      │     │
    │            │               │              │<─────┘     │
    │            │               │              │            │
    │            │               │              │ Create user│
    │            │               │              ├───────────>│
    │            │               │              │    User    │
    │            │               │              │<───────────┤
    │            │               │              │            │
    │            │               │              │ Sign JWT   │
    │            │               │              ├──────┐     │
    │            │               │              │      │     │
    │            │               │              │<─────┘     │
    │            │               │              │            │
    │            │               │ AuthTokens   │            │
    │            │               │<─────────────┤            │
    │            │ 201 Created   │              │            │
    │            │<──────────────┤              │            │
    │ Success    │               │              │            │
    │<───────────┤               │              │            │
    │            │               │              │            │
```

#### 4.2.2 Application Submission Sequence

```
┌────────┐  ┌──────────┐  ┌─────────────┐  ┌──────────┐  ┌────────┐
│  Tutor │  │ Frontend │  │ AppControl  │  │AppService│  │Database│
└───┬────┘  └────┬─────┘  └──────┬──────┘  └────┬─────┘  └───┬────┘
    │            │               │              │            │
    │ View       │               │              │            │
    │ Request    │               │              │            │
    ├───────────>│               │              │            │
    │            │ GET /requests │              │            │
    │            ├──────────────>│              │            │
    │            │               │ findAll()    │            │
    │            │               ├─────────────>│            │
    │            │               │              │ Query      │
    │            │               │              ├───────────>│
    │            │               │              │  Requests  │
    │            │               │              │<───────────┤
    │            │               │ Requests[]   │            │
    │            │               │<─────────────┤            │
    │            │ 200 OK        │              │            │
    │            │<──────────────┤              │            │
    │ List       │               │              │            │
    │<───────────┤               │              │            │
    │            │               │              │            │
    │ Click Apply│               │              │            │
    ├───────────>│               │              │            │
    │            │ POST /apply   │              │            │
    │            ├──────────────>│              │            │
    │            │               │ Validate     │            │
    │            │               │ Check Auth   │            │
    │            │               ├──────┐       │            │
    │            │               │      │       │            │
    │            │               │<─────┘       │            │
    │            │               │              │            │
    │            │               │ create()     │            │
    │            │               ├─────────────>│            │
    │            │               │              │ Find req   │
    │            │               │              ├───────────>│
    │            │               │              │  Request   │
    │            │               │              │<───────────┤
    │            │               │              │            │
    │            │               │              │ Check dup  │
    │            │               │              ├───────────>│
    │            │               │              │    null    │
    │            │               │              │<───────────┤
    │            │               │              │            │
    │            │               │              │ Create app │
    │            │               │              ├───────────>│
    │            │               │              │ Application│
    │            │               │              │<───────────┤
    │            │               │ Application  │            │
    │            │               │<─────────────┤            │
    │            │ 201 Created   │              │            │
    │            │<──────────────┤              │            │
    │ Success    │               │              │            │
    │<───────────┤               │              │            │
    │            │               │              │            │
```

#### 4.2.3 Application Acceptance Sequence

```
┌────────┐  ┌──────────┐  ┌─────────────┐  ┌──────────┐  ┌────────┐
│Student │  │ Frontend │  │ AppControl  │  │AppService│  │Database│
└───┬────┘  └────┬─────┘  └──────┬──────┘  └────┬─────┘  └───┬────┘
    │            │               │              │            │
    │ View Apps  │               │              │            │
    ├───────────>│               │              │            │
    │            │ GET /apps     │              │            │
    │            ├──────────────>│              │            │
    │            │               │ findByReq()  │            │
    │            │               ├─────────────>│            │
    │            │               │              │ Query apps │
    │            │               │              ├───────────>│
    │            │               │              │    Apps    │
    │            │               │              │<───────────┤
    │            │               │ Apps[]       │            │
    │            │               │<─────────────┤            │
    │            │ 200 OK        │              │            │
    │            │<──────────────┤              │            │
    │ List       │               │              │            │
    │<───────────┤               │              │            │
    │            │               │              │            │
    │ Click Accept│              │              │            │
    ├───────────>│               │              │            │
    │            │ PUT /accept   │              │            │
    │            ├──────────────>│              │            │
    │            │               │ Validate     │            │
    │            │               │ Check Owner  │            │
    │            │               ├──────┐       │            │
    │            │               │      │       │            │
    │            │               │<─────┘       │            │
    │            │               │              │            │
    │            │               │ accept()     │            │
    │            │               ├─────────────>│            │
    │            │               │              │ Transaction│
    │            │               │              ├──────┐     │
    │            │               │              │      │     │
    │            │               │              │      ├─────┤
    │            │               │              │      │     │
    │            │               │              │      │ 1. Update App
    │            │               │              │      │    ACCEPTED
    │            │               │              │      │     │
    │            │               │              │      │ 2. Reject others
    │            │               │              │      │     │
    │            │               │              │      │ 3. Update Req
    │            │               │              │      │    IN_PROGRESS
    │            │               │              │      │     │
    │            │               │              │<─────┘     │
    │            │               │ Application  │            │
    │            │               │<─────────────┤            │
    │            │ 200 OK        │              │            │
    │            │<──────────────┤              │            │
    │ Success    │               │              │            │
    │<───────────┤               │              │            │
    │            │               │              │            │
```

### 4.3 State Chart Diagrams

#### 4.3.1 Tuition Request State Machine

```
                    ┌──────────────────┐
                    │      OPEN        │
                    │  (Accepting      │
                    │   Applications)  │
                    └────────┬─────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
         ┌──────────────────┐  ┌──────────────────┐
         │   IN_PROGRESS    │  │    CANCELLED     │
         │  (Tutor Assigned)│  │  (Cancelled by   │
         │   Sessions Ongoing│  │   Student)      │
         └────────┬─────────┘  └──────────────────┘
                  │
                  │ Sessions Complete
                  ▼
         ┌──────────────────┐
         │     CLOSED       │
         │  (Completed or   │
         │   Fulfilled)     │
         └──────────────────┘

Transitions:
- OPEN → IN_PROGRESS: Application accepted
- OPEN → CANCELLED: Student cancels
- IN_PROGRESS → CLOSED: Sessions completed
- IN_PROGRESS → CANCELLED: Student cancels (with tutor notification)
```

#### 4.3.2 Application State Machine

```
                    ┌──────────────────┐
                    │     PENDING      │
                    │  (Awaiting       │
                    │   Decision)      │
                    └────────┬─────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
   ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
   │   ACCEPTED     │ │   REJECTED     │ │   WITHDRAWN    │
   │  (Selected by  │ │  (Declined by  │ │  (Withdrawn by │
   │   Student)     │ │   Student)     │ │   Tutor)       │
   └────────────────┘ └────────────────┘ └────────────────┘

Transitions:
- PENDING → ACCEPTED: Student accepts application
- PENDING → REJECTED: Student rejects OR another application accepted
- PENDING → WITHDRAWN: Tutor withdraws application

Final States: ACCEPTED, REJECTED, WITHDRAWN
```

#### 4.3.3 User Account State Machine

```
                    ┌──────────────────┐
                    │   REGISTERED     │
                    │  (Account        │
                    │   Created)       │
                    └────────┬─────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
         ┌──────────────────┐  ┌──────────────────┐
         │    ACTIVE        │  │    SUSPENDED     │
         │  (Verified,      │  │  (Account        │
         │   Operational)   │  │   Disabled)      │
         └────────┬─────────┘  └────────┬─────────┘
                  │                     │
                  │                     │
                  └──────────┬──────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    DEACTIVATED   │
                    │  (Account        │
                    │   Closed)        │
                    └──────────────────┘

Transitions:
- REGISTERED → ACTIVE: Email verified or auto-activated
- REGISTERED → SUSPENDED: Admin suspends account
- ACTIVE → SUSPENDED: Admin suspends account
- SUSPENDED → ACTIVE: Admin reactivates account
- ACTIVE → DEACTIVATED: User or admin deactivates
- SUSPENDED → DEACTIVATED: Admin permanently closes account
```

---

## 5. API Design

### 5.1 RESTful API Endpoints

#### 5.1.1 Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/auth/register` | Register new user | `{email, password, role, name?}` | `{accessToken, user}` |
| POST | `/auth/login` | Login user | `{email, password}` | `{accessToken, user}` |
| GET | `/auth/me` | Get current user | - | `{id, email, name, role}` |
| PUT | `/auth/profile` | Update profile | `{name?, phone?}` | `{id, email, name, role, phone}` |
| GET | `/auth/tutor-profile` | Get tutor profile | - | TutorProfile |
| PUT | `/auth/tutor-profile` | Update tutor profile | `{bio?, subjects?, hourly_rate?}` | TutorProfile |
| GET | `/auth/student-profile` | Get student profile | - | StudentProfile |
| PUT | `/auth/student-profile` | Update student profile | `{grade?, school?, subjects?}` | StudentProfile |

#### 5.1.2 Tuition Request Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/tuition-requests` | Create request | `{title, description, subject, budget?, location?}` | TuitionRequest |
| GET | `/tuition-requests` | List all requests | Query: `?status=&subject=` | TuitionRequest[] |
| GET | `/tuition-requests/open` | List open requests | - | TuitionRequest[] |
| GET | `/tuition-requests/mine` | List user's requests | - | TuitionRequest[] |
| GET | `/tuition-requests/:id` | Get request details | - | TuitionRequest |
| PUT | `/tuition-requests/:id` | Update request | `{title?, description?, status?}` | TuitionRequest |
| DELETE | `/tuition-requests/:id` | Close request | - | TuitionRequest |

#### 5.1.3 Application Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/applications` | Submit application | `{requestId, message, proposed_rate?}` | Application |
| GET | `/applications/request/:id` | Get request applications | - | Application[] |
| GET | `/applications/tutor` | Get tutor's applications | - | Application[] |
| PUT | `/applications/:id/accept` | Accept application | - | Application |
| PUT | `/applications/:id/reject` | Reject application | - | Application |
| PUT | `/applications/:id/withdraw` | Withdraw application | - | Application |

### 5.2 Request/Response Formats

#### 5.2.1 Standard Response Format

**Success Response:**
```json
{
  "id": "clh1234567890",
  "title": "Math Tutoring for Grade 10",
  "description": "Need help with algebra and geometry",
  "subject": "Mathematics",
  "budget": 500.00,
  "status": "OPEN",
  "createdAt": "2026-03-01T10:00:00Z",
  "updatedAt": "2026-03-01T10:00:00Z"
}
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

#### 5.2.2 Authentication Headers

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### 5.3 API Security

#### 5.3.1 Authentication Flow

```
1. Client sends credentials to /auth/login
2. Server validates credentials
3. Server generates JWT token
4. Server returns token to client
5. Client stores token (localStorage)
6. Client includes token in Authorization header for subsequent requests
7. Server validates token using JwtAuthGuard
8. Server extracts user info from token payload
9. Server processes request
```

#### 5.3.2 Authorization Guards

```typescript
// JwtAuthGuard - Validates JWT token
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}

// RolesGuard - Checks user role
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler()
    );
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return requiredRoles.some(role => user.role === role);
  }
}
```

---

## 6. User Interface Design

### 6.1 Design System

#### 6.1.1 Color Palette

```
Primary Colors:
- Cyan 400:    #22D3EE (Primary accent)
- Cyan 500:    #06B6D4 (Buttons, links)
- Cyan 600:    #0891B2 (Hover states)

Background Colors:
- Dark 900:    #0F172A (Main background)
- Dark 800:    #1E293B (Card background)
- Dark 700:    #334155 (Elevated surfaces)

Text Colors:
- White:       #FFFFFF (Primary text)
- Gray 300:    #D1D5DB (Secondary text)
- Gray 400:    #9CA3AF (Muted text)

Status Colors:
- Green 500:   #22C55E (Success, Accepted)
- Red 500:     #EF4444 (Error, Rejected)
- Yellow 500:  #EAB308 (Warning, Pending)
- Blue 500:    #3B82F6 (Info, In Progress)
```

#### 6.1.2 Typography

```
Font Family: Inter (Google Fonts)

Headings:
- H1: 2.25rem (36px) - Bold
- H2: 1.875rem (30px) - Semibold
- H3: 1.5rem (24px) - Semibold
- H4: 1.25rem (20px) - Medium

Body Text:
- Large: 1.125rem (18px)
- Base: 1rem (16px)
- Small: 0.875rem (14px)
- XSmall: 0.75rem (12px)
```

#### 6.1.3 Component Library

**shadcn/ui Components Used:**
- Button (Primary, Secondary, Outline, Ghost, Gradient)
- Card (Card, CardHeader, CardTitle, CardContent)
- Input (Text, Email, Password, Number)
- Label (Form labels)
- Dialog (Modal dialogs)
- Dropdown Menu (User menu, actions)
- Toast (Notifications)
- Select (Dropdowns)
- Textarea (Multi-line input)

### 6.2 Page Layouts

#### 6.2.1 Landing Page

```
┌────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Logo    Home  Features  About  Login  Sign Up           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │              TuitionMedia                                │  │
│  │        Connecting Students with Tutors                   │  │
│  │                                                          │  │
│  │        [Get Started]  [Browse Tutors]                    │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ Feature 1│  │ Feature 2│  │ Feature 3│                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Footer: About | Contact | Privacy | Terms               │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

#### 6.2.2 Login Page

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  ┌────────────────────────────────────────┐                   │
│  │         Logo                           │                   │
│  │         TuitionMedia                   │                   │
│  └────────────────────────────────────────┘                   │
│                                                                │
│  ┌────────────────────────────────────────┐                   │
│  │  Card                                  │                   │
│  │  ┌────────────────────────────────────┐│                   │
│  │  │  Sign In                           ││                   │
│  │  │  Enter your credentials            ││                   │
│  │  │                                    ││                   │
│  │  │  Email                             ││                   │
│  │  │  ┌──────────────────────────────┐ ││                   │
│  │  │  │ you@example.com              │ ││                   │
│  │  │  └──────────────────────────────┘ ││                   │
│  │  │                                    ││                   │
│  │  │  Password                          ││                   │
│  │  │  ┌──────────────────────────────┐ ││                   │
│  │  │  │ ••••••••                     │ ││                   │
│  │  │  └──────────────────────────────┘ ││                   │
│  │  │                                    ││                   │
│  │  │  ┌──────────────────────────────┐ ││                   │
│  │  │  │        Sign In               │ ││                   │
│  │  │  └──────────────────────────────┘ ││                   │
│  │  │                                    ││                   │
│  │  │  Don't have an account? Sign Up    ││                   │
│  │  └────────────────────────────────────┘│                   │
│  └────────────────────────────────────────┘                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### 6.2.3 Student Dashboard

```
┌────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Logo    Dashboard  My Requests  Profile   [Logout]      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Welcome, [Student Name]                                 │  │
│  │  Role: Student                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Total        │  │ Active       │  │ Applications │        │
│  │ Requests: 5  │  │ Requests: 2  │  │ Received: 12 │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  My Tuition Requests                      [+ New Request]│  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Math Tutoring for Grade 10    OPEN    3 apps      │  │  │
│  │  │ Posted: Mar 1, 2026                                │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Physics Help for HSC          IN_PROGRESS          │  │  │
│  │  │ Posted: Feb 15, 2026                               │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

#### 6.2.4 Tutor Dashboard

```
┌────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Logo    Dashboard  Browse Jobs  My Apps  Profile  Logout│  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Welcome, [Tutor Name]                                   │  │
│  │  Role: Tutor                                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Applications │  │ Accepted     │  │ Success Rate │        │
│  │ Submitted: 8 │  │ Applications:│  │ 75%          │        │
│  │              │  │ 2            │  │              │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Open Tuition Requests                                   │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Chemistry Tutoring Needed    Budget: ৳600/hr       │  │  │
│  │  │ Location: Dhanmondi        2 applications          │  │  │
│  │  │ [View Details]  [Apply]                            │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### 6.3 Responsive Breakpoints

```css
/* Mobile First Approach */
/* Base: 0-639px (Mobile) */

/* Tablet */
@media (min-width: 640px) { /* sm */ }

/* Small Desktop */
@media (min-width: 768px) { /* md */ }

/* Desktop */
@media (min-width: 1024px) { /* lg */ }

/* Large Desktop */
@media (min-width: 1280px) { /* xl */ }

/* Extra Large Desktop */
@media (min-width: 1536px) { /* 2xl */ }
```

### 6.4 UI Mockups

#### 6.4.1 Create Request Form

```
┌────────────────────────────────────────────────────────────────┐
│  Post a Tuition Request                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  Title *                                                 │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Math Tutoring for SSC Examination                  │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  Subject *                                               │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Mathematics                                   ▼     │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  Description *                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ I need help with SSC math syllabus, especially    │  │  │
│  │  │ algebra and geometry. Looking for an experienced  │  │  │
│  │  │ tutor who can help me prepare for the upcoming    │  │  │
│  │  │ exam in 3 months...                               │  │  │
│  │  │                                                    │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  Budget (per hour)                                       │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ ৳ 500                                              │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  Location                                                │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Mirpur, Dhaka                                     │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │           Post Request                             │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## 7. Security Design

### 7.1 Authentication Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────┐         ┌──────────┐         ┌──────────┐
│  Client  │         │  Server  │         │ Database │
└────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                    │
     │ Login Request      │                    │
     │ (email, password)  │                    │
     ├───────────────────>│                    │
     │                    │ Find User          │
     │                    ├───────────────────>│
     │                    │    User + Hash     │
     │                    │<───────────────────┤
     │                    │                    │
     │                    │ bcrypt.compare()   │
     │                    ├──────┐             │
     │                    │      │ Valid       │
     │                    │<─────┘             │
     │                    │                    │
     │                    │ Sign JWT           │
     │                    ├──────┐             │
     │                    │      │             │
     │                    │<─────┘             │
     │                    │                    │
     │ JWT Token          │                    │
     │<───────────────────┤                    │
     │                    │                    │
     │ Store in           │                    │
     │ localStorage       │                    │
     ├──────┐             │                    │
     │      │             │                    │
     │<─────┘             │                    │
     │                    │                    │
```

### 7.2 JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-uuid-here",
    "email": "user@example.com",
    "role": "STUDENT",
    "iat": 1709251200,
    "exp": 1709337600
  },
  "signature": "HMACSHA256 signature"
}
```

### 7.3 Security Measures

| Layer | Security Measure | Implementation |
|-------|------------------|----------------|
| **Transport** | HTTPS | SSL/TLS encryption |
| **Authentication** | JWT Tokens | Stateless, signed tokens |
| **Password** | bcrypt Hashing | 12 salt rounds |
| **Authorization** | Role-Based Guards | NestJS Guards |
| **Input** | Zod Validation | Client & Server validation |
| **Database** | Parameterized Queries | Prisma ORM |
| **CORS** | Origin Whitelist | Configured in NestJS |

---

## 8. Deployment Architecture

### 8.1 Development Environment

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT SETUP                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    Developer Machine                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  VS Code + Extensions                                  │  │
│  │  - ESLint, Prettier                                    │  │
│  │  - TypeScript                                          │  │
│  │  - Tailwind CSS IntelliSense                           │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Node.js v20+                                          │  │
│  │  pnpm v9.14.2                                          │  │
│  │  Turborepo                                             │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Local Services                                        │  │
│  │  - Frontend: http://localhost:3000                     │  │
│  │  - Backend: http://localhost:3001                      │  │
│  │  - Database: Supabase (Remote)                         │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 8.2 Production Environment

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                        Users                                 │
│  (Browsers: Chrome, Firefox, Safari, Edge)                  │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    Vercel (Frontend)                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Next.js 15 Application                                │  │
│  │  - Server Components                                   │  │
│  │  - Static Generation                                   │  │
│  │  - Edge Functions                                      │  │
│  │  - CDN Distribution                                    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Domain: tuitionmedia.vercel.app                            │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │ HTTPS/REST API
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                Railway/Render (Backend)                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  NestJS Application                                    │  │
│  │  - Node.js Runtime                                     │  │
│  │  - Environment Variables                               │  │
│  │  - Auto-scaling                                        │  │
│  │  - Health Checks                                       │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Domain: api.tuitionmedia.railway.app                       │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │ Prisma ORM
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    Supabase (Database)                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL 16                                         │  │
│  │  - Managed Database                                    │  │
│  │  - Connection Pooling                                  │  │
│  │  - Automated Backups                                   │  │
│  │  - Point-in-Time Recovery                              │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Connection String: pooler.supabase.com                     │
└──────────────────────────────────────────────────────────────┘
```

### 8.3 CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    CI/CD WORKFLOW                                │
└─────────────────────────────────────────────────────────────────┘

┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Commit  │───>│   Build  │───>│   Test   │───>│  Deploy  │
│  to Main │    │          │    │          │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │
     │               │               │               │
     ▼               ▼               ▼               ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ GitHub   │  │ Turborepo│  │ Jest     │  │ Vercel   │
│ Webhook  │  │ Build    │  │ Tests    │  │ Railway  │
│          │  │ Lint     │  │ Coverage │  │ Auto     │
│          │  │ Type     │  │          │  │ Deploy   │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

---

## 9. Approval and Sign-Off

### 9.1 Developer Sign-Off

I confirm that this System Design Document accurately represents the technical design for implementation.

**Name:** [Your Name]  
**Signature:** ______________________  
**Date:** ______________________

### 9.2 Supervisor Approval

I have reviewed this System Design Document and approve it for implementation.

**Name:** [Supervisor Name]  
**Signature:** ______________________  
**Date:** ______________________

---

**Document Status:** Final  
**Next Review Date:** During implementation phase
