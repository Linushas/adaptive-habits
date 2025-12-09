from typing import List, Optional
from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from uuid import UUID
from app.db import get_session
from app.models import HabitEntry, HabitEntryBase, User, HabitEntryUpdate, HabitTodayEntryBase, HabitTodayEntry, Habit, CalendarHabitEntry
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

@router.get("/today", response_model=List[HabitTodayEntry])
def get_todays_entries(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    todays_entries: List[HabitTodayEntry] = []
    
    habits: List[Habit] = session.exec(select(Habit).where(Habit.user_id == current_user.id)).all()

    for habit in habits:
        statement = select(HabitEntry).where(HabitEntry.habit_id == habit.id, HabitEntry.log_date == today)
        entry: HabitEntry = session.exec(statement).first()
        
        if not entry:
            entry = HabitEntry(
                habit_id=habit.id,
                user_id=current_user.id,
                log_date=today,
                value=0,
                target_snapshot=habit.current_target_value 
            )
            session.add(entry)
            session.commit()
            session.refresh(entry)
        
        today_entry = HabitTodayEntry(**entry.model_dump(), habit=habit)
        todays_entries.append(today_entry)

    return todays_entries


@router.get("/calendar", response_model=List[CalendarHabitEntry])
def get_calendar_entries(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    if not start_date or not end_date:
        return []
    
    calendar_entries: List[CalendarHabitEntry] = []
    
    for i in range(1, (end_date-start_date).days + 1):
        d: date = start_date + timedelta(days=i)
        
        statement = select(HabitEntry).where(
            HabitEntry.user_id == current_user.id, 
            HabitEntry.log_date == d
        )
        entries: List[HabitEntry] = session.exec(statement).all()
        
        if entries:
            total_percentage = 0
            for entry in entries:
                if entry.target_snapshot > 0:
                    total_percentage += (entry.value*100)/entry.target_snapshot
            avg: int = int(total_percentage/len(entries))
            
            calendar_entry: CalendarHabitEntry = CalendarHabitEntry(
                log_date = d,
                completion_percentage = avg
            )
            calendar_entries.append(calendar_entry)
        else:
            calendar_entry: CalendarHabitEntry = CalendarHabitEntry(
                log_date = d,
                completion_percentage = 0
            )
            calendar_entries.append(calendar_entry)
        
    return calendar_entries
