# Week 1: System Scaffold & Environments

## Goals
<span style="color:red">Establish the foundational repository structure, development environments, and deployment pipelines to ensure a smooth, containerized developer experience.</span>

## Technical Tasks

### 1. Monorepo Initialization
*   <span style="color:red">**Action:** Initialize an Nx Workspace to manage multiple applications (Angular dashboard, NestJS core API, and pure JS SDK) in a single repository.</span>
*   <span style="color:red">**Tooling:** Nx, TypeScript.</span>
*   <span style="color:red">**Standards:** Configure ESLint, Prettier, and Husky (pre-commit hooks) for consistent code styling across the full stack.</span>

### 2. Angular Microfrontend Scaffold
*   <span style="color:red">**Action:** Generate the base Angular 21 Microfrontend architecture using Nx (Native Federation / Module Federation).</span>
*   <span style="color:red">**Host & Remotes:** Create the `frontend-shell` (Host) and initial remotes (`mfe-auth`, `mfe-dashboard`). Ensure they are configured for Zoneless change detection and Signals.</span>
*   <span style="color:red">**Routing:** Set up the module federation routing configuration to dynamically load remotes into the shell.</span>
*   <span style="color:red">**Styling:** Integrate SCSS and CSS variables in a `shared-ui` library for a themeable design system.</span>

### 3. NestJS Backend Scaffold
*   <span style="color:red">**Action:** Generate the NestJS Core API app.</span>
*   <span style="color:red">**API Design:** Configure Swagger/OpenAPI to auto-generate API documentation for the frontend.</span>
*   <span style="color:red">**Architecture:** Set up base modules for Users, Organizations, and generic Projects.</span>

### 4. Database & Infrastructure
*   <span style="color:red">**Action:** Create a `docker-compose.yml` for local development.</span>
*   <span style="color:red">**Services:** Include PostgreSQL (database) and Redis (caching/queues).</span>
*   <span style="color:red">**ORM:** Integrate Prisma or TypeORM in NestJS.</span>
*   <span style="color:red">**Schema:** Define initial data models for `User`, `Organization` (Tenant), and `Workspace`.</span>

### 5. CI/CD Pipelines
*   **Action:** Set up GitHub Actions (or GitLab CI).
*   **Workflows:** Create pipelines for PR validation (Lint -> Test -> Build).

## Deliverables
*   <span style="color:red">A working Nx monorepo where `npm run start` spins up both Angular and NestJS locally.</span>
*   <span style="color:red">A running local Postgres and Redis via Docker.</span>
*   Automated CI checks passing on the `main` branch.
