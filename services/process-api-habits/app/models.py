from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel
from datetime import datetime, date

### USER ###
class User(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    username: str = Field(index=True, unique=True)
    hashed_password: str

### HABITS ###
class HabitBase(SQLModel):
    name: str
    description: Optional[str] = None
    current_target_value: int = 1
    frequency: str = "daily"
    unit: Optional[str] = None

class Habit(HabitBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class HabitCreate(HabitBase):
    pass

class HabitUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    target_value: Optional[int] = None
    frequency: Optional[str] = None

### HABIT ENTRIES ###
class HabitEntry(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    habit_id: UUID = Field(foreign_key="habit.id")
    log_date: date
    value: int
    target_snapshot: int
    notes: Optional[str] = None
    completed_at: datetime = Field(default_factory=datetime.utcnow)

    # OLD: UNIQUE(habit_id, log_date)

class HabitAuditLog(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    habit_id: UUID = Field(foreign_key="habit.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    previous_target: int
    new_target: int
    reason: str 
