from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from uuid import UUID
from app.db import get_session
from app.models import Habit, User, HabitCreate, HabitUpdate
from app.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[Habit])
def read_habits(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = select(Habit).where(Habit.user_id == current_user.id)
    return session.exec(statement).all()


@router.get("/{id}", response_model=Habit)
def read_habit(
    id: UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = (
        select(Habit).where(Habit.user_id == current_user.id).where(Habit.id == id)
    )
    habit = session.exec(statement).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit


@router.delete("/{id}", response_model=Habit)
def delete_habit(
    id: UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = (
        select(Habit).where(Habit.user_id == current_user.id).where(Habit.id == id)
    )
    habit = session.exec(statement).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    session.delete(habit)
    session.commit()
    return habit


@router.post("/", response_model=Habit)
def create_habit(
    new_habit: HabitCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    habit = Habit(**new_habit.model_dump(), user_id=current_user.id)
    session.add(habit)
    session.commit()
    session.refresh(habit)
    return habit


@router.put("/{id}", response_model=Habit)
def update_habit(
    id: UUID,
    habit_update: HabitUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = (
        select(Habit).where(Habit.user_id == current_user.id).where(Habit.id == id)
    )
    habit = session.exec(statement).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    habit_data = habit_update.model_dump(exclude_unset=True)
    for key, value in habit_data.items():
        setattr(habit, key, value)

    session.add(habit)
    session.commit()
    session.refresh(habit)
    return habit
