# Software Requirement Specification (SRS)
## TuitionMedia - Digital Tuition Marketplace Platform

**Document Identifier:** TM-SRS-001  
**Version:** 1.0  
**Date:** March 2026  
**Organization:** [University Name] - Department of Computer Science & Engineering  
**Author:** [Your Name]  
**Supervisor:** [Supervisor Name]

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | [Date] | [Your Name] | Initial draft |
| 0.5 | [Date] | [Your Name] | Added functional requirements |
| 1.0 | [Date] | [Your Name] | Final version for approval |

---

## Table of Contents

1. Introduction
2. Overall Description
3. Specific Requirements
4. System Features
5. Non-Functional Requirements
6. Use Case Models
7. Data Flow Diagrams
8. Supplementary Information

---

## 1. Introduction

### 1.1 Purpose

This Software Requirement Specification (SRS) document describes the functional and non-functional requirements for **TuitionMedia**, a web-based platform designed to connect students seeking academic assistance with qualified tutors. This document serves as a contractual agreement between the development team and stakeholders, outlining the complete system requirements.

### 1.2 Document Conventions

- **Shall**: Mandatory requirement
- **Should**: Recommended requirement
- **May**: Optional requirement
- **Will**: Future enhancement
- **FR**: Functional Requirement
- **NFR**: Non-Functional Requirement
- **UC**: Use Case
- **Priority**: High (H), Medium (M), Low (L)

### 1.3 Intended Audience

This document is intended for:
- Project supervisor and faculty members
- Development team (student developer)
- Testing personnel
- Project stakeholders
- Future maintainers and developers

### 1.4 Project Scope

TuitionMedia provides a centralized digital platform for:
- Student registration and profile management
- Tutor registration and credential showcase
- Tuition request posting and management
- Application submission and tracking
- Matching workflow between students and tutors
- Review and rating system
- Administrative oversight and moderation

### 1.5 References

1. IEEE Standard 830-1998: Recommended Practice for Software Requirements Specifications
2. Next.js Documentation (https://nextjs.org/docs)
3. NestJS Documentation (https://docs.nestjs.com)
4. Prisma Documentation (https://www.prisma.io/docs)
5. PostgreSQL Documentation (https://www.postgresql.org/docs)

---

## 2. Overall Description

### 2.1 Product Perspective

TuitionMedia is a **self-contained web application** that operates independently without integration with external systems (in the initial version). The system follows a **three-tier architecture**:

```
┌─────────────────────────────────────────┐
│         PRESENTATION TIER               │
│   Next.js Frontend (Web Browser)        │
└─────────────────────────────────────────┘
                  ↕ HTTP/REST
┌─────────────────────────────────────────┐
│         APPLICATION TIER                │
│   NestJS Backend (Node.js Server)       │
└─────────────────────────────────────────┘
                  ↕ Prisma ORM
┌─────────────────────────────────────────┐
│         DATA TIER                       │
│   PostgreSQL Database (Supabase)        │
└─────────────────────────────────────────┘
```

### 2.2 Product Functions

The system provides the following major functions:

| Function ID | Function Name | Description |
|-------------|----------------|-------------|
| F1 | User Management | Registration, authentication, profile management |
| F2 | Tuition Request Management | Create, browse, update, close requests |
| F3 | Application Management | Submit, review, accept/reject applications |
| F4 | Notification System | In-app notifications for important events |
| F5 | Review System | Post-completion ratings and reviews |
| F6 | Administration | User verification, content moderation, analytics |

### 2.3 User Characteristics

#### 2.3.1 Student Users

| Characteristic | Description |
|----------------|-------------|
| **Demographics** | School/college students, parents seeking tutors |
| **Technical Expertise** | Basic to intermediate computer literacy |
| **Usage Frequency** | 2-5 times per week during active search |
| **Primary Goals** | Find qualified tutors, post requirements, manage applications |
| **Constraints** | Limited time, need quick and easy interface |

#### 2.3.2 Tutor Users

| Characteristic | Description |
|----------------|-------------|
| **Demographics** | University students, professionals, retired teachers |
| **Technical Expertise** | Intermediate to advanced computer literacy |
| **Usage Frequency** | Daily during active job search, weekly otherwise |
| **Primary Goals** | Find students, showcase credentials, manage applications |
| **Constraints** | Need visibility, professional presentation |

#### 2.3.3 Administrator Users

| Characteristic | Description |
|----------------|-------------|
| **Demographics** | Platform staff, moderators |
| **Technical Expertise** | Advanced computer literacy |
| **Usage Frequency** | Daily for moderation and oversight |
| **Primary Goals** | Ensure platform quality, verify users, resolve disputes |
| **Constraints** | Need comprehensive tools, detailed analytics |

### 2.4 Constraints

#### 2.4.1 Technical Constraints

- **C1:** System shall operate on Node.js runtime environment (v20+)
- **C2:** Frontend shall be compatible with modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **C3:** Database shall be PostgreSQL 16.x or compatible
- **C4:** System shall not support Internet Explorer or legacy browsers

#### 2.4.2 Regulatory Constraints

- **C5:** System shall comply with data protection regulations
- **C6:** System shall not store sensitive financial data in initial version
- **C7:** User passwords shall be hashed using industry-standard algorithms

#### 2.4.3 Business Constraints

- **C8:** Initial version shall be deployed using free-tier hosting services
- **C9:** Development timeline shall not exceed 12 weeks
- **C10:** System shall support English language only in initial version

### 2.5 Assumptions and Dependencies

#### 2.5.1 Assumptions

- **A1:** Users have access to internet-connected devices
- **A2:** Users have valid email addresses for registration
- **A3:** Tutors have legitimate educational qualifications
- **A4:** Students provide accurate academic information

#### 2.5.2 Dependencies

- **D1:** Supabase PostgreSQL database availability
- **D2:** Hosting platform uptime (Vercel, Railway)
- **D3:** Third-party npm packages availability and stability
- **D4:** Email delivery infrastructure (future enhancement)

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 User Authentication Module

**FR-AUTH-001: User Registration**
- **Description:** The system shall allow new users to register with email, password, and role selection.
- **Priority:** High
- **Actor:** Guest user
- **Precondition:** User is not already registered
- **Postcondition:** User account created in database

**Acceptance Criteria:**
```
GIVEN: User is on registration page
WHEN: User provides valid email, password (min 8 chars), and selects role (Student/Tutor)
THEN: System creates account, hashes password, stores in database
AND: System returns JWT token and user details
AND: System redirects to appropriate dashboard
```

**FR-AUTH-002: Email Validation**
- **Description:** The system shall validate email format during registration.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: User enters email address
WHEN: Email format is invalid (not matching RFC 5322)
THEN: System displays error message "Invalid email format"
AND: Registration form cannot be submitted
```

**FR-AUTH-003: Password Strength Validation**
- **Description:** The system shall enforce minimum password requirements.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: User enters password
WHEN: Password length < 8 characters
THEN: System displays error "Password must be at least 8 characters"
AND: Registration is prevented
```

**FR-AUTH-004: Duplicate Email Prevention**
- **Description:** The system shall prevent registration with existing email addresses.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: User attempts registration
WHEN: Email already exists in database
THEN: System displays error "Email already registered"
AND: Registration is prevented
```

**FR-AUTH-005: User Login**
- **Description:** The system shall authenticate users with email and password.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: User is on login page
WHEN: User provides correct email and password
THEN: System verifies credentials against database
AND: System generates JWT token
AND: System stores token in client storage
AND: System redirects to role-appropriate dashboard
```

**FR-AUTH-006: Invalid Login Handling**
- **Description:** The system shall handle invalid login attempts securely.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: User attempts login
WHEN: Email or password is incorrect
THEN: System displays generic error "Invalid email or password"
AND: System does not reveal which field is incorrect
AND: No JWT token is issued
```

**FR-AUTH-007: Session Management**
- **Description:** The system shall maintain user session using JWT tokens.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: User is logged in
WHEN: User navigates to protected route
THEN: System validates JWT token from Authorization header
AND: System allows access if token is valid
AND: System rejects access if token is invalid or expired
```

**FR-AUTH-008: User Logout**
- **Description:** The system shall allow users to logout and invalidate session.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: User is logged in
WHEN: User clicks logout button
THEN: System removes JWT token from client storage
AND: System clears user state
AND: System redirects to home page
```

**FR-AUTH-009: Role-Based Access Control**
- **Description:** The system shall restrict access based on user roles.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: User attempts to access role-specific resource
WHEN: User role does not match required role
THEN: System returns 403 Forbidden error
AND: System displays "Access denied" message
```

#### 3.1.2 Profile Management Module

**FR-PROF-001: Student Profile Creation**
- **Description:** The system shall allow students to create extended profiles.
- **Priority:** Medium

**Acceptance Criteria:**
```
GIVEN: Student is registered
WHEN: Student creates/updates profile with grade, school, subjects, goals, location
THEN: System stores profile information in database
AND: Profile is linked to user account
```

**FR-PROF-002: Tutor Profile Creation**
- **Description:** The system shall allow tutors to create professional profiles.
- **Priority:** Medium

**Acceptance Criteria:**
```
GIVEN: Tutor is registered
WHEN: Tutor creates/updates profile with bio, education, experience, subjects, hourly rate, qualifications
THEN: System stores profile information in database
AND: Profile is visible to students browsing tutors
```

**FR-PROF-003: Profile Retrieval**
- **Description:** The system shall allow users to view their own profile.
- **Priority:** Medium

**Acceptance Criteria:**
```
GIVEN: User is authenticated
WHEN: User requests profile data
THEN: System returns user details and role-specific profile
AND: System displays profile in editable form
```

**FR-PROF-004: Profile Update**
- **Description:** The system shall allow users to update their profile information.
- **Priority:** Medium

**Acceptance Criteria:**
```
GIVEN: User is viewing their profile
WHEN: User modifies profile fields and submits
THEN: System validates input
AND: System updates database record
AND: System displays success message
```

**FR-PROF-005: Profile Visibility**
- **Description:** The system shall control profile visibility based on context.
- **Priority:** Medium

**Acceptance Criteria:**
```
GIVEN: Student views tutor profile
WHEN: Profile is accessed through application or search
THEN: System displays public profile information (bio, subjects, rating)
AND: System hides private information (email, phone) until contact unlocked
```

#### 3.1.3 Tuition Request Module

**FR-REQ-001: Create Tuition Request**
- **Description:** The system shall allow students to post tuition requests.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: Student is authenticated
WHEN: Student submits request with title, description, subject, budget, location
THEN: System validates all required fields
AND: System creates request record with status "OPEN"
AND: System links request to student account
AND: System displays request in browse listings
```

**FR-REQ-002: Request Validation**
- **Description:** The system shall validate tuition request input.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: Student creates request
WHEN: Title > 200 chars OR description > 2000 chars OR subject empty
THEN: System displays appropriate validation error
AND: Request creation is prevented
```

**FR-REQ-003: Browse Open Requests**
- **Description:** The system shall display all open tuition requests to tutors.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: Tutor is authenticated
WHEN: Tutor accesses job board
THEN: System retrieves all requests with status "OPEN"
AND: System displays request title, subject, budget, location, application count
AND: System orders by creation date (newest first)
```

**FR-REQ-004: Filter Requests**
- **Description:** The system shall allow tutors to filter requests by criteria.
- **Priority:** Medium

**Acceptance Criteria:**
```
GIVEN: Tutor is browsing requests
WHEN: Tutor applies filter by subject OR location
THEN: System returns only matching requests
AND: System displays filtered results
```

**FR-REQ-005: View Request Details**
- **Description:** The system shall display detailed request information.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: User clicks on request
WHEN: Request exists
THEN: System displays full request details
AND: System displays student name (or anonymous if preferred)
AND: System displays application count
AND: System displays apply button (for tutors)
```

**FR-REQ-006: Edit Request**
- **Description:** The system shall allow students to edit their own requests.
- **Priority:** Medium

**Acceptance Criteria:**
```
GIVEN: Student owns the request
WHEN: Student modifies request fields and submits
THEN: System updates request record
AND: System updates timestamp
AND: System displays success message
```

**FR-REQ-007: Close Request**
- **Description:** The system shall allow students to close their requests.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: Student owns the request AND request status is "OPEN" or "IN_PROGRESS"
WHEN: Student clicks close button
THEN: System updates status to "CLOSED"
AND: System sets closed_at timestamp
AND: System prevents new applications
```

**FR-REQ-008: View Own Requests**
- **Description:** The system shall display student's own requests.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: Student is authenticated
WHEN: Student accesses "My Requests" page
THEN: System retrieves all requests created by student
AND: System displays status, application count for each
AND: System allows navigation to details
```

**FR-REQ-009: Request Status Management**
- **Description:** The system shall automatically update request status.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: Student accepts an application
WHEN: Application status changes to "ACCEPTED"
THEN: System updates request status to "IN_PROGRESS"
AND: System rejects all other pending applications
AND: System notifies affected tutors
```

#### 3.1.4 Application Module

**FR-APP-001: Submit Application**
- **Description:** The system shall allow tutors to apply to open requests.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: Tutor is authenticated AND request status is "OPEN"
WHEN: Tutor submits application with cover letter and proposed rate
THEN: System validates cover letter (required, max 2000 chars)
AND: System creates application record with status "PENDING"
AND: System links application to tutor and request
AND: System notifies student of new application
```

**FR-APP-002: Prevent Duplicate Applications**
- **Description:** The system shall prevent tutors from applying twice to same request.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: Tutor has already applied to request
WHEN: Tutor attempts to apply again
THEN: System displays error "You have already applied to this request"
AND: Application submission is prevented
```

**FR-APP-003: View Applications for Request**
- **Description:** The system shall display applications for student's requests.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: Student owns the request
WHEN: Student views request details
THEN: System displays all applications with tutor name, cover letter, proposed rate, status
AND: System displays accept/reject buttons for pending applications
```

**FR-APP-004: Accept Application**
- **Description:** The system shall allow students to accept applications.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: Student owns the request AND application status is "PENDING"
WHEN: Student clicks accept button
THEN: System updates application status to "ACCEPTED"
AND: System updates request status to "IN_PROGRESS"
AND: System rejects all other pending applications for this request
AND: System notifies accepted tutor
AND: System notifies rejected tutors
```

**FR-APP-005: Reject Application**
- **Description:** The system shall allow students to reject applications.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: Student owns the request AND application status is "PENDING"
WHEN: Student clicks reject button
THEN: System updates application status to "REJECTED"
AND: System notifies tutor of rejection
```

**FR-APP-006: Track Own Applications**
- **Description:** The system shall display tutor's application history.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: Tutor is authenticated
WHEN: Tutor accesses "My Applications" page
THEN: System retrieves all applications submitted by tutor
AND: System displays request title, status, submission date
AND: System allows viewing request details
```

**FR-APP-007: Withdraw Application**
- **Description:** The system shall allow tutors to withdraw pending applications.
- **Priority:** Medium

**Acceptance Criteria:**
```
GIVEN: Tutor owns the application AND status is "PENDING"
WHEN: Tutor clicks withdraw button
THEN: System updates status to "WITHDRAWN"
AND: System removes application from student's view
```

#### 3.1.5 Notification Module

**FR-NOTIF-001: Create Notification**
- **Description:** The system shall create notifications for important events.
- **Priority:** Medium

**Acceptance Criteria:**
```
GIVEN: Trigger event occurs (new application, status change)
WHEN: Event affects a user
THEN: System creates notification record
AND: System sets notification as unread
AND: System links notification to user
```

**FR-NOTIF-002: Display Notifications**
- **Description:** The system shall display user's notifications.
- **Priority:** Medium

**Acceptance Criteria:**
```
GIVEN: User is authenticated
WHEN: User accesses notifications
THEN: System retrieves all notifications for user
AND: System displays title, message, timestamp
AND: System highlights unread notifications
```

**FR-NOTIF-003: Mark Notification as Read**
- **Description:** The system shall allow marking notifications as read.
- **Priority:** Low

**Acceptance Criteria:**
```
GIVEN: User has unread notifications
WHEN: User clicks notification or "mark as read"
THEN: System updates notification is_read to true
AND: System updates notification display
```

**FR-NOTIF-004: Notification Badge**
- **Description:** The system shall display unread notification count.
- **Priority:** Low

**Acceptance Criteria:**
```
GIVEN: User has unread notifications
WHEN: User views navigation bar
THEN: System displays badge with unread count
AND: Badge is visible on notification icon
```

#### 3.1.6 Review Module

**FR-REV-001: Submit Review**
- **Description:** The system shall allow students to review tutors after completion.
- **Priority:** Medium

**Acceptance Criteria:**
```
GIVEN: Request status is "CLOSED" AND student has not reviewed
WHEN: Student submits rating (1-5 stars) and comment
THEN: System creates review record
AND: System links review to tutor, student, and request
AND: System updates tutor's average rating
```

**FR-REV-002: Display Tutor Reviews**
- **Description:** The system shall display reviews on tutor profiles.
- **Priority:** Medium

**Acceptance Criteria:**
```
GIVEN: User views tutor profile
WHEN: Profile has reviews
THEN: System displays average rating
AND: System displays individual reviews with rating, comment, date
```

**FR-REV-003: Prevent Duplicate Reviews**
- **Description:** The system shall prevent multiple reviews for same request.
- **Priority:** High

**Acceptance Criteria:**
```
GIVEN: Student has already reviewed tutor for request
WHEN: Student attempts to review again
THEN: System displays error "You have already reviewed this tutor"
AND: Review submission is prevented
```

#### 3.1.7 Administration Module

**FR-ADMIN-001: View All Users**
- **Description:** The system shall allow admins to view all registered users.
- **Priority:** Medium

**Acceptance Criteria:**
```
GIVEN: Admin is authenticated
WHEN: Admin accesses user management
THEN: System displays all users with email, name, role, status
AND: System allows filtering by role
```

**FR-ADMIN-002: Verify Tutor**
- **Description:** The system shall allow admins to verify tutor credentials.
- **Priority:** Medium

**Acceptance Criteria:**
```
GIVEN: Admin views tutor profile
WHEN: Admin approves credentials
THEN: System sets tutor is_verified to true
AND: System displays verified badge on profile
```

**FR-ADMIN-003: Suspend User**
- **Description:** The system shall allow admins to suspend users.
- **Priority:** Medium

**Acceptance Criteria:**
```
GIVEN: Admin views user
WHEN: Admin suspends user account
THEN: System sets user is_active to false
AND: System prevents user from logging in
AND: System hides user's content from public view
```

**FR-ADMIN-004: View Platform Statistics**
- **Description:** The system shall display platform analytics to admins.
- **Priority:** Low

**Acceptance Criteria:**
```
GIVEN: Admin accesses dashboard
WHEN: Dashboard loads
THEN: System displays total users, requests, applications, success rate
AND: System displays recent activity summary
```

---

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance Requirements

**NFR-PERF-001: Page Load Time**
- **Description:** The system shall load initial page within 2 seconds.
- **Priority:** High
- **Metric:** 95th percentile < 2 seconds on standard broadband connection

**NFR-PERF-002: API Response Time**
- **Description:** API endpoints shall respond within 500ms.
- **Priority:** High
- **Metric:** 95th percentile < 500ms for all API calls

**NFR-PERF-003: Database Query Optimization**
- **Description:** Database queries shall use indexes for frequently accessed data.
- **Priority:** High
- **Metric:** Query execution time < 100ms for indexed queries

**NFR-PERF-004: Concurrent Users**
- **Description:** System shall support at least 100 concurrent users.
- **Priority:** Medium
- **Metric:** No degradation in response time with 100 concurrent sessions

**NFR-PERF-005: Frontend Bundle Size**
- **Description:** Initial JavaScript bundle shall be optimized.
- **Priority:** Medium
- **Metric:** First Load JS < 200KB per route

#### 3.2.2 Security Requirements

**NFR-SEC-001: Password Hashing**
- **Description:** Passwords shall be hashed using bcrypt with minimum 12 salt rounds.
- **Priority:** Critical
- **Verification:** Code review, penetration testing

**NFR-SEC-002: JWT Token Security**
- **Description:** JWT tokens shall be signed with strong secret key and include expiration.
- **Priority:** Critical
- **Metric:** Token expiration ≤ 24 hours, secret key ≥ 256 bits

**NFR-SEC-003: HTTPS Enforcement**
- **Description:** All communications shall use HTTPS in production.
- **Priority:** Critical
- **Verification:** SSL certificate validation, no HTTP endpoints in production

**NFR-SEC-004: Input Validation**
- **Description:** All user inputs shall be validated on both client and server.
- **Priority:** High
- **Verification:** Zod schema validation on frontend and backend

**NFR-SEC-005: SQL Injection Prevention**
- **Description:** System shall prevent SQL injection attacks.
- **Priority:** Critical
- **Verification:** Use Prisma parameterized queries, penetration testing

**NFR-SEC-006: XSS Prevention**
- **Description:** System shall prevent cross-site scripting attacks.
- **Priority:** High
- **Verification:** React's built-in XSS protection, sanitize user content

**NFR-SEC-007: CORS Configuration**
- **Description:** API shall only accept requests from authorized origins.
- **Priority:** High
- **Verification:** CORS whitelist configuration, reject unauthorized origins

**NFR-SEC-008: Rate Limiting**
- **Description:** API shall implement rate limiting to prevent abuse.
- **Priority:** Medium
- **Metric:** Max 100 requests per minute per IP (future enhancement)

#### 3.2.3 Reliability Requirements

**NFR-REL-001: System Uptime**
- **Description:** System shall maintain 99% uptime during operational hours.
- **Priority:** High
- **Metric:** 99% availability measured monthly

**NFR-REL-002: Error Handling**
- **Description:** System shall gracefully handle errors without crashing.
- **Priority:** High
- **Verification:** All exceptions caught and logged, user-friendly error messages

**NFR-REL-003: Data Backup**
- **Description:** Database shall be backed up regularly.
- **Priority:** High
- **Metric:** Daily automated backups via Supabase

**NFR-REL-004: Transaction Integrity**
- **Description:** Critical operations shall use database transactions.
- **Priority:** High
- **Verification:** Application acceptance uses Prisma $transaction

#### 3.2.4 Usability Requirements

**NFR-USA-001: Responsive Design**
- **Description:** System shall be usable on desktop, tablet, and mobile devices.
- **Priority:** High
- **Metric:** Proper rendering on viewports 320px - 1920px width

**NFR-USA-002: Accessibility**
- **Description:** System shall follow WCAG 2.1 AA guidelines.
- **Priority:** Medium
- **Metric:** Keyboard navigation, screen reader compatibility, color contrast

**NFR-USA-003: Navigation**
- **Description:** Users shall reach any page within 3 clicks.
- **Priority:** Medium
- **Verification:** User testing, navigation flow analysis

**NFR-USA-004: Error Messages**
- **Description:** Error messages shall be clear and actionable.
- **Priority:** Medium
- **Verification:** User testing, no technical jargon in user-facing errors

**NFR-USA-005: Form Feedback**
- **Description:** Forms shall provide real-time validation feedback.
- **Priority:** Medium
- **Verification:** Inline validation messages, visual indicators

#### 3.2.5 Maintainability Requirements

**NFR-MAIN-001: Code Documentation**
- **Description:** Code shall be documented with comments and README files.
- **Priority:** Medium
- **Metric:** All modules have README, complex functions have JSDoc comments

**NFR-MAIN-002: Modular Architecture**
- **Description:** System shall use modular, loosely-coupled architecture.
- **Priority:** High
- **Verification:** NestJS modules, React component separation

**NFR-MAIN-003: Version Control**
- **Description:** All code shall be version controlled with Git.
- **Priority:** High
- **Verification:** GitHub repository with commit history

**NFR-MAIN-004: Coding Standards**
- **Description:** Code shall follow established coding standards.
- **Priority:** Medium
- **Verification:** ESLint configuration, Prettier formatting

**NFR-MAIN-005: Type Safety**
- **Description:** Code shall use TypeScript for type safety.
- **Priority:** High
- **Verification:** Strict TypeScript configuration, no `any` types

#### 3.2.6 Scalability Requirements

**NFR-SCALE-001: Horizontal Scaling**
- **Description:** Architecture shall support horizontal scaling.
- **Priority:** Medium
- **Verification:** Stateless authentication (JWT), no server-side sessions

**NFR-SCALE-002: Database Scaling**
- **Description:** Database shall support connection pooling.
- **Priority:** Medium
- **Verification:** Prisma connection pooling configuration

**NFR-SCALE-003: Caching Strategy**
- **Description:** System shall implement caching for frequently accessed data.
- **Priority:** Low
- **Future:** Redis caching for sessions, frequently viewed profiles

#### 3.2.7 Compatibility Requirements

**NFR-COMP-001: Browser Compatibility**
- **Description:** System shall work on Chrome 90+, Firefox 88+, Safari 14+, Edge 90+.
- **Priority:** High
- **Verification:** Cross-browser testing

**NFR-COMP-002: Mobile Compatibility**
- **Description:** System shall function on mobile browsers (iOS Safari, Android Chrome).
- **Priority:** High
- **Verification:** Mobile device testing

**NFR-COMP-003: Screen Resolution**
- **Description:** System shall adapt to screen resolutions from 1366x768 to 1920x1080.
- **Priority:** Medium
- **Verification:** Responsive design testing

---

## 4. System Features

### 4.1 Feature Priority Matrix

| Feature | Priority | MoSCoW | Sprint |
|---------|----------|--------|--------|
| User Registration | High | Must | 1-2 |
| User Login | High | Must | 1-2 |
| Profile Management | Medium | Should | 3-4 |
| Create Tuition Request | High | Must | 5-6 |
| Browse Requests | High | Must | 5-6 |
| Submit Application | High | Must | 7-8 |
| Accept/Reject Application | High | Must | 7-8 |
| Notifications | Medium | Should | 9-10 |
| Reviews | Medium | Should | 9-10 |
| Admin Dashboard | Low | Could | 11-12 |

### 4.2 Feature Dependencies

```
User Registration → Profile Creation → Request Creation
                                            ↓
User Login → Authentication → Application Submission
                                    ↓
                            Application Management
                                    ↓
                            Notification System
                                    ↓
                            Review System
```

---

## 5. Use Case Models

### 5.1 Use Case Diagram

```
                    ┌─────────────────────────────────┐
                    │      TuitionMedia System        │
                    │                                 │
┌──────────┐        │  ┌───────────────────────┐    │
│          │───────┼──│ Register              │    │
│  Guest   │       │  └───────────────────────┘    │
│  User    │───────┼──│ Login                 │    │
│          │       │  └───────────────────────┘    │
└──────────┘       │                                 │
                    │                                 │
┌──────────┐       │  ┌───────────────────────┐    │
│          │───────┼──│ Create Profile        │    │
│ Student  │───────┼──│ Post Request          │    │
│          │───────┼──│ View Applications     │    │
│          │───────┼──│ Accept/Reject App     │    │
│          │───────┼──│ Review Tutor          │    │
└──────────┘       │  └───────────────────────┘    │
                    │                                 │
┌──────────┐       │  ┌───────────────────────┐    │
│          │───────┼──│ Create Profile        │    │
│  Tutor   │───────┼──│ Browse Requests       │    │
│          │───────┼──│ Apply to Request      │    │
│          │───────┼──│ Track Applications    │    │
│          │───────┼──│ Withdraw Application  │    │
└──────────┘       │  └───────────────────────┘    │
                    │                                 │
┌──────────┐       │  ┌───────────────────────┐    │
│          │───────┼──│ View All Users        │    │
│  Admin   │───────┼──│ Verify Tutors         │    │
│          │───────┼──│ Suspend Users         │    │
│          │───────┼──│ View Statistics       │    │
└──────────┘       │  └───────────────────────┘    │
                    │                                 │
                    └─────────────────────────────────┘
```

### 5.2 Detailed Use Cases

#### UC-001: User Registration

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-001 |
| **Use Case Name** | User Registration |
| **Actor** | Guest User |
| **Description** | A new user creates an account by providing email, password, and selecting a role |
| **Precondition** | User is not registered in the system |
| **Postcondition** | User account is created and user is logged in |
| **Main Flow** | 1. User navigates to registration page<br>2. User enters email address<br>3. User enters password (min 8 chars)<br>4. User selects role (Student/Tutor)<br>5. User optionally enters name<br>6. User clicks "Sign Up" button<br>7. System validates input<br>8. System checks email uniqueness<br>9. System hashes password<br>10. System creates user record<br>11. System generates JWT token<br>12. System redirects to dashboard |
| **Alternative Flow** | 4a. Invalid email format:<br>- System displays error<br>- User corrects email<br><br>8a. Email already exists:<br>- System displays error<br>- User uses different email or logs in |
| **Exception Flow** | System error during registration:<br>- System displays generic error<br>- User retries registration |
| **Frequency** | High (new users) |
| **Priority** | High |

#### UC-002: Post Tuition Request

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-002 |
| **Use Case Name** | Post Tuition Request |
| **Actor** | Student |
| **Description** | Student creates a new tuition request specifying subject, requirements, budget, and location |
| **Precondition** | Student is logged in |
| **Postcondition** | Tuition request is created with status "OPEN" |
| **Main Flow** | 1. Student navigates to "Post Request" page<br>2. Student enters request title<br>3. Student enters detailed description<br>4. Student selects subject category<br>5. Student optionally enters budget<br>6. Student optionally enters location<br>7. Student clicks "Submit" button<br>8. System validates input<br>9. System creates request record<br>10. System displays success message<br>11. System redirects to request details |
| **Alternative Flow** | 8a. Validation fails:<br>- System displays specific error<br>- Student corrects input |
| **Frequency** | Medium |
| **Priority** | High |

#### UC-003: Apply to Tuition Request

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-003 |
| **Use Case Name** | Apply to Tuition Request |
| **Actor** | Tutor |
| **Description** | Tutor submits an application to an open tuition request |
| **Precondition** | Tutor is logged in, request status is "OPEN", tutor has not applied |
| **Postcondition** | Application is created with status "PENDING", student is notified |
| **Main Flow** | 1. Tutor browses open requests<br>2. Tutor clicks on request to view details<br>3. Tutor clicks "Apply" button<br>4. Tutor enters cover letter<br>5. Tutor optionally enters proposed rate<br>6. Tutor clicks "Submit Application"<br>7. System validates input<br>8. System checks for duplicate application<br>9. System creates application record<br>10. System creates notification for student<br>11. System displays success message |
| **Alternative Flow** | 8a. Duplicate application detected:<br>- System displays error<br>- Application is prevented |
| **Frequency** | High |
| **Priority** | High |

#### UC-004: Accept Application

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-004 |
| **Use Case Name** | Accept Application |
| **Actor** | Student |
| **Description** | Student accepts a tutor's application, triggering status updates |
| **Precondition** | Student owns the request, application status is "PENDING" |
| **Postcondition** | Application status is "ACCEPTED", request status is "IN_PROGRESS", other applications are "REJECTED" |
| **Main Flow** | 1. Student views applications for their request<br>2. Student reviews tutor profile and cover letter<br>3. Student clicks "Accept" button<br>4. System updates application to "ACCEPTED"<br>5. System updates request to "IN_PROGRESS"<br>6. System rejects other pending applications<br>7. System notifies accepted tutor<br>8. System notifies rejected tutors<br>9. System displays confirmation |
| **Frequency** | Medium |
| **Priority** | High |

---

## 6. Data Flow Diagrams (DFD)

### 6.1 Level 0 (Context Diagram)

```
                    ┌──────────────────┐
                    │   Guest User     │
                    └────────┬─────────┘
                             │
                             │ Registration/Login
                             ▼
┌──────────┐         ┌──────────────────┐         ┌──────────┐
│ Student  │─────────│                  │─────────│  Tutor   │
│          │         │                  │         │          │
│ Profile  │◄────────┤  TuitionMedia    ├────────►│ Profile  │
│ Request  │         │     System       │         │ Apply    │
│ Review   │─────────┤                  ├─────────│ Track    │
└──────────┘         └────────┬─────────┘         └──────────┘
                             │
                             │ User Management
                             ▼
                    ┌──────────────────┐
                    │   Administrator  │
                    └──────────────────┘
```

### 6.2 Level 1 DFD

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           TuitionMedia System                            │
│                                                                          │
│  ┌──────────┐                     ┌──────────┐                         │
│  │  1.0     │                     │  2.0     │                         │
│  │  User    │                     │  Profile │                         │
│  │  Auth    │                     │  Mgmt    │                         │
│  └────┬─────┘                     └────┬─────┘                         │
│       │                                │                                │
│       │         ┌──────────┐           │                                │
│       └─────────┤  User     ├───────────┘                                │
│                 │  Database│                                            │
│       ┌─────────┤          ├───────────┐                                │
│       │         └──────────┘           │                                │
│       │                                │                                │
│  ┌────┴─────┐                     ┌────┴─────┐                         │
│  │  3.0     │                     │  4.0     │                         │
│  │  Tuition │                     │Application│                         │
│  │  Request │                     │  Mgmt    │                         │
│  └────┬─────┘                     └────┬─────┘                         │
│       │                                │                                │
│       │         ┌──────────┐           │                                │
│       └─────────┤  Request  ├───────────┘                                │
│                 │  Database│                                            │
│                 └──────────┘                                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

External Entities:
  - Student (provides request data, receives matches)
  - Tutor (provides application data, receives notifications)
  - Admin (provides verification, receives reports)

Processes:
  1.0 User Authentication - Handles registration, login, logout
  2.0 Profile Management - Manages user profiles
  3.0 Tuition Request - Handles request CRUD operations
  4.0 Application Management - Handles application workflow

Data Stores:
  - User Database (D1) - Stores user accounts and profiles
  - Request Database (D2) - Stores tuition requests and applications
```

### 6.3 Level 2 DFD - User Authentication Process

```
                    User Registration/Login Data
                              │
                              ▼
                    ┌──────────────────┐
                    │   1.1 Validate   │
                    │     Input        │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │  1.2     │  │  1.3     │  │  1.4     │
        │  Check   │  │  Hash    │  │  Generate│
        │Duplicate │  │Password  │  │   JWT    │
        └────┬─────┘  └────┬─────┘  └────┬─────┘
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                    ┌──────────────────┐
                    │   1.5 Store      │
                    │   User Data      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   D1: User       │
                    │   Database      │
                    └──────────────────┘
```

---

## 7. Supplementary Information

### 7.1 Data Dictionary

#### User Entity

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | UUID | Unique identifier | Primary key, auto-generated |
| email | String | User email address | Unique, not null, email format |
| password_hash | String | Hashed password | Not null, bcrypt hash |
| name | String | User full name | Optional, max 100 chars |
| phone | String | Phone number | Optional, unique |
| role | Enum | User role | STUDENT, TUTOR, ADMIN |
| is_verified | Boolean | Account verified | Default false |
| is_active | Boolean | Account active | Default true |
| created_at | DateTime | Creation timestamp | Auto-generated |
| updated_at | DateTime | Update timestamp | Auto-updated |

#### TuitionRequest Entity

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | CUID | Unique identifier | Primary key, auto-generated |
| studentId | UUID | Student reference | Foreign key, not null |
| title | String | Request title | Not null, max 200 chars |
| description | String | Detailed description | Not null, max 2000 chars |
| subject | String | Subject category | Not null, max 100 chars |
| budget | Decimal | Budget amount | Optional, positive |
| location | String | Preferred location | Optional |
| status | Enum | Request status | OPEN, IN_PROGRESS, CLOSED, CANCELLED |
| created_at | DateTime | Creation timestamp | Auto-generated |
| updated_at | DateTime | Update timestamp | Auto-updated |

#### Application Entity

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | CUID | Unique identifier | Primary key |
| requestId | CUID | Request reference | Foreign key, not null |
| tutorId | UUID | Tutor reference | Foreign key, not null |
| message | String | Cover letter | Optional, max 2000 chars |
| proposed_rate | Decimal | Proposed hourly rate | Optional |
| status | Enum | Application status | PENDING, ACCEPTED, REJECTED, WITHDRAWN |
| created_at | DateTime | Creation timestamp | Auto-generated |
| updated_at | DateTime | Update timestamp | Auto-updated |

### 7.2 API Endpoints Summary

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | /auth/register | User registration | No | - |
| POST | /auth/login | User login | No | - |
| GET | /auth/me | Get current user | Yes | Any |
| PUT | /auth/profile | Update profile | Yes | Any |
| POST | /tuition-requests | Create request | Yes | Student |
| GET | /tuition-requests | List all requests | Yes | Tutor |
| GET | /tuition-requests/:id | Get request details | Yes | Any |
| PUT | /tuition-requests/:id | Update request | Yes | Student |
| DELETE | /tuition-requests/:id | Close request | Yes | Student |
| POST | /applications | Submit application | Yes | Tutor |
| GET | /applications/request/:id | Get request applications | Yes | Student |
| GET | /applications/tutor | Get tutor applications | Yes | Tutor |
| PUT | /applications/:id/accept | Accept application | Yes | Student |
| PUT | /applications/:id/reject | Reject application | Yes | Student |

### 7.3 Assumptions and Dependencies

**Assumptions:**
1. Users have stable internet connection
2. Users have modern web browsers
3. Email addresses are valid and accessible
4. Tutors provide accurate credential information
5. Students provide accurate academic information

**Dependencies:**
1. Supabase PostgreSQL database service availability
2. Hosting platform (Vercel, Railway) uptime
3. npm registry availability for package installation
4. Email delivery infrastructure (future)

### 7.4 Glossary

| Term | Definition |
|------|------------|
| **JWT** | JSON Web Token - compact, URL-safe token for authentication |
| **ORM** | Object-Relational Mapping - database abstraction layer |
| **CUID** | Collision-resistant Unique Identifier |
| **SSR** | Server-Side Rendering - rendering pages on server |
| **CRUD** | Create, Read, Update, Delete operations |
| **RBAC** | Role-Based Access Control |
| **API** | Application Programming Interface |
| **REST** | Representational State Transfer |

---

## 8. Approval and Sign-Off

### 8.1 Developer Sign-Off

I confirm that I understand and can implement all requirements specified in this document.

**Name:** [Your Name]  
**Signature:** ______________________  
**Date:** ______________________

### 8.2 Supervisor Approval

I have reviewed this Software Requirement Specification and approve it for implementation.

**Name:** [Supervisor Name]  
**Signature:** ______________________  
**Date:** ______________________

---

**Document Status:** Final  
**Next Review Date:** After implementation completion
