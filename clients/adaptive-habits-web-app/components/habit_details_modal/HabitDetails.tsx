"use client";

import { HabitEntry } from "@/types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface HabitDetailsProps {
  entry: HabitEntry;
}

export function HabitDetails({ entry }: HabitDetailsProps) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div 
          onClick={() => console.log(entry.habit.name + " clicked")}
          className="flex hover:bg-bg-light-2 hover:text-fg px-2 rounded-md"
        >
          <h3 className="m-auto">{entry.habit.name}</h3>
          <Button variant={"ghost"} size={"icon"} className="hover:bg-transparent text-transparent hover:text-fg p-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
          </svg>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[80%] max-w-[80%] h-[80%]">
          <DialogHeader>
            <DialogTitle>{entry.habit.name}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          {/* Controls */}

          {/* Description */}
          {entry.habit.description}

          {/* Chart */}

          <DialogFooter>

          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
