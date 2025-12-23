from typing import List, Optional, Dict
import math
from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from uuid import UUID
from app.db import get_session
from app.models import (
    HabitEntry,
    HabitEntryBase,
    User,
    HabitEntryUpdate,
    HabitTodayEntry,
    Habit,
    CalendarHabitEntry,
    FrequencyConfig,
)
from app.auth import get_current_user
from app.util.flow_state_engine.target_difficulty_controller import (
    TargetDifficultyController,
)
from app.util.flow_state_engine.data_classes import ControllerState
from app.util.flow_state_engine.data_classes import DataPoint, History
from app.core.habits import get_habit
from app.core.entries import calendar_entry_from_entries

router = APIRouter()


@router.get("/", response_model=List[HabitEntry])
def read_habit_entries(
    date: Optional[date] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = select(HabitEntry).where(HabitEntry.user_id == current_user.id)
    if date:
        statement = statement.where(HabitEntry.log_date == date)
    return session.exec(statement).all()


@router.post("/", response_model=HabitEntry)
def create_habit_entry(
    new_entry: HabitEntryBase,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    entry = HabitEntry(**new_entry.model_dump(), user_id=current_user.id)
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry


@router.put("/{id}", response_model=HabitEntry)
def update_habit_entry(
    id: UUID,
    entry_update: HabitEntryUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = (
        select(HabitEntry)
        .where(HabitEntry.user_id == current_user.id)
        .where(HabitEntry.id == id)
    )
    habit_entry: HabitEntry = session.exec(statement).first()
    if not habit_entry:
        raise HTTPException(status_code=404, detail="Habit entry not found")

    entry_data = entry_update.model_dump(exclude_unset=True)
    for key, value in entry_data.items():
        setattr(habit_entry, key, value)

    # session.add(habit_entry)
    # session.commit()

    if(habit_entry.target_snapshot == 1): 
        session.add(habit_entry)
        session.commit()
        session.refresh(habit_entry)
        return habit_entry

    ### Target adaption
    habit: Habit = get_habit(session, current_user.id, habit_entry.habit_id)
    


    statement = (
        select(HabitEntry)
        .where(
            HabitEntry.user_id == current_user.id,
            HabitEntry.habit_id == habit_entry.habit_id,
            HabitEntry.log_date < habit_entry.log_date,
        )
        .order_by(HabitEntry.log_date.desc())
    )
    yesterdays_entry = session.exec(statement).first()
    
    if yesterdays_entry and yesterdays_entry.target_state:
        yesterdays_state = ControllerState(**yesterdays_entry.target_state)
    else:
        yesterdays_state = ControllerState(
            level=habit_entry.value, 
            target=habit_entry.target_snapshot
        )

    target_state: ControllerState = TargetDifficultyController.next_state(yesterdays_state, habit_entry.value)
    habit_entry.target_state = target_state.model_dump()
    
    
    session.add(habit_entry)
    session.commit()
    
    
    next_target: int = math.ceil(target_state.target)
    
    if habit.current_target_value != next_target and next_target:
        habit.current_target_value = next_target
        session.add(habit)
        session.commit()

        today = date.today()
        freq_config: FrequencyConfig = (
            habit.frequency_config
            if habit.frequency_config
            else FrequencyConfig().model_dump()
        )
        weekdays = freq_config.get("weekdays", [True] * 7)
        next_date = today
        for i in range(1,7):
            if weekdays[today.weekday()]:
                next_date = today + timedelta(i)
                break
        if next_date == today:
            session.refresh(habit_entry)
            return habit_entry
        
        statement = select(HabitEntry).where(
            HabitEntry.habit_id == habit_entry.habit_id, HabitEntry.log_date == next_date
        )
        entry: HabitEntry = session.exec(statement).first()
        if entry:
            entry.target_snapshot = next_target
            session.add(entry)
            session.commit()
        else:
            entry = HabitEntry(
                habit_id=habit_entry.habit_id,
                log_date=next_date,
                target_snapshot=next_target,
                value=0,
                user_id=current_user.id,
            )
            session.add(entry)
            session.commit()

    session.refresh(habit_entry)
    return habit_entry


@router.get("/today", response_model=List[HabitTodayEntry])
def get_todays_entries(
    selected_date: Optional[date] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    today = date.today()
    if selected_date:
        today: date = selected_date

    todays_entries: List[HabitTodayEntry] = []

    habits: List[Habit] = session.exec(
        select(Habit).where(Habit.user_id == current_user.id)
    ).all()

    statement = select(HabitEntry).where(
        HabitEntry.user_id == current_user.id, HabitEntry.log_date == today
    )
    all_entries: List[HabitEntry] = session.exec(statement).all()
    entries_map: Dict[UUID, HabitEntry] = {
        entry.habit_id: entry for entry in all_entries
    }

    for habit in habits:
        freq_config: FrequencyConfig = (
            habit.frequency_config
            if habit.frequency_config
            else FrequencyConfig().model_dump()
        )
        weekdays = freq_config.get("weekdays", [True] * 7)
        if habit.created_at.date() > today or not weekdays[today.weekday()]:
            continue

        entry = entries_map.get(habit.id)

        if not entry:
            entry = HabitEntry(
                habit_id=habit.id,
                user_id=current_user.id,
                log_date=today,
                value=0,
                target_snapshot=habit.current_target_value,
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
    habit_ids: Optional[str] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    calendar_entries: List[CalendarHabitEntry] = []

    if not start_date or not end_date:
        return []

    statement = select(HabitEntry).where(
        HabitEntry.user_id == current_user.id,
        HabitEntry.log_date >= start_date,
        HabitEntry.log_date <= end_date,
    )
    if habit_ids:
        print(habit_ids)
        try:
            ids_list = [
                UUID(id_str.strip())
                for id_str in habit_ids.split(",")
                if id_str.strip()
            ]
            if ids_list:
                statement = statement.where(HabitEntry.habit_id.in_(ids_list))
        except ValueError:
            raise HTTPException(
                status_code=400, detail="Invalid UUID format in habit_ids"
            )
    all_entries: List[HabitEntry] = session.exec(statement).all()

    entries_date_lookup: Dict[date, List[HabitEntry]] = {}
    for entry in all_entries:
        if entry.log_date not in entries_date_lookup:
            entries_date_lookup[entry.log_date] = []
        entries_date_lookup[entry.log_date].append(entry)

    for i in range(0, (end_date - start_date).days + 1):
        d: date = start_date + timedelta(days=i)
        calendar_entries.append(
            calendar_entry_from_entries(entries_date_lookup.get(d, []), d)
        )

    return calendar_entries
