'use client';

import { useState } from 'react';
import { AgentPanel } from "@/components/layout/AgentPanel";
import Sidepanel from "@/components/ui/Sidepanel";
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [isSidepanelOpen, setIsSidepanelOpen] = useState(true);

  return (
    <Sidepanel panel={
        <AgentPanel />
      } isOpen={isSidepanelOpen} setIsOpen={setIsSidepanelOpen}
    >
      <Navbar />
      <div className="min-h-screen bg-bg p-8 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Hello World</h1>
          </div>
        </div>
      </div>
    </Sidepanel>
  );
}
