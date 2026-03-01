<div align="center">

# 🌌 SAS Platform

**The Hallucination-Safe AI Multi-Tenant Ecosystem**

[![License](https://img.shields.io/badge/License-Proprietary-blue.svg)](LICENSE)
[![Angular](https://img.shields.io/badge/Angular-v21-dd0031?logo=angular)](https://angular.io/)
[![NestJS](https://img.shields.io/badge/NestJS-v11-e0234e?logo=nestjs)](https://nestjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.110-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Nx](https://img.shields.io/badge/Nx-Monorepo-143046?logo=nx)](https://nx.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](https://github.com/macbook02082025-creator/sas-platform/pulls)

---

**A world-class, secure, and hyper-performant AI platform built for the enterprise.**
*Linear & Stripe inspired aesthetics • Dark-mode first • Zoneless & Signals-only*

[Explore Documentation](#-architecture-deep-dive) • [Quick Start](#-getting-started) • [Tech Stack](#-core-tech-stack) • [Roadmap](#-roadmap)

</div>

---

## 📖 Table of Contents
- [✨ Core Vision](#-core-vision)
- [🏗️ System Architecture](#️-system-architecture)
  - [Frontend (Shell + MFEs)](#frontend-shell--mfes)
  - [Backend (NestJS API)](#backend-nestjs-api)
  - [AI Engine (FastAPI)](#ai-engine-fastapi)
- [🛠️ Core Tech Stack](#️-core-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📐 Engineering Standards](#-engineering-standards)
- [📈 Observability & Security](#-observability--security)
- [🗺️ Roadmap](#️-roadmap)

---

## ✨ Core Vision
SAS Platform is designed to solve the critical challenges of enterprise AI: **Hallucinations**, **Tenant Isolation**, and **Scalability**. Our "Hallucination-Safe" architecture ensures every AI response is validated, cited, and grounded in your organization's specific knowledge base.

> "Aesthetic Framework inspired by Linear and Stripe. Dark-mode first, 4px/8px grid system, and #000000 / #080808 background layering."

---

## 🏗️ System Architecture

### Frontend (Shell + MFEs)
Built on **Angular 21**, our frontend employs a **Microfrontend (MFE)** architecture using **Native Module Federation**.
- **Zoneless Only:** `provideExperimentalZonelessChangeDetection()` is mandatory.
- **Signals-Only:** Reactive state management using `signal()`, `computed()`, and `effect()`.
- **Aesthetic:** High-performance micro-interactions (150ms cubic-bezier) and WCAG 2.1 AA compliance.

### Backend (NestJS API)
A robust **NestJS 11** core managing business logic, identity, and multi-tenancy.
- **Tenant Isolation:** Row-Level Security (RLS) ensures strict organization-level data separation.
- **Asynchronous Tasks:** BullMQ (Redis) handles heavy processing like document embedding.
- **Strict Typing:** Shared DTOs ensure 1:1 type alignment with the frontend.

### AI Engine (FastAPI)
The intelligence layer powered by **FastAPI** and **LangChain**.
- **The Citation Rule:** AI responses must return source metadata; otherwise, a grounded "I don't know" is forced.
- **Validation Layer:** Every LLM response passes through an automated guardrail before the final chunk is sent.
- **SSE Streaming:** Real-time feedback via Server-Sent Events.

---

## 🛠️ Core Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Monorepo** | Nx, TypeScript |
| **Frontend** | Angular 21, NgRx SignalStore, RxJS, Vite, SCSS |
| **Backend** | NestJS 11, Prisma, PostgreSQL, Redis, BullMQ |
| **AI Intelligence** | FastAPI, LangChain, OpenAI, Anthropic, Vector DB |
| **Testing** | Vitest, Playwright, Jest (E2E) |
| **DevOps** | Docker, Docker Compose, GitHub Actions |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js:** v20+ (LTS)
- **Python:** v3.10+
- **Docker:** Engine & Compose
- **Nx CLI:** `npm install -g nx`

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/macbook02082025-creator/sas-platform.git
cd sas-platform

# Install Node dependencies
npm install

# Initialize AI Engine environment
cd apps/ai-engine
python -m venv venv
source venv/bin/activate # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### 3. Environment Setup
Copy the example environment file and fill in your secrets:
```bash
cp .env.example .env # Ensure you add your OPENAI_API_KEY and DATABASE_URL
```

### 4. Running the Ecosystem
```bash
# Start all services (Recommended)
nx run-many -t serve

# Start individual applications
nx serve frontend-shell
nx serve api
```

---

## 📐 Engineering Standards
To maintain the "Top 1%" standard, every contribution must adhere to:
- **No `any`:** Use `unknown` or explicit interfaces.
- **Logic Abstraction:** Components must not exceed 250 lines. Abstract logic into `SignalStore` or services.
- **Skeleton Loaders:** Required for any data fetch exceeding 200ms.
- **Documentation:** All endpoints must have Swagger definitions (`@ApiProperty`).

---

## 📈 Observability & Security
- **Telemetry:** Integrated with LangSmith for AI tracing (Frontend `traceId` → Vector DB query).
- **Security:** Password hashing with **Argon2**, API keys hashed with **SHA-256**.
- **Logging:** Structured JSON logging via Pino/Winston.

---

## 🗺️ Roadmap
- [x] Initial Monorepo Scaffolding (Nx + Angular 21)
- [x] MFE Auth Integration
- [ ] Multi-tenant Dashboard Core
- [ ] LangChain RAG validation layer
- [ ] Real-time SSE Chat remote
- [ ] Skill Creation workflow with sandbox execution

---

<div align="center">
  <sub>Built with ❤️ by the SAS Team. Proprietary and Confidential.</sub>
</div>
