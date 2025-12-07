import { HabitEntry, HabitEntryUpdate } from "@/types";
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
