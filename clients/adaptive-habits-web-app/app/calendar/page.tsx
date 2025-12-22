import CalendarDashboard from "@/components/calendar/CalendarDashboard";
import { getCalendar } from "@/services/entries";
import { getHabits } from "@/services/habits";
import { CalendarHabitEntry, Habit } from "@/types";

export default async function Calendar() {
  const calendarEntries: CalendarHabitEntry[] = await getCalendar();
  const habits: Habit[] = await getHabits();

  return (
    <div className="bg-bg min-h-full w-full items-center justify-center flex flex-col">
      <CalendarDashboard entries={calendarEntries} habits={habits} />
    </div>
  );
}
