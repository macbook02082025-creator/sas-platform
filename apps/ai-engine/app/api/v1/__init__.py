from fastapi import APIRouter, Body
from fastapi.responses import StreamingResponse
from app.services.llm_service import llm_service

router = APIRouter()

@router.post("/chat")
async def chat(
    system_prompt: str = Body(...),
    user_input: str = Body(...)
):
    return StreamingResponse(
        llm_service.stream_chat(system_prompt, user_input),
        media_type="text/event-stream"
    )
