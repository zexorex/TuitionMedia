# TuitionMedia - Project Defense Brief

**Student Name:** [Your Name]  
**Student ID:** [Your ID]  
**Department:** Computer Science & Engineering  
**Academic Year:** 2025-2026  
**Defense Date:** [Defense Date]

---

## Executive Summary

TuitionMedia is a modern, full-stack web application designed to revolutionize the traditional tuition marketplace by digitizing the process of connecting students seeking academic assistance with qualified tutors. This platform addresses the inefficiencies of manual tuition-finding processes, providing a streamlined, secure, and user-friendly solution for educational matchmaking.

---

## 1. Problem Statement & Motivation

### 1.1 Current Challenges

**Manual Process Inefficiencies:**
- **Lack of Centralization:** Students and tutors rely on fragmented channels (word-of-mouth, paper advertisements, social media groups)
- **No Verification System:** No standardized way to verify tutor credentials or student legitimacy
- **Inefficient Matching:** Time-consuming process of finding compatible tutor-student pairs based on subject, location, and budget
- **Limited Transparency:** No clear pricing structure or rating system
- **Poor Communication:** No structured communication channel between parties
- **No Tracking:** Absence of application status tracking or history

### 1.2 Target Users

1. **Students (Primary):** Individuals seeking academic assistance for various subjects and levels
2. **Tutors (Primary):** Qualified educators looking to offer their teaching services
3. **Administrators (Secondary):** Platform moderators ensuring quality and compliance

### 1.3 Solution Overview

TuitionMedia provides a centralized digital platform that:
- Enables students to post detailed tuition requirements
- Allows tutors to browse and apply to relevant opportunities
- Facilitates structured application management
- Provides role-based access control and authentication
- Tracks all interactions and status changes

---

## 2. Technology Stack Selection & Justification

### 2.1 Frontend Technologies

#### Next.js 15 (App Router)
**Choice Rationale:**
- **Server-Side Rendering (SSR):** Improves SEO and initial load performance
- **App Router:** Modern file-based routing system with layouts and loading states
- **API Routes:** Can create backend API endpoints if needed
- **Turbopack:** Faster development builds and hot reload

**Alternatives Considered:**
- **Create React App (CRA):** Lacks SSR, poor SEO, outdated
- **Vite + React:** Good but lacks built-in routing and SSR capabilities
- **Remix:** Similar to Next.js but smaller ecosystem and community

#### Tailwind CSS + shadcn/ui
**Choice Rationale:**
- **Utility-First CSS:** Rapid UI development with consistent design system
- **shadcn/ui:** Accessible, customizable component library built on Radix UI
- **Dark Theme Support:** Built-in dark mode capabilities
- **Performance:** Smaller CSS bundle through purging unused styles

**Alternatives Considered:**
- **Styled Components:** Runtime overhead, larger bundle size
- **Material-UI:** Heavier, less customizable, opinionated design
- **Chakra UI:** Good but smaller community and ecosystem

#### Zustand (State Management)
**Choice Rationale:**
- **Lightweight:** Minimal boilerplate compared to Redux
- **Simple API:** Easy to learn and implement
- **TypeScript Support:** Excellent type inference
- **Persist Middleware:** Built-in localStorage persistence

**Alternatives Considered:**
- **Redux Toolkit:** Overkill for this project's state needs
- **Context API:** Performance issues with frequent updates
- **Jotai/Recoil:** Less mature, smaller community

#### React Hook Form + Zod
**Choice Rationale:**
- **Performance:** Minimizes re-renders with uncontrolled components
- **Validation:** Zod provides runtime type safety and schema validation
- **Integration:** Seamless integration with form libraries

**Alternatives Considered:**
- **Formik:** Slower performance, more re-renders
- **Yup:** Less TypeScript integration than Zod

### 2.2 Backend Technologies

#### NestJS
**Choice Rationale:**
- **Modular Architecture:** Enforces clean code organization with modules
- **TypeScript Native:** Built with TypeScript from the ground up
- **Dependency Injection:** Enterprise-grade patterns and testability
- **Decorators:** Clean, declarative code for controllers and services
- **Built-in Features:** Guards, interceptors, pipes, filters

**Alternatives Considered:**
- **Express.js:** Minimalist, requires manual setup of best practices
- **Fastify:** Faster but smaller ecosystem, less structured
- **Django (Python):** Different language, would require separate team skills

#### Prisma ORM
**Choice Rationale:**
- **Type Safety:** Auto-generated types from schema
- **Database Agnostic:** Can switch databases without code changes
- **Migration System:** Version-controlled database migrations
- **Query Builder:** Intuitive, type-safe database queries
- **Prisma Studio:** GUI for database inspection

**Alternatives Considered:**
- **TypeORM:** More verbose, decorator-heavy, less intuitive
- **Sequelize:** Poor TypeScript support, older architecture
- **Raw SQL:** No type safety, harder to maintain

#### PostgreSQL (via Supabase)
**Choice Rationale:**
- **Relational Integrity:** ACID compliance for critical data
- **JSON Support:** Can store flexible data (schedules, metadata)
- **Scalability:** Proven performance at scale
- **Supabase:** Managed PostgreSQL with built-in auth, storage, and APIs

**Alternatives Considered:**
- **MongoDB:** NoSQL lacks relational integrity, not ideal for this domain
- **MySQL:** Less advanced features than PostgreSQL
- **Firebase:** Proprietary, vendor lock-in, less flexible queries

#### Passport.js + JWT
**Choice Rationale:**
- **Industry Standard:** Widely adopted authentication middleware
- **JWT Strategy:** Stateless authentication, scalable
- **NestJS Integration:** Official @nestjs/passport package

**Alternatives Considered:**
- **Session-based Auth:** Requires server-side sessions, less scalable
- **OAuth Only:** Would require third-party providers, more complex

### 2.3 Development Tools

#### Turborepo (Monorepo Management)
**Choice Rationale:**
- **Build Optimization:** Intelligent caching and parallelization
- **Code Sharing:** Shared packages between frontend and backend
- **Developer Experience:** Single command to run all apps

**Alternatives Considered:**
- **Nx:** More complex, enterprise-focused
- **Lerna:** Slower, less caching optimization
- **Separate Repos:** Harder to coordinate changes, no code sharing

#### pnpm (Package Manager)
**Choice Rationale:**
- **Disk Efficiency:** Content-addressable storage, saves disk space
- **Strict Dependencies:** Prevents phantom dependencies
- **Faster Installs:** Hard links instead of copying files

**Alternatives Considered:**
- **npm:** Slower, less efficient disk usage
- **yarn:** Similar to npm, berry version has compatibility issues

#### TypeScript
**Choice Rationale:**
- **Type Safety:** Catches errors at compile time
- **IDE Support:** Better autocomplete, refactoring, and navigation
- **Industry Standard:** Most modern JS projects use TypeScript

**Alternatives Considered:**
- **JavaScript:** No type safety, harder to maintain at scale

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Next.js 15 App Router (Frontend)                         │   │
│  │  - Server Components (SSR)                                │   │
│  │  - Client Components (Interactive)                       │   │
│  │  - Tailwind CSS + shadcn/ui                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  NestJS Backend (Port 3001)                               │   │
│  │  - REST Controllers                                       │   │
│  │  - JWT Authentication                                     │   │
│  │  - Role-based Guards                                      │   │
│  │  - Validation Pipes                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Prisma ORM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PostgreSQL (Supabase)                                     │   │
│  │  - Users, Profiles, TuitionRequests                       │   │
│  │  - Applications, Reviews, Notifications                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Monorepo Structure

```
tuition-marketplace/
├── apps/
│   ├── frontend/          # Next.js 15 application
│   │   ├── src/
│   │   │   ├── app/       # App Router pages
│   │   │   ├── components/# Reusable UI components
│   │   │   ├── lib/       # API client, utilities
│   │   │   ├── store/     # Zustand state management
│   │   │   └── hooks/     # Custom React hooks
│   │   └── package.json
│   │
│   └── backend/           # NestJS application
│       ├── src/
│       │   ├── auth/      # Authentication module
│       │   ├── prisma/    # Database service
│       │   ├── tuition-request/  # Request management
│       │   ├── application/      # Application management
│       │   └── main.ts    # Entry point
│       ├── prisma/
│       │   └── schema.prisma  # Database schema
│       └── package.json
│
├── packages/
│   └── shared-schema/     # Shared Zod schemas & types
│       ├── src/
│       │   └── index.ts   # Validation schemas
│       └── package.json
│
├── turbo.json             # Turborepo configuration
├── pnpm-workspace.yaml    # Workspace definition
└── package.json           # Root package.json
```

### 3.3 Data Flow

#### User Registration Flow
```
User → Frontend Form → API Client → POST /auth/register
→ ZodValidationPipe → AuthService.register()
→ Prisma User.create() → JWT Sign → Response
→ Frontend Store Token → Redirect to Dashboard
```

#### Tuition Request Creation Flow
```
Student → Create Form → POST /tuition-requests
→ JwtAuthGuard → RolesGuard (STUDENT)
→ TuitionRequestService.create()
→ Prisma TuitionRequest.create()
→ Response with Request Data
```

#### Application Submission Flow
```
Tutor → Browse Requests → Apply Form → POST /applications
→ JwtAuthGuard → RolesGuard (TUTOR)
→ ApplicationService.create()
→ Check Request Status (OPEN)
→ Prisma Application.create()
→ Response
```

---

## 4. Key Features & Implementation

### 4.1 Authentication & Authorization

**Implementation Details:**
- **JWT Strategy:** Stateless authentication with access tokens
- **Password Hashing:** bcrypt with 12 salt rounds
- **Role-Based Access:** STUDENT, TUTOR, ADMIN roles
- **Guards:** JwtAuthGuard for authentication, RolesGuard for authorization

**Code Example - JWT Strategy:**
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    return this.prisma.user.findUnique({ where: { id: payload.sub } });
  }
}
```

### 4.2 Tuition Request Management

**Features:**
- Create, Read, Update, Delete (CRUD) operations
- Status tracking: OPEN → IN_PROGRESS → CLOSED
- Subject and location filtering
- Application count tracking

**Database Schema:**
```prisma
model TuitionRequest {
  id          String   @id @default(cuid())
  studentId   String
  title       String
  description String
  subject     String
  budget      Decimal?
  status      RequestStatus @default(OPEN)
  applications Application[]
  createdAt   DateTime @default(now())
}
```

### 4.3 Application System

**Features:**
- Tutors can apply to open requests
- Students can view and manage applications
- Accept/Reject workflow with automatic status updates
- Prevention of duplicate applications

**Business Logic:**
```typescript
async accept(applicationId: string, studentUserId: string) {
  // Transaction ensures data consistency
  const [updated] = await this.prisma.$transaction([
    // 1. Accept selected application
    this.prisma.application.update({
      where: { id: applicationId },
      data: { status: 'ACCEPTED' },
    }),
    // 2. Reject all other applications
    this.prisma.application.updateMany({
      where: { requestId, id: { not: applicationId } },
      data: { status: 'REJECTED' },
    }),
    // 3. Update request status to IN_PROGRESS
    this.prisma.tuitionRequest.update({
      where: { id: requestId },
      data: { status: 'IN_PROGRESS' },
    }),
  ]);
  return updated;
}
```

### 4.4 Profile Management

**Student Profile:**
- Grade level, school, subjects
- Goals, preferred location, budget

**Tutor Profile:**
- Bio, education, experience
- Subjects, hourly rate, qualifications
- Rating and review system

### 4.5 Shared Validation Schema

**Implementation:**
- Zod schemas for runtime validation
- Shared between frontend (React Hook Form) and backend (NestJS Pipes)
- Ensures type safety and validation consistency

**Example:**
```typescript
// packages/shared-schema/src/index.ts
export const RegisterUserSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["STUDENT", "TUTOR", "ADMIN"]),
  name: z.string().min(1).max(100).optional(),
});
```

---

## 5. Database Design

### 5.1 Entity-Relationship Overview

**Core Entities:**
1. **User:** Central entity with role-based profiles
2. **TuitionRequest:** Student's tutoring needs
3. **Application:** Tutor's application to a request
4. **TutorProfile:** Extended tutor information
5. **StudentProfile:** Extended student information
6. **Review:** Post-completion feedback
7. **Notification:** User notifications

**Key Relationships:**
- User (1) ←→ (1) StudentProfile
- User (1) ←→ (1) TutorProfile
- User (1) ←→ (N) TuitionRequest
- TuitionRequest (1) ←→ (N) Application
- User (1) ←→ (N) Application
- TuitionRequest (1) ←→ (N) Review

### 5.2 Enums & Status Management

```prisma
enum UserRole {
  STUDENT
  TUTOR
  ADMIN
}

enum RequestStatus {
  OPEN        # Accepting applications
  IN_PROGRESS # Tutor assigned, ongoing
  ASSIGNED    # Reserved for specific tutor
  CLOSED      # Completed or cancelled
  CANCELLED   # Cancelled by student
}

enum ApplicationStatus {
  PENDING    # Under review
  ACCEPTED   # Selected by student
  REJECTED   # Declined by student
  WITHDRAWN  # Withdrawn by tutor
}
```

---

## 6. Security Measures

### 6.1 Authentication Security
- **Password Hashing:** bcrypt with 12 salt rounds
- **JWT Tokens:** Signed with secret key, expiration time
- **Token Storage:** localStorage (client-side), can migrate to httpOnly cookies

### 6.2 Authorization Security
- **Role-Based Guards:** Prevent unauthorized access to endpoints
- **Resource Ownership:** Users can only modify their own resources
- **Admin Oversight:** Admins can manage all resources

### 6.3 Input Validation
- **Zod Schemas:** Runtime validation on both frontend and backend
- **Pipes:** NestJS validation pipes for request validation
- **Type Safety:** TypeScript compile-time checks

### 6.4 CORS Configuration
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
  credentials: true,
});
```

---

## 7. Performance Optimizations

### 7.1 Frontend Optimizations
- **Server Components:** Reduce client-side JavaScript
- **Code Splitting:** Automatic with Next.js App Router
- **Image Optimization:** Next.js Image component
- **Lazy Loading:** Dynamic imports for heavy components

### 7.2 Backend Optimizations
- **Database Indexing:** Indexes on frequently queried fields
  ```prisma
  @@index([status])
  @@index([studentId])
  @@index([subject])
  ```
- **Query Optimization:** Prisma select for fetching only needed fields
- **Connection Pooling:** Prisma connection pooling

### 7.3 Build Optimizations
- **Turborepo Caching:** Cache build artifacts across runs
- **Parallel Builds:** Build multiple packages simultaneously
- **Incremental Builds:** Only rebuild changed files

---

## 8. Testing Strategy

### 8.1 Unit Testing
- **Backend:** Jest for NestJS services and controllers
- **Frontend:** Jest + React Testing Library for components
- **Coverage Target:** >80% for critical business logic

### 8.2 Integration Testing
- **API Testing:** Supertest for endpoint testing
- **Database Testing:** Test database with migrations

### 8.3 End-to-End Testing
- **Tool:** Playwright or Cypress
- **Scenarios:** User registration, request creation, application flow

---

## 9. Deployment Strategy

### 9.1 Current Setup
- **Database:** Supabase (managed PostgreSQL)
- **Frontend:** Can deploy to Vercel (Next.js native)
- **Backend:** Can deploy to Railway, Render, or AWS

### 9.2 Environment Configuration
- **Development:** Local with `.env` files
- **Production:** Environment variables in deployment platform
- **Secrets Management:** Never commit secrets, use environment variables

---

## 10. Challenges & Solutions

### 10.1 Challenge: Monorepo Build Configuration
**Problem:** Setting up Turborepo with shared packages and proper build order.
**Solution:** Configured `turbo.json` with task dependencies and proper caching.

### 10.2 Challenge: Type Sharing Between Apps
**Problem:** Avoiding code duplication for types between frontend and backend.
**Solution:** Created `shared-schema` package with Zod schemas, used by both apps.

### 10.3 Challenge: Authentication State Persistence
**Problem:** Maintaining auth state across page refreshes.
**Solution:** Zustand persist middleware with localStorage.

### 10.4 Challenge: Database Migrations
**Problem:** Managing database schema changes across environments.
**Solution:** Prisma migration system with version-controlled migration files.

---

## 11. Future Enhancements

### 11.1 Short-term (Next 3 months)
- Real-time notifications with WebSockets
- Email notifications for application updates
- Advanced search with filters (subject, location, budget range)
- Tutor availability calendar

### 11.2 Medium-term (3-6 months)
- In-app messaging system between students and tutors
- Payment integration (Stripe/Razorpay)
- Video call integration for online sessions
- Admin dashboard for platform management

### 11.3 Long-term (6-12 months)
- Mobile application (React Native)
- AI-powered tutor matching recommendations
- Analytics dashboard for tutors
- Multi-language support

---

## 12. Project Metrics

### 12.1 Code Statistics
- **Total Files:** ~50+ source files
- **Lines of Code:** ~5,000+ (excluding dependencies)
- **Components:** 15+ React components
- **API Endpoints:** 20+ REST endpoints
- **Database Tables:** 12 tables

### 12.2 Development Timeline
- **Planning & Design:** 2 weeks
- **Backend Development:** 4 weeks
- **Frontend Development:** 4 weeks
- **Testing & Refinement:** 2 weeks
- **Total Duration:** 12 weeks

---

## 13. Learning Outcomes

### 13.1 Technical Skills Acquired
- Full-stack TypeScript development
- Modern React patterns (Server Components, Hooks)
- NestJS framework and enterprise patterns
- Database design and Prisma ORM
- Monorepo management with Turborepo
- Authentication and authorization implementation

### 13.2 Soft Skills Developed
- Project planning and time management
- Problem-solving and debugging
- Documentation and communication
- Version control and collaboration

---

## 14. Conclusion

TuitionMedia successfully addresses the inefficiencies of traditional tuition matchmaking by providing a modern, secure, and user-friendly platform. The technology stack was carefully selected to balance performance, developer experience, and maintainability. The monorepo architecture with shared packages ensures type safety and code reuse across the frontend and backend applications.

The project demonstrates proficiency in modern web development technologies, database design, authentication systems, and software architecture. Future enhancements will further improve the platform's capabilities and user experience.

---

## 15. References

1. Next.js Documentation. (2024). https://nextjs.org/docs
2. NestJS Documentation. (2024). https://docs.nestjs.com
3. Prisma Documentation. (2024). https://www.prisma.io/docs
4. Turborepo Documentation. (2024). https://turbo.build/repo/docs
5. PostgreSQL Documentation. (2024). https://www.postgresql.org/docs
6. Tailwind CSS Documentation. (2024). https://tailwindcss.com/docs
7. shadcn/ui Documentation. (2024). https://ui.shadcn.com
8. Zustand Documentation. (2024). https://zustand-demo.pmnd.rs/
9. Zod Documentation. (2024). https://zod.dev

---

**Document Version:** 1.0  
**Last Updated:** March 2026  
**Prepared by:** [Your Name]
