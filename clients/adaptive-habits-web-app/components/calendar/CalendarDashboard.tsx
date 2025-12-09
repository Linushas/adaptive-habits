"use client";

import { CalendarHabitEntry } from "@/types/index"
import CalendarGrid from "./Calendar";
import { useState } from "react";

export interface CalendarProps {
    entries: CalendarHabitEntry[];
}

export default function CalendarDashboard({ entries }: CalendarProps) {
    const [month, setMonth] = useState("December");

    return (
        <>
            <div className="flex min-w-4xl px-10 p-4 flex-wrap justify-start gap-4">
                <span className="font-bold text-2xl m-auto">{month}</span>
            </div>
            <CalendarGrid entries={entries} />
        </>
    );
}
