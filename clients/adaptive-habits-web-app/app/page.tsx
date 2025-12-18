import HomeDashboard from "@/components/habits/HomeDashboard";
import { getTodaysEntries } from "@/services/entries";
import { HabitEntry } from "@/types";

export default async function Home() {
  console.log("Getting todays entries: " + new Date());
  const todays_entries: HabitEntry[] = await getTodaysEntries(new Date());

  return (
    <HomeDashboard
      key={JSON.stringify(todays_entries)}
      entries={todays_entries}
    />
  );
}
