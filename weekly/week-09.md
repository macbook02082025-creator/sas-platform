# Week 9: Telemetry & Quality Score Dashboard

## Goals
Provide comprehensive observability into how the AI is performing in production, focusing on quality, cost, and latency.

## Technical Tasks

### 1. Telemetry & Logging
*   **Data Capture:** Log every interaction to the Postgres database.
*   **Fields:** Include timestamp, tenant ID, skill ID, raw user prompt, injected RAG context, final AI response, latency (ms), and token usage (prompt + completion tokens).
*   **Tracing:** Implement LangSmith or Phoenix in the Python service for deep LLM trace analysis.

### 2. Analytics Aggregation
*   **Backend (NestJS):** Create optimized SQL views or cron jobs to aggregate daily/weekly metrics per skill and per organization.
*   **Metrics:** Calculate "Acceptance Rate" (no HITL escalation), "Hallucination Rate" (failed citation checks), and average cost per query.

### 3. "AI Quality Score" UI
*   **Angular Dashboard:** Build a new Analytics view.
*   **Data Visualization:** Use a charting library (like Chart.js or D3/ECharts via Angular wrappers) to display:
    *   Volume over time (bar charts).
    *   Escalation rate (pie charts).
    *   Average response latency (line graphs).

### 4. User Feedback Loop
*   **SDK Update:** Add "Thumbs Up / Thumbs Down" buttons to the embedded chat widget.
*   **API:** Create endpoints to receive and link this explicit user feedback back to the specific interaction log in the database.

## Deliverables
*   A fully functional Analytics dashboard providing real-time insights into AI performance.
*   The ability to track token usage and calculate costs per tenant.
*   A closed-loop system capturing end-user feedback.