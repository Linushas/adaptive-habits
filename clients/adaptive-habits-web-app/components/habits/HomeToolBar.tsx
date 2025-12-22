"use client";

import { Button } from "../ui/button";
import { NewHabitDialog } from "./NewHabitDialog";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ToolBarProps {
  hideCompleted: boolean;
  onHideCompleted: () => void;
  onSelectDate: (date: Date | undefined) => void;
  selectedDate: Date;
  className?: string;
  onHabitAdded: () => void;
}

export function HomeToolBar({
  className,
  hideCompleted,
  onHideCompleted,
  onSelectDate,
  selectedDate,
  onHabitAdded,
}: ToolBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`${className} pt-8 md:pt-32 flex flex-col md:flex-row md:justify-between items-center gap-4`}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            id="date"
            className="w-48 justify-between font-normal m-auto"
          >
            {selectedDate
              ? selectedDate.getDate() == new Date().getDate()
                ? "Today"
                : selectedDate.toDateString()
              : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0 border border-fg-muted/20 bg-bg-light-2"
          align="start"
        >
          <Calendar
            mode="single"
            className="bg-bg-light-2"
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={(date) => {
              onSelectDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      {/* <h2 className="text-2xl font-bold m-auto">
        {selectedDate
          ? selectedDate.getDate() == new Date().getDate()
            ? "Today"
            : selectedDate.toDateString()
          : ""}
      </h2> */}

      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant={hideCompleted ? "outline" : "ghost"}
          onClick={onHideCompleted}
          className="m-0"
        >
          {hideCompleted ? "Show Completed" : "Hide Completed"}
        </Button>
        <NewHabitDialog onHabitAdded={onHabitAdded} />
      </div>
    </div>
  );
}
