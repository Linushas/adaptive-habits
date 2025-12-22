from typing import Optional, List, Dict, Any
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel, Relationship, JSON, Column
from pydantic import BaseModel
from datetime import datetime, date, timezone
from app.config import settings
from app.util.flow_state_engine.data_classes import ControllerState, Params


class FrequencyConfig(BaseModel):
    frequency: str = "daily"  # daily / weekly
    weekdays: List[bool] = Field(default_factory=lambda: [True] * 7)


### USER ###
class User(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    username: str = Field(index=True, unique=True)
    hashed_password: str

    is_admin: bool = Field(default=False)


### HABITS ###
class HabitBase(SQLModel):
    name: str
    description: Optional[str] = None
    current_target_value: int = 1
    target_adaption_mode: str = "consent"  # consent / auto / none
    # frequency: str = "daily"
    unit: Optional[str] = None
    frequency_config: Optional[Dict[str, Any]] = Field(
        default_factory=lambda: FrequencyConfig().model_dump(), sa_column=Column(JSON)
    )
    target_system_params: Optional[Dict[str, Any]] = Field(
        default_factory=lambda: Params().model_dump(), sa_column=Column(JSON)
    )


class Habit(HabitBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    entries: List["HabitEntry"] = Relationship(
        back_populates="habit", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )


class HabitUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    target_value: Optional[int] = None
    frequency: Optional[str] = None
    unit: Optional[str] = None


### HABIT ENTRIES ###
class HabitEntryBase(SQLModel):
    habit_id: UUID = Field(foreign_key="habit.id")
    log_date: date
    value: int
    target_snapshot: int
    notes: Optional[str] = None
    latest_ema: Optional[int] = None
    target_state: Optional[Dict[str, Any]] = Field(
        default_factory=lambda: ControllerState().model_dump(), sa_column=Column(JSON)
    )


class HabitEntry(HabitEntryBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    habit: Habit = Relationship(back_populates="entries")


class HabitEntryUpdate(SQLModel):
    log_date: Optional[date] = None
    value: Optional[int] = None
    target_snapshot: Optional[int] = None
    notes: Optional[str] = None
    completed_at: Optional[datetime] = None


class HabitTodayEntry(HabitEntryBase, table=False):
    habit: Habit
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CalendarHabitEntry(BaseModel):
    log_date: date
    completion_percentage: int


class HabitDetails(BaseModel):
    habit: Habit
    snapshots: List[HabitEntry]
