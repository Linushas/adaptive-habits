import CalendarDashboard from "@/components/calendar/CalendarDashboard";
import { getCalendar } from "@/services/entries";
import { CalendarHabitEntry } from "@/types";

export default async function Calendar() {
  const calendar_entries: CalendarHabitEntry[] = await getCalendar();

  return (
    <div className="bg-bg min-h-full w-full items-center justify-center flex flex-col">
      <CalendarDashboard entries={calendar_entries} />
    </div>
  );
}
