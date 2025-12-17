import { getToday } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "../ui/card";
import { CalendarProps } from "./CalendarDashboard";
import { CalendarHabitEntry } from "@/types/index";
import { CSSProperties } from "react";

interface ProgressPieChartProps {
  percentage: number;
}

const today: Date = getToday();

function ProgressPieChart({ percentage }: ProgressPieChartProps) {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="flex items-center justify-center">
      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r={radius}
          fill="none"
          stroke="rgba(100, 100, 100, 0.2)"
          strokeWidth="5"
        />
        <circle
          cx="16"
          cy="16"
          r={radius}
          fill="none"
          stroke="#eee"
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function CalendarCard({ log_date, completion_percentage }: CalendarHabitEntry) {
  const date: Date = new Date(log_date);
  const dayNr = date.getDate();
  const pie_percentage = Math.min(100, Math.max(0, completion_percentage));
  const opacity = Math.max(0.2, completion_percentage / 100);
  const bgColorString = `rgba(100, 100, ${Math.floor(100 + opacity * 10)}, ${opacity})`;
  const hoverColorString = `rgba(100, 100, ${Math.floor(100 + opacity * 10)}, ${Math.min(1, opacity + 0.2)})`;

  return (
    <>
      <Card
        className={`
                    relative w-24 h-24 transition-all duration-200 hover:shadow-xl hover:shadow-fg/10 cursor-pointer 
                    ${
                      dayNr == today.getDate() &&
                      date.getMonth() == today.getMonth() &&
                      date.getFullYear() == today.getFullYear()
                        ? "border-fg-muted"
                        : ""
                    }
                `}
        style={
          {
            backgroundColor: bgColorString,
          } as React.CSSProperties
        }
      >
        <span
          className={`absolute top-1 left-2 text-sm font-bold opacity-80 ${dayNr < today.getDate() ? "text-fg-muted/40" : "text-fg"}`}
        >
          {dayNr}
        </span>
        <div className="flex flex-col items-center justify-center h-full pt-3 gap-1">
          <div className="w-8 h-8 shrink-0">
            <ProgressPieChart percentage={pie_percentage} />
          </div>
          <span className="text-[10px] text-fg-muted font-semibold leading-none opacity-90">
            {completion_percentage < 100 ? (
              completion_percentage + "%"
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </span>
        </div>
      </Card>
    </>
  );
}

export default function CalendarGrid({ entries }: CalendarProps) {
  return (
    <div className="py-8 flex w-full max-w-4xl p-4 flex-wrap justify-center items-center flex-col">
      <div className="flex flex-wrap justify-evenly gap-4">
        {entries.map((entry: CalendarHabitEntry, index) => (
          <div key={index}>
            <CalendarCard
              log_date={entry.log_date}
              completion_percentage={entry.completion_percentage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
