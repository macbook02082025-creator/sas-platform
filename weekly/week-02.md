# Week 2: Auth, Multi-Tenancy & Core CRUD [COMPLETED]

## Goals
<span style="color:red">Implement secure authentication, strict multi-tenant data isolation, and the foundational CRUD operations required to manage AI projects and API keys.</span>

## Technical Tasks

### 1. Authentication & Authorization
*   <span style="color:red">**Backend:** [DONE] Implemented Auth guards in NestJS using JWTs. Upgraded to **Argon2** for industry-standard password hashing.</span>
*   <span style="color:red">**Frontend:** [DONE] Login/Signup flows in Angular 21 with Route Guards.</span>
*   <span style="color:red">**RBAC:** [DONE] **Roles decorator** and **RolesGuard** implemented. Frontend `hasRole` directive active for UI-level permissions.</span>

### 2. Multi-Tenancy Architecture
*   <span style="color:red">**Database:** [DONE] Strict tenant isolation via `TenantInterceptor`. Migrated to **PostgreSQL** to support native RLS.</span>
*   <span style="color:red">**Context:** [DONE] Tenant context management in Angular via `AuthStore`.</span>

### 3. API Key Management
*   <span style="color:red">**Backend:** [DONE] API Key module with SHA-256 hashing and cryptographically secure generation.</span>
*   <span style="color:red">**Security:** [DONE] Automated hashing of API keys at rest.</span>
*   <span style="color:red">**Frontend UI:** [DONE] **Premium API Key Management Modal** integrated into the unit configuration.</span>

### 4. Angular Dashboard Shell
*   <span style="color:red">**Layout:** [DONE] Modern shell with Sidebar/Header.</span>
*   <span style="color:red">**Views:** [DONE] Project list and settings views.</span>
*   <span style="color:red">**State:** [DONE] **NgRx SignalStore** implemented for high-performance, zoneless state management.</span>

## Deliverables
*   <span style="color:red">Users can sign up, log in, and see a personalized dashboard.</span>
*   <span style="color:red">Users can create new projects and generate API keys.</span>
*   <span style="color:red">Secure APIs with verified tenant isolation.</span>
