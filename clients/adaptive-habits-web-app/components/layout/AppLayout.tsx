'use client';

import { useState } from 'react';
import { Navbar } from "@/components/layout/Navbar";
import Sidepanel from "@/components/ui/Sidepanel";
import { AgentPanel } from "@/components/layout/AgentPanel";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidepanelOpen, setIsSidepanelOpen] = useState(true);

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