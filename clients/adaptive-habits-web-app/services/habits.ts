"use server";

import { apiClient } from "@/lib/api";
import { formatDateForApi, getToday } from "@/lib/utils";
import { Habit, HabitDetails, HabitModel } from "@/types";

export const getHabits = async (): Promise<Habit[]> => {
  return apiClient<Habit[]>("/habits/", {
    cache: "no-store",
  });
};

export const createHabit = async (habit: HabitModel) => {
  return apiClient<HabitModel[]>("/habits/", {
    method: "POST",
    body: JSON.stringify(habit),
  });
};

export const deleteHabit = async (habitId: string) => {
  return apiClient<void>(`/habits/${habitId}`, {
    method: "DELETE",
    cache: "no-store",
  });
};

export const getHabitDetails = async (
  habitId: string
): Promise<HabitDetails> => {
  const now = getToday();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const start = new Date(tomorrow);
  start.setDate(now.getDate() - 30);

  const startStr = formatDateForApi(start);
  const endStr = formatDateForApi(tomorrow);

  return await apiClient<HabitDetails>(`/habits/details/${habitId}`, {
    params: {
      start_date: startStr,
      end_date: endStr,
    },
    cache: "no-store",
  });
};
