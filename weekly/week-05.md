# Week 5: Streaming Responses & SDK V0

## Goals
Provide a modern, low-latency user experience by implementing Server-Sent Events (SSE) or WebSockets to stream AI responses, and build the first version of the embeddable SDK.

## Technical Tasks

### 1. Streaming Infrastructure
*   **Python (FastAPI):** Refactor LLM calls to use streaming generators. Yield chunks of text as they arrive from the LLM provider.
*   **Node.js (NestJS):** Set up a proxy that can forward streaming responses (SSE) from the Python service to the end client, while simultaneously logging the full response asynchronously.

### 2. Angular Streaming Client
*   **Service:** Implement an Angular service using RxJS to consume SSE endpoints.
*   **UI:** Build a chat interface component that updates reactively as chunks arrive, rendering Markdown to HTML on the fly.

### 3. Embeddable JS SDK (V0)
*   **Architecture:** Create a framework-agnostic vanilla TypeScript package (`@hallucination-lab/sdk`).
*   **Core Logic:** Implement the API client that handles authentication (via environment API keys) and connects to the streaming endpoint.
*   **Web Component:** Build a basic `<ai-chat-widget>` Web Component that developers can drop into any HTML page.

### 4. SDK Integration Testing
*   **Demo Page:** Create a plain HTML page outside the monorepo to test importing the SDK via a `<script>` tag and verifying that it can securely communicate with the backend.

## Deliverables
*   AI responses stream word-by-word to the UI, minimizing perceived latency.
*   A publishable Javascript SDK that allows external websites to query the AI skills created in the dashboard.