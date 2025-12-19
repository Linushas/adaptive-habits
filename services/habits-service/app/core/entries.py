from typing import List
from datetime import date
from app.models import (
    HabitEntry,
    CalendarHabitEntry,
)

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
