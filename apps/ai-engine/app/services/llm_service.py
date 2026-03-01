from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.config import settings
from typing import AsyncGenerator
import asyncio
from .knowledge_service import knowledge_service

class LLMService:
    def __init__(self):
        if settings.MOCK_MODE:
            print("AI Engine running in MOCK MODE (No Valid API Keys)")
            self.client = None
        elif settings.GEMINI_API_KEY:
            print("AI Engine initialized with GEMINI (Google)")
            self.client = ChatGoogleGenerativeAI(
                google_api_key=settings.GEMINI_API_KEY,
                model="gemini-pro",
                streaming=True
            )
        else:
            print("AI Engine initialized with OPENAI")
            self.client = ChatOpenAI(
                api_key=settings.OPENAI_API_KEY,
                model="gpt-4o",
                streaming=True
            )

    async def stream_chat(self, system_prompt: str, user_input: str) -> AsyncGenerator[str, None]:
        if settings.MOCK_MODE:
            mock_text = f"[MOCK RESPONSE] Analysis complete. Based on protocol '{system_prompt[:20]}...', I have processed your request: '{user_input}'."
            for word in mock_text.split():
                yield word + " "
                await asyncio.sleep(0.05)
            return

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_input)
        ]
        
        async for chunk in self.client.astream(messages):
            yield chunk.content

    async def stream_validated_chat(self, tenant_id: str, system_prompt: str, user_input: str) -> AsyncGenerator[str, None]:
        if settings.MOCK_MODE:
            mock_text = f"[MOCK RAG] I've searched the vault for tenant {tenant_id}. No specific documents were found in mock mode, but based on the system prompt '{system_prompt[:20]}...', here is a simulated answer."
            for word in mock_text.split():
                yield word + " "
                await asyncio.sleep(0.05)
            return

        # 1. Retrieve context
        docs = knowledge_service.retrieve(user_input, tenant_id)
        context = "\n".join([doc.page_content for doc in docs])
        sources = ", ".join(list(set([doc.metadata.get("source", "unknown") for doc in docs])))

        # 2. Augmented Prompt
        rag_prompt = f"""You are a specialized AI Skill assistant.
Use the following context to answer the user request. 
If the information is not in the context, clearly state that you do not know.
Do not hallucinate or use outside knowledge unless specifically instructed to do so by the core identity.

Core Identity: {system_prompt}

Context:
{context}

Sources found: {sources}
"""
        
        messages = [
            SystemMessage(content=rag_prompt),
            HumanMessage(content=user_input)
        ]

        async for chunk in self.client.astream(messages):
            yield chunk.content

llm_service = LLMService()
