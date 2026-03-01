# Week 7: Playground & Scenario Testing

## Goals
Provide an interactive environment for developers and PMs to test prompts, run A/B tests, and evaluate guardrail effectiveness before deploying to production.

## Technical Tasks

### 1. Interactive Playground UI
*   **Layout:** Build a split-pane or side-by-side view in Angular.
*   **Inputs:** Left side contains system prompt editor, RAG document selector, and simulated user input.
*   **Outputs:** Right side displays the live, streaming AI response.

### 2. Traceability View
*   **Debug Info:** Alongside the AI answer, display exactly *which* document chunks were retrieved, the similarity scores, and which Guardrail policies passed or failed.
*   **Transparency:** Give the prompt engineer full visibility into the "black box."

### 3. Scenario & Regression Testing
*   **Backend:** Create a `TestSuite` and `TestCase` data model.
*   **Features:** Allow users to save specific user inputs and expected outputs as "Scenarios."
*   **Batch Runner:** Build a background worker (Python/Celery or NestJS BullMQ) that can run a suite of 50 scenarios against a new prompt version and generate a pass/fail report based on the Guardrails.

### 4. Version Control for Skills
*   **Logic:** Implement versioning for Skills (e.g., v1.0, v1.1). When a prompt or configuration changes, save it as a new draft. Allow rollback to previous working versions.

## Deliverables
*   A powerful, developer-friendly Playground to iteratively improve AI behavior.
*   The ability to save test cases and automatically evaluate new prompt versions to prevent regressions.