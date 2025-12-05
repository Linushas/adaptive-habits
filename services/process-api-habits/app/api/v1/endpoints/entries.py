from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from uuid import UUID
from app.db import get_session
from app.models import HabitEntry, HabitEntryBase, User, HabitEntryUpdate
from app.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[HabitEntry])
def read_habit_entries(
    date: Optional[date] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(HabitEntry).where(HabitEntry.user_id == current_user.id)
    if date:
        statement = statement.where(HabitEntry.log_date == date)
    return session.exec(statement).all()

@router.post("/", response_model=HabitEntry)
def create_habit_entry(
    new_entry: HabitEntryBase,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    entry = HabitEntryBase(**new_entry.model_dump(), user_id=current_user.id)
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry

@router.put("/{id}", response_model=HabitEntry)
def update_habit_entry(
    id: UUID,
    entry_update: HabitEntryUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(HabitEntry).where(HabitEntry.user_id == current_user.id).where(HabitEntry.id == id)
    habit = session.exec(statement).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit entry not found")

    entry_data = entry_update.model_dump(exclude_unset=True)
    for key, value in entry_data.items():
        setattr(habit, key, value)

    session.add(habit)
    session.commit()
    session.refresh(habit)
    return habit
