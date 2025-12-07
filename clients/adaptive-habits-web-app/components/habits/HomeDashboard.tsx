"use client";

import { HabitCard } from "@/components/habits/HabitCard";
import { HomeToolBar } from "@/components/habits/HomeToolBar";
import { getTodaysEntries } from "@/services/entries";
import { getHabits } from "@/services/habits";
import { HabitEntry, HabitModel } from "@/types/index"
import { useEffect, useState } from "react";
import { boolean } from "zod";

interface HomeDashboardProps {
    entries: HabitEntry[];
}

export default function HomeDashboard({ entries }: HomeDashboardProps) {
    const [hideCompleted, setHideCompleted] = useState(false);
    const [localEntries, setLocalEntries] = useState(entries);

    async function onHideCompletedChange() {
        try {
            const todays_entries: HabitEntry[] = await getTodaysEntries();
            if(todays_entries) setLocalEntries(todays_entries);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        onHideCompletedChange();
    }, [hideCompleted]);

    return (
        <div className="bg-bg min-h-full w-full items-center justify-center flex flex-col">

            <div className="flex min-w-4xl px-10 p-4 flex-wrap justify-start gap-4">
                <HomeToolBar hideCompleted={hideCompleted} onHideCompleted={() => setHideCompleted(!hideCompleted)} className="min-w-full" />
            </div>
            {(localEntries.length == 0) ? (<p className="text-fg-muted">No habits</p>) : (
                <>
                    <div className="py-8 flex w-full max-w-4xl p-4 flex-wrap justify-center items-center flex-col">

                        <div className="flex flex-wrap justify-evenly gap-4">
                            {localEntries.map((entry, index) => (
                                (hideCompleted && entry.value == entry.habit.current_target_value) ?
                                    <div key={index}></div>
                                    : 
                                    <div key={index} className="contents">
                                        <HabitCard
                                            title={entry.habit.name}
                                            value={entry.value}
                                            targetValue={entry.habit.current_target_value}
                                            habitEntry={entry}
                                            unit={entry.habit.unit}
                                        />
                                    </div>
                            ))}
                        </div>

                    </div>
                </>
            )}
        </div>
    );
}
