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
import { useRouter } from "next/navigation";

interface HabitDetailsProps {
  entry: HabitEntry;
  onHabitDeleted: () => void;
  title: string;
}

export function HabitDetailsModal({
  entry,
  onHabitDeleted,
  title,
}: HabitDetailsProps) {
  const [habitDetails, setHabitDetails] = useState<HabitDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState(ChartType.STEP);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

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

  const onDelete = async () => {
    try {
      await deleteHabitAction(entry.habit.id);
      setIsOpen(false);
      onHabitDeleted();
      router.refresh();
    } catch (error) {
      console.error("Failed to delete habit:", error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) fetchHabitDetails();
      }}
    >
      <DialogTrigger asChild>
        <div className="flex hover:bg-bg-light-2 hover:text-fg px-2 rounded-md cursor-pointer items-center py-2">
          <h3 className="flex-1 text-left">{title}</h3>
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
          <Button variant={"primary"} onClick={async () => await onDelete()}>
            Delete Habit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
