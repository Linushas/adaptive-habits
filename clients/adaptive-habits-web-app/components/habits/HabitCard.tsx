"use client";

import { useState, useEffect } from "react";
import { Slider } from "../ui/slider";
import { Card, CardContent, CardTitle } from "../ui/card";
import { motion, useSpring, useTransform } from "framer-motion";

interface HabitCardProps {
    title: string;
    value: number;
    targetValue: number;
    unit?: string;
    className?: string;
    onValueChange?: (newValue: number) => void;
}

export function HabitCard({ title, value, targetValue, unit, className, onValueChange }: HabitCardProps) {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const springValue = useSpring(localValue, {
        stiffness: 500,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        springValue.set(localValue);
    }, [localValue, springValue]);

    const displayValue = useTransform(springValue, (latest) => Math.round(latest));

    const handleSliderChange = (vals: number[]) => {
        const newValue = vals[0];
        setLocalValue(newValue);
        if (onValueChange) onValueChange(newValue);
    };

    return (
        <Card className={`${className} w-fit min-w-sm p-4 flex-1 hover:bg-bg-light-2/60 cursor-pointer`}>
            <CardTitle>
                <div className="flex items-center justify-between">
                    <h3>{title}</h3>
                    {(targetValue === 1) ? (
                        (localValue == 1) ? (
                            <span>Done</span>
                        ) : (
                            <span></span>
                        )
                    ) : (
                        <div className="flex gap-1 font-mono tabular-nums">
                            <motion.span>{displayValue}</motion.span>
                            <span>/ {targetValue} {unit != null ? unit : ""}</span>
                        </div>
                    )}
                </div>
            </CardTitle>
            <CardContent className="pb-8 pt-2 max-h-20 h-20">
                {(targetValue == 1) ? (
                    <div className="flex items-center justify-center">
                        <div
                            className={`${localValue
                                ? "cursor-pointer bg-fg w-16 h-16 text-bg-dark flex items-center justify-center m-auto rounded-md"
                                : "cursor-pointer bg-bg-light-2 w-16 h-16 text-fg-muted border border-fg-muted flex items-center justify-center m-auto rounded-md"
                                }
                            `}
                            onClick={() => { setLocalValue(localValue ? 0 : 1) }}
                        >
                            {localValue ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                ) : (
                    <Slider
                        value={[localValue]}
                        min={0}
                        max={targetValue}
                        step={1}
                        onValueChange={handleSliderChange}
                        className="min-w-full"
                    />
                )}
            </CardContent>
        </Card>
    );
}