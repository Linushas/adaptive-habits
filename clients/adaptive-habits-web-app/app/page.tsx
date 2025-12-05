import { HabitCard } from "@/components/habits/HabitCard";
import { HomeToolBar } from "@/components/habits/HomeToolBar";
import { getHabits } from "@/services/habits";
import { HabitModel } from "@/types/index"

export default async function Home() {
  const habits:HabitModel[] = await getHabits();

  return (
    <div className="bg-bg min-h-full w-full items-center justify-center flex flex-col">
      
        <div className="flex min-w-4xl px-10 p-4 flex-wrap justify-start gap-4">
          <HomeToolBar className="min-w-full" />
        </div>
        {(habits.length == 0) ? (<p className="text-fg-muted">No habits</p>) : (
        <>
          <div className="py-8 flex w-full max-w-4xl p-4 flex-wrap justify-center items-center flex-col">
            
              <div className="flex flex-wrap justify-evenly gap-4">
                {habits.map((habit, index) => (
                  <div key={index} className="contents"> 
                    <HabitCard
                      title={habit.name}
                      value={0}
                      targetValue={habit.current_target_value}
                      unit={habit.unit}
                    />
                  </div>
                ))}
              </div>
            
          </div>
        </>
      )}
    </div>
  );
}
