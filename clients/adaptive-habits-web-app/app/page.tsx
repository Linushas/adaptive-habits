import HomeDashboard from "@/components/habits/HomeDashboard";
import { getTodaysEntries } from "@/services/entries";
import { HabitEntry } from "@/types";

export default async function Home() {
  return <HomeDashboard />;
}
