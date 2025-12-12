import { CalendarHabitEntry, HabitEntry, HabitEntryUpdate } from "@/types";
import { formatDateForApi } from "@/lib/utils";

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

export const getTodaysEntries = async (selectedDate?: Date): Promise<HabitEntry[]> => {
  if(!selectedDate) {
    selectedDate = new Date();
  }

  const res = await fetch(`${API_URL}/entries/today?selected_date=${formatDateForApi(selectedDate)}`, {
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

export const getCalendar = async (startDate?: Date, endDate?: Date): Promise<CalendarHabitEntry[]> => {
  const now = new Date();
  const monthStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  let startStr = formatDateForApi(monthStartDate);
  let endStr = formatDateForApi(monthEndDate);
  if(startDate && endDate) {
    startStr = formatDateForApi(startDate);
    endStr = formatDateForApi(endDate);
  }

  const res = await fetch(`${API_URL}/entries/calendar?start_date=${startStr}&end_date=${endStr}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch habit entries for calendar');
  return res.json();
}
