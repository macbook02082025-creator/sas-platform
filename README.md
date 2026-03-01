# Hallucination-Safe AI Platform

A world-class, secure, and hyper-performant AI platform built with a modern microfrontend and microservices architecture. This platform is designed for enterprise-grade reliability, multi-tenancy, and hallucination-free AI interactions.

## 🏗️ Architecture Overview

The platform is built as an **Nx Monorepo**, ensuring seamless integration and type safety across all services.

### 1. Frontend: Microfrontend (MFE) Architecture
- **Framework:** Angular 21 (Zoneless, Signals-only).
- **Communication:** Native Module Federation.
- **State Management:** NgRx SignalStore.
- **Styling:** Vanilla CSS (Linear/Stripe inspired aesthetic, Dark-mode first).
- **Apps:**
  - `frontend-shell`: The Host application managing routing and layout.
  - `mfe-auth`: Remote authentication module.
  - *More remotes to come (Dashboard, Skills, etc.)*

### 2. Backend: NestJS Microservice
- **Framework:** NestJS 11.
- **Database:** Prisma with Tenant Isolation (RLS/TenantInterceptor).
- **Performance:** BullMQ (Redis) for asynchronous processing.
- **API:** Standardized RFC 7807 Error Details, Strict Typing via shared DTOs.

### 3. AI Engine: FastAPI + LangChain
- **Framework:** FastAPI.
- **Intelligence:** LangChain for RAG and LLM orchestration.
- **Guardrails:** Validation Layer for hallucination prevention and citation enforcement.
- **Streaming:** Server-Sent Events (SSE) for real-time LLM responses.

## 🚀 Tech Stack

- **Frontend:** Angular 21, TypeScript, RxJS, NgRx, Vite.
- **Backend:** NestJS 11, Prisma, PostgreSQL (via Docker), Redis.
- **AI Engine:** Python 3.10+, FastAPI, LangChain, OpenAI/Anthropic.
- **Tooling:** Nx, Docker, Docker Compose, Vitest, Playwright.

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+)
- [Python](https://www.python.org/) (3.10+)
- [Docker](https://www.docker.com/) & Docker Compose
- [Nx CLI](https://nx.dev/getting-started/install) (`npm install -g nx`)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/macbook02082025-creator/sas-platform.git
    cd sas-platform
    ```

2.  **Install Node.js dependencies:**
    ```sh
    npm install
    ```

3.  **Set up the AI Engine environment:**
    ```sh
    cd apps/ai-engine
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    ```

4.  **Environment Configuration:**
    Create a `.env` file in the root directory and configure your database and AI API keys (see `.env.example` if available).

### Running the Application

- **Start all services (Backend, Frontend, AI Engine):**
  ```sh
  nx run-many -t serve
  ```

- **Run individual apps:**
  ```sh
  nx serve frontend-shell
  nx serve api
  # AI Engine usually runs via python or uvicorn
  cd apps/ai-engine && uvicorn app.main:app --reload
  ```

## 📐 Engineering Standards

- **Signals-Only:** No standard class properties for state in Angular.
- **Zoneless Mandate:** No `zone.js`.
- **Strict Typing:** No `any`. Use `unknown` or specific interfaces.
- **Citation Rule:** AI responses must return source metadata.
- **Testing:** 80% coverage for backend logic; Critical Path E2E tests for main flows.

## 📄 License

This project is proprietary and confidential.
