import { HabitCard } from "@/components/habits/HabitCard";

const habits = [
  {title: 'Read', value: 0, targetValue: 30, unit: "pages"},
  {title: 'Read', value: 0, targetValue: 30, unit: "pages"},
  {title: 'Read', value: 0, targetValue: 30, unit: "pages"},
  {title: 'Read', value: 0, targetValue: 30, unit: "pages"},
  {title: 'Read', value: 0, targetValue: 30, unit: "pages"},
  {title: 'Read', value: 0, targetValue: 30, unit: "pages"},
  {title: 'Read', value: 0, targetValue: 30, unit: "pages"},
]

export default function Home() {
  return (
    <div className="bg-bg min-h-screen flex items-center justify-center">
      <div className="flex flex-wrap flex-row justify-center p-4 gap-4">
        {habits.map((habit) => (
          <li key={habits.indexOf(habit)}>
            <HabitCard 
              title={habit.title}
              value={habit.value}
              targetValue={habit.targetValue}
              unit={habit.unit}
            />
          </li>
        ))}
      </div>
    </div>
  );
}
