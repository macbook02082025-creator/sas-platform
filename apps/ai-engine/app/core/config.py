from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Engine"
    OPENAI_API_KEY: str | None = None
    DATABASE_URL: str | None = None
    
    class Config:
        env_file = ".env"

settings = Settings()
