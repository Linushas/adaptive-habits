"use client";

import { Button } from "../ui/button";
import { NewHabitDialog } from "./NewHabitDialog";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface ToolBarProps {
    hideCompleted: boolean
    onHideCompleted: () => void,
    onSelectDate: (date: Date | undefined) => void,
    selectedDate: Date,
    className?: string,
}

export function HomeToolBar({ className, hideCompleted, onHideCompleted, onSelectDate, selectedDate }: ToolBarProps) {
    const [open, setOpen] = useState(false)

    return (
        <div className={`${className} pt-32 flex justify-between`}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="secondary"
                        id="date"
                        className="w-48 justify-between font-normal m-auto"
                    >
                        {selectedDate ? ((selectedDate.getDate() == new Date().getDate()) ? "Today" : selectedDate.toDateString()) : "Select date"}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            onSelectDate(date)
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>

            <h2 className="text-2xl font-bold m-auto">
                {selectedDate
                    ? (
                        (selectedDate.getDate() == new Date().getDate())
                            ? "Today"
                            : selectedDate.toDateString()
                    )
                    : ""
                }
            </h2>

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
