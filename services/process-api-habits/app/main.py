from fastapi import FastAPI
from app.api.v1.endpoints import habits

app = FastAPI(title="process-api-habits")

app.include_router(habits.router, prefix="/api/v1/habits", tags=["habits"])

@app.get("/")
def read_root():
    return {
        "message": "Hello!",
        "docs": "/docs",
        "version": "v1"
    }
