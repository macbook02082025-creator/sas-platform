# Week 6: The Policy Engine & Guardrails

## Goals
Build the core differentiator of the platform: the mechanisms that prevent hallucinations, enforce rules, and ensure AI reliability.

## Technical Tasks

### 1. Declarative Rule Engine
*   **Backend Model:** Allow users to define "Policies" for a skill.
*   **Policy Types:**
    *   *Citation Required:* The answer MUST be derived from the RAG context.
    *   *Banned Topics/Words:* Regex or semantic blocks against certain subjects.
    *   *Tone/Format Check:* Must output valid JSON or maintain a professional tone.

### 2. Interceptor Pipeline (Python)
*   **Pre-generation:** Run inputs against prompt-injection filters or PII (Personally Identifiable Information) scrubbers.
*   **Post-generation:** 
    *   Implement an evaluation step. Use a smaller, faster LLM (or deterministic logic) to verify the output against the defined policies.
    *   *Citation Checker:* Verify that claims made in the answer actually exist in the retrieved text chunks.

### 3. Fallback Mechanisms
*   **Logic:** If the validation step fails (e.g., the model hallucinates a fact not in the context), halt the stream.
*   **Action:** Trigger a predefined fallback response (e.g., "I'm sorry, I don't have enough verified information to answer that.") or escalate to Human-in-the-Loop.

### 4. Guardrail Configuration UI
*   **Angular:** Build a "Guardrails & Safety" tab in the Skill configuration view.
*   **UX:** Use toggle switches and text inputs to easily enable and configure these policies without writing code.

## Deliverables
*   The system actively blocks or flags answers that violate rules or lack contextual evidence.
*   Users can easily toggle safety features on/off via the dashboard.