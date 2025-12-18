import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    ENV_MODE: str = os.getenv("ENV_MODE", "dev")

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///adaptive_habits.db")
    SQLITE_FILENAME: str = os.getenv("SQLITE_FILENAME", "adaptive_habits.db")

    SECRET_KEY: str = os.getenv("SECRET_KEY", None)
    HASH_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 90
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")

    DEFAULT_EMA_ALPHA: float = 0.2
    DEFAULT_TARGET_INCREASE_THRESHOLD: float = 1.0
    DEFAULT_TARGET_DECREASE_THRESHOLD: float = 0.95


settings = Settings()
