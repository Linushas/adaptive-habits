import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    SECRET_KEY: str = os.getenv("SECRET_KEY", None)
    HASH_ALGORITHM: str = "HS256"
    ENV_MODE: str = os.getenv("ENV_MODE", "dev")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")


settings = Settings()
