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
              <ResizablePanel defaultSize={36} minSize={20} maxSize={32}>
                <div className="h-full w-full overflow-hidden">
                  <div className="m-4 max-w-fit rounded-xs">
                    <Button onClick={togglePanel} className="m-auto rounded-r-none text-fg-muted hover:text-fg" variant={"secondary"}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                      </svg>
                    </Button>
                    <Button className="m-auto text-fg-muted hover:text-fg rounded-none" variant={"secondary"}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M15 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-3.97 3.97a.75.75 0 1 1-1.06-1.06l3.97-3.97h-2.69a.75.75 0 0 1-.75-.75Zm-12 0A.75.75 0 0 1 3.75 3h4.5a.75.75 0 0 1 0 1.5H5.56l3.97 3.97a.75.75 0 0 1-1.06 1.06L4.5 5.56v2.69a.75.75 0 0 1-1.5 0v-4.5Zm11.47 11.78a.75.75 0 1 1 1.06-1.06l3.97 3.97v-2.69a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5h2.69l-3.97-3.97Zm-4.94-1.06a.75.75 0 0 1 0 1.06L5.56 19.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                      </svg>
                    </Button>
                    <Button className="m-auto text-fg-muted hover:text-fg rounded-l-none" variant={"secondary"}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 0 1 6.775-5.025.75.75 0 0 1 .313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 0 1 1.248.313 5.25 5.25 0 0 1-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 1 1 2.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0 1 12 6.75ZM4.117 19.125a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z" clipRule="evenodd" />
                      </svg>
                    </Button>
                  </div>
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
