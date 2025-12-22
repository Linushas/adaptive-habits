"use client";

import { HabitDetails, HabitEntry } from "@/types";
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
import { ProgressChart } from "./ProgressChart";
import { getHabitDetails } from "@/services/habits";
import { HabitControls } from "./HabitControls";
import { useState } from "react";
import { ChartType } from "../time_chart/TimeChart";
import { deleteHabitAction } from "@/app/actions";

interface HabitDetailsProps {
  entry: HabitEntry;
}

export function HabitDetailsModal({ entry }: HabitDetailsProps) {
  const [habitDetails, setHabitDetails] = useState<HabitDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState(ChartType.STEP);

  async function fetchHabitDetails() {
    if (habitDetails) return;

    setLoading(true);
    try {
      const details = await getHabitDetails(entry.habit.id);
      if (details) setHabitDetails(details);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) fetchHabitDetails();
      }}
    >
      <DialogTrigger asChild>
        <div
          onClick={() =>
            console.log(
              habitDetails
                ? habitDetails.habit.name + " clicked"
                : "no loaded habit"
            )
          }
          className="flex hover:bg-bg-light-2 hover:text-fg px-2 rounded-md"
        >
          <h3 className="m-auto">{entry.habit.name}</h3>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-transparent text-transparent hover:text-fg p-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[100%] max-w-[100%] h-[100%] md:min-w-[80%] md:max-w-[80%] md:h-[80%] align-top">
        {habitDetails ? (
          <HabitControls habit={habitDetails.habit} todaysEntry={entry} />
        ) : (
          <DialogTitle className="text-fg">Loading...</DialogTitle>
        )}

        <div className="space-y-2 border-t border-fg-muted/10 pt-4">
          <h3 className="font-bold text-fg">Description</h3>
          <span className="text-sm text-fg">
            {habitDetails ? habitDetails.habit.description : "Loading..."}
          </span>
        </div>

        {habitDetails ? (
          <ProgressChart
            key={chartType}
            snapshots={habitDetails.snapshots}
            type={chartType}
          />
        ) : (
          <div className="max-h-90 h-full bg-bg-light-2 rounded-lg max-w-full w-full overflow-hidden transition-none"></div>
        )}

        <DialogFooter>
          <Button
            variant={"ghost"}
            className="text-fg"
            onClick={() =>
              setChartType(
                chartType == ChartType.LINE ? ChartType.STEP : ChartType.LINE
              )
            }
          >
            Switch Chart Type
          </Button>
          <Button
            variant={"primary"}
            onClick={async () => await deleteHabitAction(entry.habit.id)}
          >
            Delete Habit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
