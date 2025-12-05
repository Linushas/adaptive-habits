"use client";

import { Button } from "../ui/button";
import { NewHabitDialog } from "./NewHabitDialog";

interface ToolBarProps {
    className?: string,
}

export function HomeToolBar({ className }: ToolBarProps) {
    return (
        <div className={`${className} pt-32 flex justify-between`}>
            <Button variant={"secondary"}>
                Today *
            </Button>
            <div>
                <Button variant={"secondary"} className="m-2">
                    Hide Completed
                </Button>
                <NewHabitDialog />
            </div>
        </div>
    );
}