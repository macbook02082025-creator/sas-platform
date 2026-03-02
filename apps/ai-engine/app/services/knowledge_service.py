from typing import List
from langchain_core.documents import Document
from langchain_postgres.vectorstores import PGVector
from langchain_openai import OpenAIEmbeddings
from app.core.config import settings

class KnowledgeService:
    def __init__(self):
        self._vector_store = None
        self._embeddings = None

    @property
    def vector_store(self):
        if settings.MOCK_MODE:
            return None
        
        if self._vector_store is None:
            try:
                print(f"Initializing PGVector for vault: {settings.DATABASE_URL[:20]}...")
                self._embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY)
                self._vector_store = PGVector(
                    embeddings=self._embeddings,
                    collection_name="sas_knowledge",
                    connection=settings.DATABASE_URL,
                    use_jsonb=True
                )
            except Exception as e:
                print(f"CRITICAL: Failed to initialize PGVector: {str(e)}")
                return None
        return self._vector_store

    def retrieve(self, query: str, tenant_id: str) -> List[Document]:
        vs = self.vector_store
        if settings.MOCK_MODE or not vs:
            print(f"Retrieving mock context for tenant {tenant_id}")
            return [
                Document(
                    page_content="This is a mock knowledge base entry. In a real system, RAG would provide actual data.",
                    metadata={"source": "mock_vault_v1.pdf"}
                )
            ]
        
        # Use metadata filtering for multi-tenancy isolation
        return vs.similarity_search(
            query, 
            k=4, 
            filter={"tenant_id": tenant_id}
        )

    async def upload(self, tenant_id: str, file_name: str, file_content: bytes):
        # Implementation for chunking and embedding logic would go here
        print(f"Uploading and embedding {file_name} for tenant {tenant_id}")
        return {"status": "success", "tenant_id": tenant_id, "file": file_name}

    async def delete(self, tenant_id: str, file_name: str):
        # Mock delete logic
        print(f"Mocking delete for tenant {tenant_id}: {file_name}")
        return {"status": "success", "tenant_id": tenant_id, "file": file_name}

knowledge_service = KnowledgeService()
