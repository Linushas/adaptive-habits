from fastapi import HTTPException
from sqlmodel import Session, select
from app.models import (
    Habit,
)

def get_habit(session: Session, user_id: str, habit_id: str) -> Habit:
    statement = (
        select(Habit).where(Habit.user_id == user_id).where(Habit.id == habit_id)
    )
    habit: Habit = session.exec(statement).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit