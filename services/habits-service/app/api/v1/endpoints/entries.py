from typing import List, Optional, Dict
from datetime import date, timedelta, timezone, datetime
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
)
from app.auth import get_current_user
from app.target_calculation import calculate_next_target

router = APIRouter()


def get_today() -> date:
    time_zone = timezone(timedelta(hours=1))
    return datetime.now(time_zone).date()


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
    # entry = HabitEntryBase(**new_entry.model_dump(), user_id=current_user.id)
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

    session.add(habit_entry)
    session.commit()
    session.refresh(habit_entry)

    ### Target adaption
    statement = (
        select(Habit)
        .where(Habit.user_id == current_user.id)
        .where(Habit.id == habit_entry.habit_id)
    )
    habit: Habit = session.exec(statement).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    statement = (
        select(HabitEntry)
        .where(
            HabitEntry.user_id == current_user.id,
            HabitEntry.habit_id == habit_entry.habit_id,
            HabitEntry.log_date <= get_today(),
            HabitEntry.log_date >= (habit_entry.log_date - timedelta(days=30)),
        )
        .order_by(HabitEntry.log_date)
    )

    history: List[HabitEntry] = session.exec(statement).all()
    next_target: int = calculate_next_target(history)

    if habit.current_target_value != next_target and next_target:
        habit.current_target_value = next_target
        session.add(habit)
        session.commit()

        tomorrow = get_today() + timedelta(1)
        statement = select(HabitEntry).where(
            HabitEntry.habit_id == habit_entry.habit_id, HabitEntry.log_date == tomorrow
        )
        entry: HabitEntry = session.exec(statement).first()
        if entry:
            entry.target_snapshot = next_target
            session.add(entry)
            session.commit()
        else:
            entry = HabitEntry(
                habit_id=habit_entry.habit_id,
                log_date=tomorrow,
                target_snapshot=next_target,
                value=0,
                user_id=current_user.id,
            )
            session.add(entry)
            session.commit()

    return habit_entry


@router.get("/today", response_model=List[HabitTodayEntry])
def get_todays_entries(
    selected_date: Optional[date] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    today = get_today()
    if selected_date:
        today: date = selected_date

    # print(today)

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
        if habit.created_at.date() > today:
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


def calendar_entry_from_entries(
    entries: List[HabitEntry], d: date
) -> CalendarHabitEntry:
    if entries:
        total_percentage = 0
        for entry in entries:
            if entry.target_snapshot > 0:
                total_percentage += (entry.value * 100) / entry.target_snapshot
        avg: int = int(total_percentage / len(entries))

        calendar_entry: CalendarHabitEntry = CalendarHabitEntry(
            log_date=d, completion_percentage=avg
        )
        return calendar_entry
    else:
        calendar_entry: CalendarHabitEntry = CalendarHabitEntry(
            log_date=d, completion_percentage=0
        )
        return calendar_entry
