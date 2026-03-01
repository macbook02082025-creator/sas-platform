# Hallucination-Safe AI Frontend Lab: Development & Architecture Plan

This document outlines the world-class architecture, technology stack, and a rigorous 12-week development plan for building the Hallucination-Safe AI Frontend Lab SaaS platform.

---

## 1. Technology Stack

To build a robust, scalable, and enterprise-ready SaaS, the stack separates concerns between frontend UI, core business logic, and heavy AI/data processing.

### **Frontend (The Dashboard & SDK)**
*   **Framework:** Angular (v21+) with Zoneless Change Detection and Signals for reactive, highly performant UI.
*   **State Management:** NgRx or RxJS for complex state (handling streaming AI responses, multi-step scenarios).
*   **Styling:** SCSS / Vanilla CSS (with CSS Variables for easy theming/white-labeling).
*   **UI Primitives:** Angular CDK for headless, accessible components (overlays, drag-and-drop for scenario builders).
*   **SDK:** Pure TypeScript (compiled to standard JS), framework-agnostic, using Web Components for the embeddable chat/copilot widgets.

### **Backend (Core Services & API Gateway)**
*   **Core API:** NestJS (v11+). Provides perfect synergy with Angular (similar architecture) for handling auth, multi-tenancy, billing, and CRUD operations for skills/projects.
*   **Database:** PostgreSQL (with Row-Level Security for strict multi-tenant data isolation).
*   **Caching & Queues:** Redis for rate limiting, session caching, and managing Human-in-the-Loop review queues.

### **AI Engine (The RAG & Guardrail Service)**
*   **Framework:** Python with FastAPI (high performance, native integration with the Python AI ecosystem).
*   **Orchestration:** LangChain or LlamaIndex for constructing RAG pipelines and tool-calling logic.
*   **Vector Database:** Qdrant or PostgreSQL + `pgvector` for storing and retrieving context documents.
*   **LLM Providers:** OpenAI API (GPT-4o) default, with adapters for local models (Ollama/vLLM) for data-sensitive tenants.

### **Infrastructure & Observability**
*   **Hosting:** Dockerized containers orchestrated via Kubernetes (AWS EKS or GCP GKE). Frontend deployed via Vercel/Netlify for edge CDN.
*   **Observability:** Sentry for error tracking, Datadog/Prometheus for latency monitoring, and LangSmith/Phoenix for LLM tracing (prompt logs, token usage).
*   **CI/CD:** GitHub Actions with strict PR checks, linting, and automated end-to-end testing (Cypress/Playwright).

---

## 2. Project Architecture (High-Level)

The system is designed as an event-driven, microservices-oriented architecture.

```text
[ End Users ] --> [ Embedded JS SDK ] 
                                        --> [ API Gateway / Load Balancer ]
[ Admins / PMs ] -> [ Angular Dashboard] /                |
                                                          v
                                        +----------------------------------+
                                        |    Core API Service (NestJS)     |
                                        | - Auth, Tenants, RBAC, Billing   |
                                        +----------------------------------+
                                           |               |               |
                                           v               v               v
                             [ PostgreSQL DB ]       [ Redis Cache ]  [ Webhooks / Events ]
                                           |
                                           v
                                        +----------------------------------+
                                        |  AI Engine & Guardrails (Python) |
                                        | - Policy Engine, Scenario Tester |
                                        | - Confidence Scoring             |
                                        +----------------------------------+
                                           |               |               |
                                           v               v               v
                               [ Vector DB ]        [ LLM APIs ]      [ Telemetry Logs ]
```

### **Core Architectural Principles:**
1.  **Strict Isolation:** Tenant data and API keys are strictly partitioned.
2.  **Streaming First:** All AI interactions use Server-Sent Events (SSE) or WebSockets to stream responses chunk-by-chunk to the frontend SDK, ensuring low perceived latency.
3.  **Fail-Safe Interceptors:** The Guardrail service sits between the LLM and the user. If the LLM generates a hallucination (fails the citation policy check), the interceptor halts the stream and triggers a fallback.

---

## 3. Week-by-Week Development Plan (12-Week Roadmap)

### **Phase 1: Foundation & Infrastructure (Weeks 1-2)**
*   **Week 1: System Scaffold & Environments**
    *   Set up monorepo (Nx workspace) for Angular frontend, SDK, and NestJS backend.
    *   Configure CI/CD pipelines, Dockerfiles, and establish the PostgreSQL database schema for Users, Organizations (Tenants), and Projects.
*   **Week 2: Auth & Core CRUD**
    *   Implement authentication (JWT/OAuth) and Role-Based Access Control (RBAC).
    *   Build the Angular dashboard shell (routing, nav, settings).
    *   Create CRUD APIs for managing "AI Skills" and API Keys.

### **Phase 2: The AI Engine & RAG Pipeline (Weeks 3-5)**
*   **Week 3: AI Service Scaffold & LLM Connection**
    *   Initialize the Python FastAPI service.
    *   Implement base LLM wrappers (connect to OpenAI).
    *   Build the prompt templating engine where users can define inputs and system prompts via the UI.
*   **Week 4: RAG Implementation**
    *   Integrate Vector Database (`pgvector` or Qdrant).
    *   Build document ingestion pipelines (upload PDF/text -> chunk -> embed -> store).
    *   Implement retrieval logic during the LLM generation phase.
*   **Week 5: Streaming & SDK V0**
    *   Implement SSE/WebSockets for streaming AI responses from FastAPI -> NestJS -> Angular.
    *   Draft the initial vanilla JS SDK (`<script>` tag drop-in) for sending queries and rendering basic text streams.

### **Phase 3: Hallucination Prevention & Guardrails (Weeks 6-8) (Core Differentiator)**
*   **Week 6: The Policy Engine**
    *   Build the rule validation layer: "Require Citations", "Banned Words", "Confidence Threshold".
    *   Implement post-generation validation checks.
*   **Week 7: Playground & Scenario Testing**
    *   Build the Angular "Playground" UI.
    *   Implement the split-pane view to compare Baseline vs. Guardrailed prompts.
    *   Allow users to save "Test Scenarios" (unit tests for prompts).
*   **Week 8: Human-in-the-Loop (HITL) Queue**
    *   Build the queue system in Redis/PostgreSQL.
    *   Create the "Reviewer" dashboard in Angular where flagged AI responses are held for human approval before sending to the end-user (or used for later fine-tuning).

### **Phase 4: Observability, Analytics & Advanced UX (Weeks 9-10)**
*   **Week 9: Telemetry & Quality Score Dashboard**
    *   Log every interaction: Prompt, Context, Output, Latency, Cost.
    *   Build the Angular Analytics dashboard showing "AI Quality Score", Hallucination rates, and escalation metrics.
*   **Week 10: Dynamic Server-Driven UI & Advanced SDK**
    *   Allow the LLM to output structured JSON representing UI components (e.g., a form or a chart).
    *   Update the SDK and Angular app to dynamically render these UI blocks.
    *   Add embeddable widgets (Copilot side-panel, floating chat button).

### **Phase 5: Polish, Testing & Launch (Weeks 11-12)**
*   **Week 11: End-to-End Testing & Security Audit**
    *   Write E2E tests for the critical path (creating a skill -> embedding SDK -> chatting -> triggering a guardrail).
    *   Conduct security audits (ensure tenant isolation, API key encryption).
*   **Week 12: Documentation, Templates & Launch Prep**
    *   Build the "Templates Gallery" (pre-configured skills for Support Bots, Code Reviewers).
    *   Write developer documentation for the SDK.
    *   Final UX polish (animations, loading states, error handling).
    *   **Launch V1.**