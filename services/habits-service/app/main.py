from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from app.db import create_db_and_tables
from app.api.v1.endpoints import habits, auth, entries
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan, title="habits-service")

origins = (
    settings.ALLOWED_ORIGINS.split(",")
    if settings.ALLOWED_ORIGINS
    else ["http://localhost:3000"]
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(habits.router, prefix="/api/v1/habits", tags=["habits"])
app.include_router(entries.router, prefix="/api/v1/entries", tags=["entries"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])


@app.get("/")
def read_root():
    return {"message": "Hello!", "docs": "/docs", "version": "v1"}
