from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Engine"
    OPENAI_API_KEY: str | None = None
    GEMINI_API_KEY: str | None = None
    DATABASE_URL: str | None = None
    
    # LangSmith Tracing
    LANGSMITH_TRACING: str = "false"
    LANGSMITH_API_KEY: str | None = None
    LANGSMITH_PROJECT: str = "sas-platform"
    
    # Enable mock mode if no API key is provided
    @property
    def MOCK_MODE(self) -> bool:
        has_openai = self.OPENAI_API_KEY and self.OPENAI_API_KEY != "your-key-here"
        has_gemini = self.GEMINI_API_KEY and self.GEMINI_API_KEY != "your-key-here"
        return not (has_openai or has_gemini)
    
    class Config:
        env_file = "../../.env"
        extra = "ignore"

settings = Settings()
