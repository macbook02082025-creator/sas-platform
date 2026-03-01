# Hallucination-Safe AI Frontend Lab: Technical Architecture

This document defines the high-level architecture, technology standards, and folder structures for all core components of the SaaS platform.

---

## 1. System Overview
The platform follows a **Clean Architecture** approach, separating the presentation layer (Angular), the orchestration layer (NestJS), and the intelligence layer (FastAPI).

---

## 2. Frontend Architecture (Angular Microfrontends)

### **Core Stack**
- **Framework:** Angular 21 (Zoneless, Signals-only components).
- **Architecture:** Microfrontends (MFE) via Nx and Native Federation / Module Federation. The app is split into a central `shell` (host) and feature-specific remotes.
- **State Management:** **NgRx Signal Store** (lightweight, reactive).
- **Styling:** SCSS with a custom Design System based on CSS Variables.
- **Charts:** ECharts or Highcharts for analytics.
- **Editor:** Monaco Editor or CodeMirror for prompt engineering.

### **Folder Structure (`apps/`)**
```text
frontend-shell/         # The Host application (Routing, Global Layout)
├── src/app/
│   ├── layout/         # Main Navigation, Sidebar
│   └── app.routes.ts   # Lazy loads remotes

mfe-auth/               # Remote: Login, Signup, Security
mfe-skills/             # Remote: AI Skill editor & Prompt builder
mfe-playground/         # Remote: Interactive testing environment
mfe-analytics/          # Remote: Dashboards and logs

shared-ui/              # Library: Reusable UI primitives (Buttons, Cards)
shared-core/            # Library: State (NgRx), Interceptors, APIs
```

### **Guidelines**
- **Signal-First:** Use Signals for all component-level state and reactivity.
- **OnPush Change Detection:** Mandatory for all components to ensure peak performance.
- **Smart/Dumb Component Pattern:** Keep UI components "dumb" (input/output) and feature components "smart" (service injection).

---

## 3. Orchestration API (NestJS Core)

### **Core Stack**
- **Framework:** NestJS 11 (TypeScript).
- **Database:** PostgreSQL + Prisma ORM.
- **Auth:** Passport.js with JWT + RBAC.
- **Cache/Queue:** Redis + BullMQ.

### **Folder Structure (`apps/api/src/`)**
```text
modules/
├── auth/               # JWT strategy, login/signup
├── organizations/      # Multi-tenancy logic (Tenants)
├── projects/           # Project & API Key management
├── skills/             # AI Skill CRUD & Versioning
├── ingestion/          # File upload & processing trigger
└── interactions/       # Logging, Analytics, Feedback
common/
├── decorators/         # @CurrentTenant(), @Roles()
├── filters/            # Global Exception Filters
├── guards/             # Auth & Tenant Guards
├── interceptors/       # Logging & Response formatting
└── middleware/         # Tenant-header validation
```

### **Guidelines**
- **Tenant Isolation:** Every query must be scoped by `organization_id`. Use a Prisma middleware to enforce this globally.
- **DTOs & Validation:** Use `class-validator` for all incoming request payloads.
- **Event-Driven:** Use NestJS `EventEmitter` for non-blocking tasks (like logging an interaction after a stream starts).

---

## 4. AI Intelligence Engine (Python FastAPI)

### **Core Stack**
- **Framework:** FastAPI (Asynchronous).
- **AI Orchestration:** LangChain / LangGraph.
- **Vector DB:** Qdrant or `pgvector`.
- **Validation:** Pydantic v2.

### **Folder Structure (`apps/ai-engine/`)**
```text
api/
├── routes/             # v1/chat, v1/ingest, v1/validate
└── dependencies.py     # Auth & DB injection
services/
├── rag_service.py      # Chunking, Embedding, Retrieval
├── llm_service.py      # Provider wrappers (OpenAI, Anthropic)
└── guardrail_service.py # Policy enforcement logic
core/
├── config.py           # Environment variables
├── prompts.py          # Base system prompt templates
└── security.py         # Internal API key validation
models/                 # Pydantic schemas for IO
└── interaction.py
```

### **Guidelines**
- **Streaming by Default:** Use `StreamingResponse` for all LLM outputs.
- **Statelessness:** The AI engine should be stateless; all context is passed via the RAG pipeline or the request body.
- **Fail-Fast Guardrails:** Implement the "Interceptor" pattern where outputs are validated *before* the final chunk is sent.

---

## 5. Embeddable SDK (Universal JS)

### **Core Stack**
- **Build Tool:** Vite (Library Mode).
- **Output:** ESM, CJS, and IIFE (for `<script>` tags).
- **UI:** Lit (Web Components) for framework-agnostic embedding.

### **Folder Structure (`packages/sdk/src/`)**
```text
core/
├── client.ts           # The API wrapper (Fetch/SSE)
├── storage.ts          # Session handling
└── events.ts           # SDK Event Emitter
components/
├── chat-widget/        # The floating UI
├── copilot-panel/      # Side-panel UI
└── styles/             # Encapsulated Shadow DOM styles
```

---

## 6. Infrastructure & DevOps

### **Technology**
- **Containerization:** Docker + Docker Compose for local dev.
- **Orchestration:** Kubernetes (K8s) for production.
- **Database:** Managed RDS (Postgres) + Managed Redis.
- **Monitoring:** 
  - **Sentry:** Frontend/Backend errors.
  - **Prometheus/Grafana:** System metrics.
  - **LangSmith:** LLM trace analysis.

### **Security Guidelines**
1. **API Keys:** Never store raw keys; store SHA-256 hashes.
2. **Data Residency:** Support "Bring Your Own Key" (BYOK) for enterprise tenants.
3. **Secrets:** Use AWS Secrets Manager or HashiCorp Vault; never `.env` in production.
