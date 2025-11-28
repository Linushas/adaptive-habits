from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class Habit(BaseModel):
    name: str
    description: Optional[str] = None
    target_value: int = 1
    frequency: str = "daily"

class HabitResponse(Habit):
    id: UUID
    user_id: UUID

    class Config:
        from_attributes = True
