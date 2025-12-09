import os
from sqlmodel import SQLModel, create_engine, Session

sqlite_file_name = "adaptive_habits.db"
sqlite_url = os.getenv("DATABASE_URL", "sqlite:///adaptive_habits.db")

engine = create_engine(
    sqlite_url, 
    connect_args={"check_same_thread": False}
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
