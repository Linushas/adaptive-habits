import { HabitEntry, HabitModel } from "@/types";
import { Button } from "../ui/button";
import { DialogTitle } from "../ui/dialog";

interface HabitControlsProps {
  habit: HabitModel;
  todaysEntry: HabitEntry;
}

export function HabitControls({ habit, todaysEntry }: HabitControlsProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-2">
      <DialogTitle className="text-3xl text-center md:text-left">
        {habit.name}
      </DialogTitle>

      <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-12">
        <div className="space-y-3 text-center">
          <h5 className="font-bold text-fg">Current Target</h5>
          <span className="text-fg-muted">{todaysEntry.target_snapshot}</span>
        </div>

        <div className="space-y-2 text-center items-center">
          <h5 className="font-bold text-fg">Next Target</h5>
          <div className="flex text-center items-center m-auto space-x-2">
            <Button
              variant={"ghost"}
              size={"icon"}
              className="hover:bg-transparent text-transparent hover:text-fg m-auto pr-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
            <span className="text-fg-muted m-auto hover:text-fg">Auto</span>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="hover:bg-transparent text-transparent hover:text-fg m-auto pl-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
          {/* <span className="text-fg-muted/40 m-auto text-sm cursor-default">Reset to AI Recommendation</span> */}
        </div>
      </div>
    </div>
  );
}
