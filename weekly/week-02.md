# Week 2: Auth, Multi-Tenancy & Core CRUD

## Goals
Implement secure authentication, strict multi-tenant data isolation, and the foundational CRUD operations required to manage AI projects and API keys.

## Technical Tasks

### 1. Authentication & Authorization
*   <span style="color:red">**Backend:** Implement Auth guards in NestJS using JWTs (JSON Web Tokens). Integrate with an Identity Provider (Auth0, Supabase Auth, or custom implementation).</span>
*   <span style="color:red">**Frontend:** Create Login/Signup flows in Angular. Implement Route Guards to protect the `/dashboard` routes.</span>
*   **RBAC:** Define roles (`Admin`, `Engineer`, `Reviewer`) and implement role-based access decorators in NestJS.

### 2. Multi-Tenancy Architecture
*   <span style="color:red">**Database:** Implement tenant isolation logic. Ensure every API request automatically filters data by the user's current `Organization ID` (e.g., via Prisma middleware or Postgres Row-Level Security).</span>
*   **Context:** Build a context switcher in the Angular UI so users can switch between different organizations or workspaces.

### 3. API Key Management
*   **Backend:** Create an entity for `API Keys`. Implement a secure generation algorithm (using cryptographically secure random bytes).
*   **Security:** Hash API keys in the database (only show the key once upon creation).
*   **Endpoints:** Build APIs to generate, revoke, and list API keys for a specific environment.

### 4. Angular Dashboard Shell
*   <span style="color:red">**Layout:** Build the main application shell (Sidebar, Header, Main Content Area).</span>
*   **Views:** Implement the "Projects List" and "Project Settings" views.
*   <span style="color:red">**State:** Set up NgRx or RxJS state management to handle the current logged-in user and active project state. (NgRx Signals Store implemented)</span>

## Deliverables
*   <span style="color:red">Users can sign up, log in, and see a personalized dashboard. (Frontend + Backend Done)</span>
*   <span style="color:red">Users can create new projects and generate API keys. (Backend Infrastructure Ready)</span>
*   <span style="color:red">Secure APIs that reject unauthorized or cross-tenant requests.</span>
