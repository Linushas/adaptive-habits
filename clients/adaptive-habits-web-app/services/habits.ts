"use server";

import { formatDateForApi } from "@/lib/utils";
import { Habit, HabitDetails, HabitModel } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

async function getHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  return {
    "Content-Type": "application/json",
    Cookie: `access_token=${token}`,
  };
}

export const getHabits = async (): Promise<Habit[]> => {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/habits/`, {
    cache: "no-store",
    headers: headers,
  });
  if (!res.ok) throw new Error("Failed to fetch habits");
  return res.json();
};

export const createHabit = async (habit: HabitModel) => {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/habits/`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(habit),
  });
  if (!res.ok) throw new Error("Failed to create habit");
  return res.json();
};

export const getHabitDetails = async (habitId: string) => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const start = new Date(tomorrow);
  start.setDate(now.getDate() - 30);

  const startStr = formatDateForApi(start);
  const endStr = formatDateForApi(tomorrow);

  const headers = await getHeaders();
  const res = await fetch(
    `${API_URL}/habits/details/${habitId}?start_date=${startStr}&end_date=${endStr}`,
    {
      cache: "no-store",
      headers: headers,
    }
  );

  if (res.status === 401) {
    redirect("/?refresh=true");
  }

  if (!res.ok) throw new Error("Failed to fetch habit details");
  const data = await res.json();
  // console.log(data);
  return data;
};
