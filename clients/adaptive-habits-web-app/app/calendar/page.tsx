import CalendarDashboard from "@/components/calendar/CalendarDashboard";
import { getHabits } from "@/services/habits";
import { Habit } from "@/types";
import { Suspense } from "react";

export default async function Calendar() {
  const habits: Habit[] = await getHabits();

  return (
    <div className="bg-bg min-h-full w-full items-center justify-center flex flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <CalendarDashboard habits={habits} />
      </Suspense>
    </div>
  );
}
