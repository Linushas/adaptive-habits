from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.db import get_session
from app.models import Habit, User
from app.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Habit])
def read_habits(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(Habit).where(Habit.user_id == current_user.id)
    return session.exec(statement).all()
