"use server";

import { CalendarHabitEntry, HabitEntry, HabitEntryUpdate } from "@/types";
import { formatDateForApi } from "@/lib/utils";
import { cookies } from "next/headers";

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

async function getHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  return {
    "Content-Type": "application/json",
    "Cookie": `access_token=${token}`
  };
}

export const getTodaysEntries = async (selectedDate?: Date): Promise<HabitEntry[]> => {
  if(!selectedDate) {
    selectedDate = new Date();
  }

  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/entries/today?selected_date=${formatDateForApi(selectedDate)}`, {
    cache: 'no-store',
    headers: headers,
  });
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error('Failed to fetch habit entries');
  return res.json();
};

export const updateHabitEntry = async (entry: HabitEntryUpdate) => {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/entries/${entry.id}`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(entry),
  });
  if (res.status === 401) throw new Error("Unauthorized");
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

  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/entries/calendar?start_date=${startStr}&end_date=${endStr}`, {
    cache: 'no-store',
    headers: headers,
  });
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error('Failed to fetch habit entries for calendar');
  return res.json();
}
