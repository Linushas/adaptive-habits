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
    alpha: float


@dataclass
class ControllerState:
    level: float
    trend: float
    target: float
    streak: int
