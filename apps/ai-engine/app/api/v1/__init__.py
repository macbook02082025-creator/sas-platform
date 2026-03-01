from fastapi import APIRouter, Body, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from app.services.llm_service import llm_service
from app.services.knowledge_service import knowledge_service

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

@router.post("/knowledge/upload")
async def upload_document(
    tenant_id: str = Form(...),
    file: UploadFile = File(...)
):
    content = await file.read()
@router.post("/knowledge/delete")
async def delete_document(
    tenant_id: str = Body(...),
    file_name: str = Body(...)
):
    result = await knowledge_service.delete(tenant_id, file_name)
    return result
