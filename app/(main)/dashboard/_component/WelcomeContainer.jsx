"use client";

import React from 'react';
import Image from 'next/image';
import { Bell, Search } from 'lucide-react';
import { useUser } from '@/app/Provider';

function WelcomeContainer() {
    const { user } = useUser();
    const displayName = user?.name || user?.email || "Recruiter";

    return (
        <div className="flex !w-full items-center justify-between !gap-4">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Workspace</p>
                <h1 className="text-xl font-bold text-slate-950">Welcome back, {displayName}</h1>
            </div>

            <div className="hidden items-center !gap-3 md:flex">
                <div className="flex !h-10 !w-72 items-center !gap-2 rounded-lg border border-slate-200 bg-slate-50 !px-3 text-sm text-slate-500">
                    <Search className="!h-4 !w-4" />
                    <span>Search interviews</span>
                </div>
                <button className="flex !h-10 !w-10 items-center justify-center rounded-lg border border-slate-200 !text-slate-600 hover:!bg-slate-50" aria-label="Notifications">
                    <Bell className="!h-4 !w-4" />
                </button>
                {user?.picture ? (
                    <Image
                        src={user.picture}
                        alt="User avatar"
                        width={40}
                        height={40}
                        className="!h-10 !w-10 rounded-full object-cover ring-2 ring-white"
                    />
                ) : (
                    <div className="flex !h-10 !w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default WelcomeContainer;
