"use client";

import { useState, useEffect } from "react";
import { Slider } from "../ui/slider";
import { Card, CardContent, CardTitle } from "../ui/card";
import { motion, useSpring, useTransform } from "framer-motion";
import { HabitEntry, HabitEntryUpdate } from "@/types";
import { updateHabitEntry } from "@/services/entries";
import { HabitDetailsModal } from "../habit_details_modal/HabitDetailsModal";
import { Input } from "../ui/input";

interface HabitCardProps {
  title: string;
  value: number;
  targetValue: number;
  habitEntry: HabitEntry;
  unit?: string;
  className?: string;
}

export function HabitCard({
  title,
  value,
  targetValue,
  habitEntry,
  unit,
  className,
}: HabitCardProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const maxValue = 10000;
  const minValue = 0;

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const springValue = useSpring(localValue, {
    stiffness: 500,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    springValue.set(localValue);
  }, [localValue, springValue]);

  const displayValue = useTransform(springValue, (latest) =>
    Math.round(latest)
  );

  const handleSliderChange = (vals: number[]) => {
    const newValue = vals[0];
    setLocalValue(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  const handleCheckboxChange = (value: number) => {
    const newValue = value ? 0 : 1;
    setLocalValue(newValue);
    onValueChange(newValue);
  };

  async function onValueChange(value: number) {
    const entry: HabitEntryUpdate = {
      id: habitEntry.id,
      value: value,
    };

    try {
      await updateHabitEntry(entry);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Card
      className={`
                ${className} w-fit min-w-sm p-4 flex-1 hover:bg-bg-light-2/60 cursor-pointer
                ${
                  localValue >= targetValue
                    ? "shadow-2xl shadow-fg/10"
                    : "shadow-none"
                }
            `}
    >
      <CardTitle>
        <div className="flex items-center justify-between">
          <HabitDetailsModal entry={habitEntry} />
          {targetValue === 1 ? (
            localValue == 1 ? (
              <span>Done</span>
            ) : (
              <span></span>
            )
          ) : (
            <div className="flex gap-1 font-mono tabular-nums">
              {isInputOpen ? (
                <Input
                  className="max-w-20 m-auto h-8"
                  type="number"
                  min={minValue}
                  max={maxValue}
                  autoFocus
                  defaultValue={localValue}
                  onChange={(e) => {
                    let val = parseInt(e.target.value);
                    if (val >= maxValue) val = maxValue;
                    else if (val <= minValue) val = minValue;
                    if (!isNaN(val)) setLocalValue(val);
                  }}
                  onBlur={() => {
                    setIsInputOpen(false);
                    onValueChange(localValue);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsInputOpen(false);
                      onValueChange(localValue);
                    }
                  }}
                />
              ) : (
                <motion.span
                  className="m-auto hover:text-fg-muted/40 cursor-text"
                  onClick={() => setIsInputOpen(true)}
                >
                  {displayValue}
                </motion.span>
              )}
              <span className="m-auto">
                / {targetValue} {unit != null ? unit : ""}
              </span>
            </div>
          )}
        </div>
      </CardTitle>
      <CardContent className="pb-8 pt-2 max-h-20 h-20">
        {targetValue == 1 ? (
          <div className="flex items-center justify-center">
            <div
              className={`${
                localValue
                  ? "cursor-pointer bg-fg w-16 h-16 text-bg-dark flex items-center justify-center m-auto rounded-md"
                  : "cursor-pointer bg-bg-light-2 w-16 h-16 text-fg-muted border border-fg-muted flex items-center justify-center m-auto rounded-md"
              }
                            `}
              onClick={() => {
                handleCheckboxChange(localValue);
              }}
            >
              {localValue ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-8"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                    clipRule="evenodd"
                  />
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
