import { CalendarHabitEntry, HabitEntry, HabitEntryUpdate } from "@/types";
import { cache } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getTodaysEntries = async (): Promise<HabitEntry[]> => {
    const res = await fetch(`${API_URL}/entries/today`, {
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch habit entries');
    return res.json();
};

export const updateHabitEntry = async (entry: HabitEntryUpdate) => {
  const res = await fetch(`${API_URL}/entries/${entry.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error('Failed to update habit entry');
  return res.json();
};

export const getCalendar = async (): Promise<CalendarHabitEntry[]> => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];

  const res = await fetch(`${API_URL}/entries/calendar?start_date=${startStr}&end_date=${endStr}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch habit entries for calendar');
  return res.json();
}
