import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    DISABLE_AUTH: bool = os.getenv("DISABLE_AUTH", "False").lower() == "true"

settings = Settings()
