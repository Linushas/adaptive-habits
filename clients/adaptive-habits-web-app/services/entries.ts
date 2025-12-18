"use server";

import { CalendarHabitEntry, HabitEntry, HabitEntryUpdate } from "@/types";
import { formatDateForApi } from "@/lib/utils";
import { apiClient } from "@/lib/api";

export const getTodaysEntries = async (
  selectedDate?: Date
): Promise<HabitEntry[]> => {
  if (!selectedDate) {
    selectedDate = new Date();
  }

  return apiClient<HabitEntry[]>("/entries/today", {
    params: {
      selected_date: formatDateForApi(selectedDate),
    },
    cache: "no-store",
  });
};

export const updateHabitEntry = async (entry: HabitEntryUpdate) => {
  return apiClient(`/entries/${entry.id}`, {
    method: "PUT",
    cache: "no-store",
    body: JSON.stringify(entry),
  });
};

export const getCalendar = async (
  startDate?: Date,
  endDate?: Date
): Promise<CalendarHabitEntry[]> => {
  const now =  new Date();
  const monthStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  let startStr = formatDateForApi(monthStartDate);
  let endStr = formatDateForApi(monthEndDate);
  if (startDate && endDate) {
    startStr = formatDateForApi(startDate);
    endStr = formatDateForApi(endDate);
  }

  return apiClient<CalendarHabitEntry[]>("/entries/calendar", {
    params: {
      start_date: startStr,
      end_date: endStr,
    },
    cache: "no-store",
  });
};
