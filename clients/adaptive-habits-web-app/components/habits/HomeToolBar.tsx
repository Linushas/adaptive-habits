"use client";

import { Button } from "../ui/button";
import { NewHabitDialog } from "./NewHabitDialog";
import { useState } from "react";

interface ToolBarProps {
    hideCompleted: boolean
    onHideCompleted: () => void,
    className?: string,
}

export function HomeToolBar({ className, hideCompleted, onHideCompleted }: ToolBarProps) {
    return (
        <div className={`${className} pt-32 flex justify-between`}>
            <Button variant={"secondary"}>
                Today *
            </Button>
            <div>
                <Button variant={hideCompleted ? "outline" : "ghost"} onClick={onHideCompleted} className="m-2">
                    {hideCompleted 
                        ? "Show Completed"
                        : "Hide Completed"
                    }
                </Button>
                <NewHabitDialog />
            </div>
        </div>
    );
}