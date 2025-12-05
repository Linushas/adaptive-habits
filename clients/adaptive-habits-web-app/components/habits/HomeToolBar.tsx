import { HabitModel } from "@/types";
import { Button } from "../ui/button";
import { addHabitAction } from "@/app/actions";

interface ToolBarProps {
    className?: string,
}

export function HomeToolBar({ className }: ToolBarProps) {
    const handleNewHabit = async () => {
        const newHabit: HabitModel = {
            name: "My New Habit",
            current_target_value: 12,
        };

        try {
            await addHabitAction(newHabit); 
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className={`${className} pt-32 flex justify-between`}>
            <Button variant={"secondary"}>
                Today *
            </Button>
            <div>
                <Button variant={"secondary"} className="m-2">
                    Hide Completed
                </Button>
                <Button variant={"primary"} onClick={handleNewHabit}>
                    New Habit
                </Button>
            </div>
        </div>
    );
}