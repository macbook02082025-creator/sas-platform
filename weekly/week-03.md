# Week 3: AI Service Scaffold & LLM Connection

## Goals
<span style="color:red">Initialize the Python-based AI engine, connect it to Large Language Models (LLMs), and build the system that manages dynamic prompts and AI skills.</span>

## Technical Tasks

### 1. Python FastAPI Scaffold
*   <span style="color:red">**Action:** Set up a new FastAPI microservice within the repository.</span>
*   <span style="color:red">**Environment:** Configure dependency management via requirements.txt.</span>
*   <span style="color:red">**Inter-service Comms:** Configure secure internal communication between NestJS and FastAPI.</span>

### 2. LLM Integration
*   <span style="color:red">**Framework:** Integrate LangChain for orchestration.</span>
*   <span style="color:red">**Providers:** Build wrapper classes for OpenAI API (default GPT-4).</span>
*   <span style="color:red">**Testing:** Create internal endpoints to test raw LLM generations.</span>

### 3. "AI Skills" Data Model
*   <span style="color:red">**Backend (NestJS):** Create the `Skill` entity and associated CRUD logic.</span>
*   <span style="color:red">**Properties:** Skills now contain Name, Description, System Prompt, and Model configuration.</span>

### 4. Prompt Templating Engine
*   <span style="color:red">**Engine:** Build a templating system where users can define variables in their prompts.</span>
*   <span style="color:red">**Frontend UI:** Build an Angular form to create and edit AI Skills, including a premium text editor.</span>

## Deliverables
*   <span style="color:red">A running Python FastAPI service capable of talking to OpenAI.</span>
*   <span style="color:red">Backend APIs ready for AI Skill management.</span>
*   <span style="color:red">Premium Prompt Editor UI in the dashboard.</span>
