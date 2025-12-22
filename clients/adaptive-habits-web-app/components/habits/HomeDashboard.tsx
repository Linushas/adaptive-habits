"use client";

import { HabitCard } from "@/components/habits/HabitCard";
import { HomeToolBar } from "@/components/habits/HomeToolBar";
import { getTodaysEntries } from "@/services/entries";
import { HabitEntry } from "@/types/index";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useDate } from "@/hooks/useDate";

export default function HomeDashboard() {
  const [today, setToday] = useState(new Date());
  const { date: selectedDate, setDate: onSelectedDate } = useDate(
    "date",
    today
  );

  const [hideCompleted, setHideCompleted] = useState(false);
  const [localEntries, setLocalEntries] = useState<HabitEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEntries = useCallback(async () => {
    if (!selectedDate) return;

    try {
      setIsLoading(true);
      const todays_entries: HabitEntry[] = await getTodaysEntries(selectedDate);
      setLocalEntries(todays_entries || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSelectDate = (date: Date | undefined) => {
    if (!date || date > new Date()) return;
    onSelectedDate(date);
  };

  return (
    <div className="bg-bg min-h-full w-full items-center justify-center flex flex-col">
      <div className="flex w-full max-w-4xl px-4 md:px-10 p-4 flex-wrap justify-start gap-4">
        <HomeToolBar
          hideCompleted={hideCompleted}
          onHideCompleted={() => setHideCompleted(!hideCompleted)}
          onSelectDate={handleSelectDate}
          selectedDate={selectedDate}
          onHabitAdded={fetchEntries}
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
                      onHabitDeleted={fetchEntries}
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
