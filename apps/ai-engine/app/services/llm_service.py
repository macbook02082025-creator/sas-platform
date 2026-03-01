from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.config import settings
from typing import AsyncGenerator

class LLMService:
    def __init__(self):
        self.client = ChatOpenAI(
            api_key=settings.OPENAI_API_KEY,
            model="gpt-4o",
            streaming=True
        )

    async def stream_chat(self, system_prompt: str, user_input: str) -> AsyncGenerator[str, None]:
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_input)
        ]
        
        async for chunk in self.client.astream(messages):
            yield chunk.content

llm_service = LLMService()
