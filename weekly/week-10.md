# Week 10: Dynamic Server-Driven UI & Advanced SDK

## Goals
Move beyond simple text chat by allowing the AI to generate actual, functional UI components (Server-Driven UI) that render dynamically in the frontend.

## Technical Tasks

### 1. Structured Output from LLMs
*   **Python Engine:** Configure the LLM to output structured JSON (using OpenAI's JSON mode or function calling) instead of markdown text when appropriate.
*   **Schema:** Define strict JSON schemas for UI elements (e.g., `{ "type": "form", "fields": [...] }` or `{ "type": "chart", "data": [...] }`).

### 2. Angular Dynamic Rendering Engine
*   **Component Factory:** Build an Angular structural directive or component that can take the JSON payload from the AI and dynamically instantiate the corresponding Angular components (e.g., rendering an Angular Material form based on JSON).

### 3. Advanced SDK Features
*   **Custom Rendering Hooks:** Update the JS SDK to emit events when it receives a UI JSON block, allowing the host application to decide how to render that specific block.
*   **Inline Suggestions:** Add support for "autocomplete" style ghost-text suggestions (useful for email drafting skills).

### 4. Copilot Side-Panel
*   **Web Component:** Build an expanded version of the SDK widget that acts as a persistent side-panel, capable of reading the host page's context (e.g., scraping the current page's DOM) to provide contextual help.

## Deliverables
*   The AI can generate forms, buttons, and charts, not just text.
*   The Angular app and SDK can safely render these dynamic components.
*   A powerful Copilot widget that understands the context of the website it is embedded in.