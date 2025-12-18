"use client";

import { CalendarHabitEntry } from "@/types/index";
import CalendarGrid from "./Calendar";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { getCalendar } from "@/services/entries";

export interface CalendarProps {
  entries: CalendarHabitEntry[];
}

export default function CalendarDashboard({ entries }: CalendarProps) {
  const [calendarEntries, setCalendarEntries] = useState(entries);
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const onFocus = () => {
      const newToday = new Date();
      if (
        newToday.getDate() !== today.getDate() ||
        newToday.getMonth() !== today.getMonth() ||
        newToday.getFullYear() !== today.getFullYear()
      ) {
        setToday(newToday);
      }
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [today]);

  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  async function onMonthChange(direction: string) {
    let newYear = year;
    let newMonth = month;

    if (direction.includes("previous")) {
      console.log("decrease");
      if (newMonth == 0) {
        newYear -= 1;
        newMonth = 11;
      } else {
        newMonth -= 1;
      }
    } else if (direction.includes("next")) {
      console.log("increase");
      if (newMonth == 11) {
        newYear += 1;
        newMonth = 0;
      } else {
        newMonth += 1;
      }
    } else if (direction.includes("current")) {
      newYear = today.getFullYear();
      newMonth = today.getMonth();
    }

    setYear(newYear);
    setMonth(newMonth);

    try {
      // console.log(newYear, newMonth)
      const entries: CalendarHabitEntry[] = await getCalendar(
        new Date(newYear, newMonth, 1),
        new Date(newYear, newMonth + 1, 0)
      );
      if (entries) setCalendarEntries(entries);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <div className="flex min-w-4xl px-10 p-4 flex-wrap justify-start gap-4">
        <Button variant="secondary" onClick={() => onMonthChange("previous")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M7.28 7.72a.75.75 0 0 1 0 1.06l-2.47 2.47H21a.75.75 0 0 1 0 1.5H4.81l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
        <span className="font-bold text-2xl m-auto">
          {months[month]} {year}
        </span>

        <Button
          variant="secondary"
          onClick={() => {
            const now = new Date();
            setYear(now.getFullYear());
            setMonth(now.getMonth());
            setToday(now);
            onMonthChange("current");
          }}
        >
          Today
        </Button>
        <Button variant="secondary" onClick={() => onMonthChange("next")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>
      <CalendarGrid entries={calendarEntries} today={today} />
    </>
  );
}
