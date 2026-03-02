from fastapi import APIRouter, Body, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.services.llm_service import llm_service
from app.services.knowledge_service import knowledge_service

router = APIRouter()

class DeleteRequest(BaseModel):
    tenant_id: str
    file_name: str

@router.post("/chat")
async def chat(
    tenant_id: str = Body(...),
    system_prompt: str = Body(...),
    user_input: str = Body(...),
    rag_enabled: bool = Body(False)
):
    if rag_enabled:
        return StreamingResponse(
            llm_service.stream_validated_chat(tenant_id, system_prompt, user_input),
            media_type="text/event-stream"
        )
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
    result = await knowledge_service.upload(tenant_id, file.filename, content)
    return result

@router.post("/knowledge/delete")
async def delete_document(request: DeleteRequest):
    result = await knowledge_service.delete(request.tenant_id, request.file_name)
    return result
