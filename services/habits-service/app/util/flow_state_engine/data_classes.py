from dataclasses import dataclass
from typing import Optional
from datetime import date
from pydantic import BaseModel, Field


class DataPoint(BaseModel):
    log_date: Optional[date] = None
    # difficulty: Optional[int] = None    # User-inserted value of perceived difficulty (easy, moderate, or hard).
    value: Optional[float] = None
    target: Optional[float] = None


class History(BaseModel):
    data_points: list[DataPoint] = Field(default_factory=list)


class ControllerState(BaseModel):
    level: float = 0.0
    trend: float = 0.0
    target: float = 0.0
    streak: int = 0


class Params(BaseModel):
    VALUE_INCREASE_CAP: float = 1.5
    MAX_TARGET_INCREASE: float = 1.1
    MAX_TARGET_DECREASE: float = 0.9
    HLT_ALPHA: float = 0.1
    HLT_BETA: float = 0.1
    TREND_RESET_COEFFICIENT: float = 0.95
    TREND_DAMPING: float = 0.5
    ELASTICITY_ABOVE_INFLECTION_POINT_DAYS: int = 14
    ELASTICITY_ABOVE_SIGMOID_STEEPNESS: float = 0.3
    ELASTICITY_BELOW_STREAK_THRESHOLD_DAYS: int = 21
    ELASTICITY_ABOVE_MAX: float = 0.4
    ELASTICITY_ABOVE_MIN: float = 0.05
    ELASTICITY_BELOW_MAX: float = 0.9
    ELASTICITY_BELOW_MIN: float = 0.2
