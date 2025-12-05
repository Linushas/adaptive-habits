'use server'

import { revalidatePath } from "next/cache";
import { createHabit } from "@/services/habits";
import { HabitModel } from "@/types";

export async function addHabitAction(habit: HabitModel) {
    await createHabit(habit);
    revalidatePath('/');
}
