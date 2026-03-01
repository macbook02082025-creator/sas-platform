# Hallucination-Safe AI Frontend Lab: Architectural Mandates

This document defines the non-negotiable rules for the project's execution. As the Full Stack Architect, these standards ensure the platform remains world-class, secure, and hyper-performant.

---

## 1. UI/UX Excellence (The "Top 1%" Standard)
*   **Aesthetic Framework:** Inspired by Linear and Stripe. Dark-mode first, 4px/8px grid system, and #000000 / #080808 background layering.
*   **Angular 21 Mandate:** 
    *   **Microfrontend Architecture (MFE):** The application must be split into a Host (Shell) and independent Remotes (e.g., Auth, Dashboard, Skills) using Module Federation or Native Federation.
    *   **Zoneless Only:** `provideExperimentalZonelessChangeDetection()` is mandatory. No `zone.js`.
    *   **Signals-Only:** Use `signal()`, `computed()`, and `effect()`. Standard class properties for state are forbidden.
    *   **Component Logic:** No component should exceed 250 lines. Logic must be abstracted into `SignalStore` (NgRx) or utility services.
*   **Micro-Interactions:** 
    *   Use CSS transitions for all hover/active states (default: `150ms cubic-bezier(0.4, 0, 0.2, 1)`).
    *   Skeleton loaders must be used for any data fetch exceeding 200ms.
*   **Accessibility (A11y):** WCAG 2.1 AA compliance. Full keyboard navigation and ARIA labels for all interactive elements.

---

## 2. API Design & Communication
*   **Strict Typing:** Use `npm interface` sharing or a monorepo-shared `DTO` library to ensure the Frontend and Backend always have 1:1 type alignment.
*   **Streaming Standards:** All AI interactions must use **Server-Sent Events (SSE)**. Plain JSON responses for LLM outputs are prohibited for user-facing chat.
*   **Versioning:** API versioning via URL (`/api/v1/...`). Breaking changes require a new version and 30-day deprecation notice in headers.
*   **Error Handling:** Standardized RFC 7807 Error Details. Every error must return a `code`, `message`, and `traceId`.

---

## 3. Backend & Multi-Tenancy (NestJS 11)
*   **Tenant Isolation:** Row-Level Security (RLS) at the database level or a strict `TenantInterceptor` that appends `WHERE organization_id = X` to every query.
*   **Database Performance:** 
    *   All foreign keys must be indexed.
    *   Complex joins are forbidden; use denormalization or optimized Prisma includes.
*   **Asynchronous Processing:** Heavy tasks (document chunking, embedding generation) must be handled by **BullMQ (Redis)** workers, never in the request-response cycle.
*   **Security:** 
    *   Passwords/Secrets: Argon2 hashing.
    *   API Keys: SHA-256 hashed at rest; displayed once to the user.

---

## 4. AI Intelligence & Guardrails (FastAPI + LangChain)
*   **Hallucination Prevention:** Every LLM response must pass through a **Validation Layer** before the final chunk is sent.
*   **The Citation Rule:** If RAG is enabled, the AI *must* return source metadata. If no source is found, the guardrail must force an "I don't know" response.
*   **Cost & Latency Monitoring:** 
    *   Log token usage for every request.
    *   Implement an "Aggressive Timeout" (e.g., 30s) for LLM calls to prevent hanging connections.
*   **Model Agnosticism:** Use the Factory Pattern to allow switching between OpenAI, Anthropic, and local LLMs via configuration without changing business logic.

---

## 5. Observability & Engineering Standards
*   **Logging:** Structured JSON logging (Pino/Winston). No `console.log` in production code.
*   **Telemetry:** LangSmith or Phoenix integration for AI tracing. Every AI call must be traceable from the Frontend `traceId` to the Vector DB query.
*   **Testing (The 80% Rule):** 
    *   80% code coverage for Backend business logic.
    *   Critical Path E2E tests for the "Skill Creation" and "Chat" flows.
*   **Documentation:** Every API endpoint must have a Swagger (`@ApiProperty`) definition. The `README.md` must be kept updated with local setup instructions.

---

## 6. Architecture Guardrails (Never Do These)
*   **Never** use `any`. Use `unknown` if a type is truly dynamic.
*   **Never** store sensitive data (PII) in logs or Vector DB metadata without encryption.
*   **Never** allow the LLM to execute raw code on the server without a secure, sandboxed environment (e.g., E2B or Docker).
*   **Never** perform database migrations manually. Always use Prisma Migrate.
