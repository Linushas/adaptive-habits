from dataclasses import dataclass
from typing import List, Optional
from datetime import date
from dataclasses import dataclass


@dataclass
class DataPoint:
    log_date: Optional[date] = None
    # difficulty: Optional[int] = None    # User-inserted value of perceived difficulty (easy, moderate, or hard).
    value: Optional[float] = None
    target: Optional[float] = None


@dataclass
class History:
    data_points: List[DataPoint]

@dataclass
class ControllerState:
    level: float
    trend: float
    target: float
    streak: int


@dataclass
class Params:
    VALUE_INCREASE_CAP: float
    MAX_TARGET_INCREASE: float
    MAX_TARGET_DECREASE: float
    HLT_ALPHA: float
    HLT_BETA: float
    TREND_RESET_COEFFICIENT: float
    TREND_DAMPING: float
    ELASTICITY_ABOVE_INFLECTION_POINT_DAYS: int
    ELASTICITY_ABOVE_SIGMOID_STEEPNESS: float
    ELASTICITY_BELOW_STREAK_THRESHOLD_DAYS: int
    ELASTICITY_ABOVE_MAX: float
    ELASTICITY_ABOVE_MIN: float
    ELASTICITY_BELOW_MAX: float
    ELASTICITY_BELOW_MIN: float
