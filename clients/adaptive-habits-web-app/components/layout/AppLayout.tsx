"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import Sidepanel from "@/components/ui/Sidepanel";
import { AgentPanel } from "@/components/layout/AgentPanel";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidepanelOpen, setIsSidepanelOpen] = useState(true);
  const pathname = usePathname();
  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.includes(pathname);

  if (isPublicPath) {
    return (
      <div className="w-full h-screen bg-bg flex flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto min-h-0 bg-bg text-fg">
          {children}
        </main>
      </div>
    );
  }

  return (
    <Sidepanel
      panel={<AgentPanel />}
      isOpen={isSidepanelOpen}
      setIsOpen={setIsSidepanelOpen}
    >
      <Navbar />
      <main className="flex-1 overflow-y-auto min-h-0 bg-bg text-fg">
        {children}
      </main>
    </Sidepanel>
  );
}
