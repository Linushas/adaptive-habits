"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "./button";
import { Dispatch, SetStateAction } from "react";

interface SidepanelProps {
  children: React.ReactNode;
  panel: React.ReactNode;
  isOpen: Boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Sidepanel({ children, panel, isOpen, setIsOpen }: SidepanelProps) {
  const togglePanel = () => setIsOpen((prev) => !prev);

  return (
    <>
      {isOpen ? (
        <ResizablePanelGroup direction="horizontal" className="h-screen bg-bg-light w-full">
              <ResizablePanel defaultSize={20} minSize={20} maxSize={36}>
                <div className="h-full w-full overflow-hidden">
                  <Button onClick={togglePanel} className="m-4" variant={"secondary"}>
                    Close
                  </Button>
                  {panel}
                </div>
              </ResizablePanel>
              <ResizableHandle />
            <ResizablePanel defaultSize={80}>
              <div className="h-full w-full overflow-y-auto">
                {children}
              </div>
            </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <> 
          {children} 
        </>
      )};
    </>
  );
}
