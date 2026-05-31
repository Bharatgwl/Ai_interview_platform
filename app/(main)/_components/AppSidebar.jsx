'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Plus } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { SideBarOptions } from '@/services/Constant';
import { supabase } from '@/services/supabaseClient';

export function AppSidebar() {
    const path = usePathname();
    const router = useRouter();

    const onLogout = async () => {
        await supabase.auth.signOut();
        router.push('/auth');
    };

    return (
        <Sidebar className="border-r border-slate-200 bg-white">
            <SidebarHeader className="!px-5 !py-6">
                <Link href="/dashboard" className="flex items-center">
                    <Image
                        src="/logo.png"
                        alt="IntelliHire logo"
                        width={180}
                        height={70}
                        className="!w-[145px] object-contain"
                        priority
                    />
                </Link>

                <Button asChild className="venom-button group/button !mt-6 !h-11 !w-full overflow-hidden rounded-lg border border-slate-950 !bg-white !text-slate-950 hover:!text-white">
                    <Link href="/dashboard/create-interview">
                        <Plus className="plus-rotate !h-4 !w-4" />
                        New Interview
                    </Link>
                </Button>
            </SidebarHeader>

            <SidebarContent className="!px-3">
                <SidebarGroup>
                    <SidebarMenu className="!space-y-1">
                        {SideBarOptions.map((option) => {
                            const active = path === option.path || path.startsWith(`${option.path}/`);
                            return (
                                <SidebarMenuItem key={option.path}>
                                    <SidebarMenuButton asChild className="!p-0">
                                        <Link
                                            href={option.path}
                                            className={`flex !h-11 items-center !gap-3 rounded-lg !px-3 text-sm font-medium transition-colors ${
                                                active
                                                    ? '!bg-slate-950 !text-white hover:!bg-slate-500 hover:!text-white shadow-sm'
                                                    : '!text-slate-900 hover:!bg-slate-200 hover:!text-slate-950'
                                            }`}
                                        >
                                            <option.icon className="!h-4 !w-4" />
                                            <span>{option.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="!p-4">
                <Button
                    variant="outline"
                    onClick={onLogout}
                    className="!h-11 !w-full justify-center rounded-lg border-slate-200 !text-slate-700 hover:!bg-red-50 hover:!text-red-700"
                >
                    <LogOut className="!h-4 !w-4" />
                    Logout
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
