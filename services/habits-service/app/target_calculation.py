from typing import List, Optional
from datetime import date
from app.models import HabitEntry
from dataclasses import dataclass
from config import settings


@dataclass
class DataPoint:
    log_date: Optional[date] = None
    value: Optional[float] = None


class Ema:
    def __init__(self, alpha: float):
        self.alpha = alpha
        self.old_value: Optional[float] = None

    def average(self, value: float) -> float:
        if self.old_value is None:
            self.old_value = value
            return value

        new_value = self.old_value + self.alpha * (value - self.old_value)
        self.old_value = new_value
        return new_value


def calculate_next_target(
    history: List[HabitEntry],
    alpha: float = settings.DEFAULT_EMA_ALPHA,
    upper_threshold_factor: float = settings.DEFAULT_TARGET_INCREASE_THRESHOLD,
    lower_threshold_factor: float = settings.DEFAULT_TARGET_DECREASE_THRESHOLD,
) -> int:
    if not history:
        return 0

    ema = Ema(alpha=alpha)
    current = 0.0
    for entry in history:
        current = ema.average(float(entry.value))

    last_target = history[-1].target_snapshot
    if last_target == 0:
        return round(current)

    upper_threshold = last_target * upper_threshold_factor
    lower_threshold = last_target * lower_threshold_factor

    if current > upper_threshold:
        return round(current)
    elif current < lower_threshold:
        return round(current)
    else:
        return last_target
