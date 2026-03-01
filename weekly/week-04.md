# Week 4: RAG Implementation (Retrieval-Augmented Generation)

## Goals
Enable the AI to answer questions based on custom knowledge bases by building a robust vector ingestion and retrieval pipeline.

## Technical Tasks

### 1. Vector Database Setup
*   **Infrastructure:** Provision a Vector Database. (Options: Qdrant via Docker, or enable the `pgvector` extension in the existing Postgres database).
*   **Connections:** Connect the Python FastAPI service to the Vector DB.

### 2. Document Ingestion Pipeline
*   **Upload API:** Create endpoints in NestJS to accept file uploads (PDFs, TXT, Markdown).
*   **Processing (Python):** 
    *   **Parsing:** Extract text from uploaded files.
    *   **Chunking:** Split text into semantic chunks (e.g., 500-1000 tokens) using LangChain text splitters.
    *   **Embedding:** Generate vector embeddings for each chunk using an embedding model (e.g., `text-embedding-3-small`).
    *   **Storage:** Store the chunk text, metadata (source file, tenant ID), and vector in the Vector DB.

### 3. Retrieval Logic
*   **Query Processing:** When a user asks a question, embed the user's query.
*   **Similarity Search:** Perform a vector similarity search (k-NN) to find the top `K` most relevant chunks from the Vector DB, respecting tenant isolation.
*   **Context Injection:** Dynamically format the retrieved chunks and inject them into the LLM's system prompt (the `{{context}}` variable from Week 3).

### 4. Knowledge Base UI
*   **Frontend:** Build a "Knowledge Base" tab in the Angular dashboard.
*   **Features:** Allow users to upload files, view processing status, and manage active documents for a specific AI Skill.

## Deliverables
*   Users can upload PDFs/documents via the UI.
*   Documents are automatically chunked, embedded, and saved securely.
*   The AI Engine can answer questions strictly based on the uploaded documents.