import { HabitModel } from "@/types";

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

export const getHabits = async (): Promise<HabitModel[]> => {
  const res = await fetch(`${API_URL}/habits`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch habits');
  return res.json();
};

export const createHabit = async (habit: HabitModel) => {
  const res = await fetch(`${API_URL}/habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(habit),
  });
  if (!res.ok) throw new Error('Failed to create habit');
  return res.json();
};
