import HomeDashboard from "@/components/habits/HomeDashboard";
import { getTodaysEntries } from "@/services/entries";
import { HabitEntry } from "@/types";

export default async function Home() {
  const todays_entries: HabitEntry[] = await getTodaysEntries();

  return (
    <HomeDashboard entries={todays_entries} />
  );
}
