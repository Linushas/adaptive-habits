"use server";

import { HabitModel } from "@/types";
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

export const getHabits = async (): Promise<HabitModel[]> => {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/habits/`, {
    cache: 'no-store',
    headers: headers,
  });
  if (!res.ok) throw new Error('Failed to fetch habits');
  return res.json();
};

export const createHabit = async (habit: HabitModel) => {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/habits/`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(habit),
  });
  if (!res.ok) throw new Error('Failed to create habit');
  return res.json();
};
