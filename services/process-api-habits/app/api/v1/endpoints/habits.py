from fastapi import APIRouter, Depends, HTTPException
from typing import List
from supabase import Client
from app.db import get_supabase
from app.schemas import HabitResponse, Habit

router = APIRouter()

@router.get("/", response_model=List[HabitResponse])
def read_habits(db: Client = Depends(get_supabase)):
    response = db.table("habits").select("*").execute()
    return response.data

@router.post("/", response_model=HabitResponse)
def create_habit(habit: Habit, db: Client = Depends(get_supabase)):
    habit_data = habit.model_dump()
    response = db.table("habits").insert(habit_data).execute()
    return response.data[0]