"use client";

import { HabitCard } from "@/components/habits/HabitCard";
import { HomeToolBar } from "@/components/habits/HomeToolBar";
import { formatDateForApi } from "@/lib/utils";
import { getTodaysEntries } from "@/services/entries";
import { HabitEntry } from "@/types/index";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

interface HomeDashboardProps {
  entries: HabitEntry[];
}

export default function HomeDashboard({ entries }: HomeDashboardProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hideCompleted, setHideCompleted] = useState(false);
  const [localEntries, setLocalEntries] = useState(entries);
  const [isLoading, setIsLoading] = useState(false);

  const onSelectedDate = (date: Date | undefined) => {
    if (!date || date.valueOf() > new Date().valueOf()) return;

    const adjustedDate = new Date(date);
    adjustedDate.setHours(12, 0, 0, 0);

    setSelectedDate(adjustedDate);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("-- " + formatDateForApi(selectedDate));
        setIsLoading(true);
        const todays_entries: HabitEntry[] =
          await getTodaysEntries(selectedDate);
        if (todays_entries) setLocalEntries(todays_entries);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedDate, hideCompleted]);

  return (
    <div className="bg-bg min-h-full w-full items-center justify-center flex flex-col">
      <div className="flex w-full max-w-4xl px-4 md:px-10 p-4 flex-wrap justify-start gap-4">
        <HomeToolBar
          hideCompleted={hideCompleted}
          onHideCompleted={() => setHideCompleted(!hideCompleted)}
          onSelectDate={onSelectedDate}
          selectedDate={selectedDate}
          className="min-w-full"
        />
      </div>
      {isLoading ? (
        <span className="text-fg-muted p-8">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        </span>
      ) : localEntries.length == 0 ? (
        <p className="text-fg-muted">No habits</p>
      ) : (
        <>
          <div className="py-8 flex w-full max-w-4xl px-4 md:px-10 p-4 flex-wrap justify-center items-center flex-col">
            <div className="flex flex-wrap justify-evenly gap-4">
              {localEntries.map((entry, index) =>
                hideCompleted && entry.value >= entry.target_snapshot ? (
                  <div key={index}></div>
                ) : (
                  <div key={index} className="contents">
                    <HabitCard
                      title={entry.habit.name}
                      value={entry.value}
                      targetValue={entry.target_snapshot}
                      habitEntry={entry}
                      unit={entry.habit.unit}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
