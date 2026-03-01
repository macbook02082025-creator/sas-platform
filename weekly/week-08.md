# Week 8: Human-in-the-Loop (HITL) Queue

## Goals
Enable workflows for high-risk domains where AI responses must be reviewed, approved, or corrected by a human before reaching the end-user.

## Technical Tasks

### 1. The Review Queue System
*   **Architecture:** Integrate Redis to manage an active queue of flagged messages.
*   **Trigger:** If an AI response fails a "Confidence Threshold" policy (from Week 6), intercept the response, send the user a holding message ("Let me check with an agent..."), and push the draft to the queue.

### 2. Reviewer Dashboard (Angular)
*   **UI:** Build a real-time queue interface.
*   **Features:** Reviewers can select a pending ticket, view the user's question, the RAG context, and the AI's proposed answer.
*   **Actions:** Implement buttons to `Approve`, `Reject`, or `Edit & Send` the response.

### 3. Asynchronous Communication
*   **Webhooks:** Implement a webhook system in NestJS to notify external systems (e.g., Slack, or the embedding SDK) when a human has approved an answer.
*   **SDK Update:** Update the JS SDK to handle long-polling or WebSocket events to receive the human-approved message asynchronously.

### 4. Feedback Loop
*   **Data Storage:** Save human edits and rejections.
*   **Future Use:** Structure this data so it can be exported later for fine-tuning models or automatically improving the system prompts.

## Deliverables
*   A complete workflow for intercepting uncertain AI answers.
*   A dedicated UI for human reviewers to override AI decisions.
*   Asynchronous delivery of approved answers to the end-user.