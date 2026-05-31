'use client';

import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './_components/AppSidebar';
import WelcomeContainer from './dashboard/_component/WelcomeContainer';

export default function DashboardProvider({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex !h-screen !w-full flex-col overflow-hidden bg-slate-50">
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 !px-4 !py-3 backdrop-blur sm:!px-8">
                    <div className="flex items-center !gap-3">
                        <SidebarTrigger className="md:hidden" />
                        <WelcomeContainer />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto !px-4 !py-6 sm:!px-8">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
