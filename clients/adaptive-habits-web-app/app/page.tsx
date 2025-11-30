import { HabitCard } from "@/components/habits/HabitCard";

export default function Home() {
  return (
    <div className="bg-bg min-h-screen flex items-center justify-center">
      <div className="flex flex-wrap flex-row justify-center p-4 gap-4">
        <HabitCard 
          title="Drink Water" 
          value={5} 
          targetValue={8} 
          unit="glasses"
          className=""
        />
        <HabitCard 
          title="Work out" 
          value={60} 
          targetValue={60} 
          unit="minutes"
          className=""
        />
        <HabitCard 
          title="Read" 
          value={0} 
          targetValue={30} 
          unit="pages"
          className=""
        />
      </div>
    </div>
  );
}
