"use server";

import { CalendarHabitEntry, HabitEntry, HabitEntryUpdate } from "@/types";
import { formatDateForApi } from "@/lib/utils";
import { apiClient } from "@/lib/api";

export const getTodaysEntries = async (
  selectedDate?: Date
): Promise<HabitEntry[]> => {
  if (!selectedDate || selectedDate > new Date()) {
    selectedDate = new Date();
    selectedDate.setHours(12, 0, 0, 0);
  }

  const dateStr = formatDateForApi(selectedDate);
  console.log("getTodaysEntries input date:", selectedDate);
  console.log("getTodaysEntries formatted date:", dateStr);
  console.log("Getting entries: " + dateStr);
  return apiClient<HabitEntry[]>("/entries/today", {
    params: {
      selected_date: dateStr,
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
  endDate?: Date,
  habitIds?: string[]
): Promise<CalendarHabitEntry[]> => {
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const monthStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  let startStr = formatDateForApi(monthStartDate);
  let endStr = formatDateForApi(monthEndDate);
  if (startDate && endDate) {
    startStr = formatDateForApi(startDate);
    endStr = formatDateForApi(endDate);
  }

  const params: Record<string, string> = {
    start_date: startStr,
    end_date: endStr,
  };

  if (habitIds && habitIds.length > 0) {
    params.habit_ids = habitIds.join(",");
  }

  console.log(
    `Getting calendar entries: FROM ${startStr} TO ${endStr} [Filter: ${params.habit_ids || "ALL"}]`
  );

  console.log("Getting calendar entries: FROM " + startStr + " TO " + endStr);
  return apiClient<CalendarHabitEntry[]>("/entries/calendar", {
    params: params,
    cache: "no-store",
  });
};
