// 'use client';
// import Link from 'next/link';
// import Image from 'next/image';
// import {
//     Sidebar,
//     SidebarContent,
//     SidebarFooter,
//     SidebarGroup,
//     SidebarHeader,
//     SidebarMenuButton,
//     SidebarMenuItem,
//     SidebarMenu,
// } from "@/components/ui/sidebar"
// import { Button } from '@/components/ui/button';

// import { Plus } from "lucide-react"
// import { SideBarOptions } from '@/services/Constant';
// import { usePathname } from 'next/navigation';
// export function AppSidebar() {
//     const path = usePathname();
//     console.log(path)
//     return (
//         <Sidebar>
//             <SidebarHeader className="flex  items-center !mt-5">
//                 <Image
//                     src={"/logo.png"}
//                     alt="logo"
//                     width={200}
//                     height={100}
//                     className="w-[150px] mb-6"
//                 />

//                 <Button className="!p-2 w-[250px] !mt-3" >
//                     <Plus />
//                     Create New Interview
//                 </Button>
//             </SidebarHeader>
//             <SidebarContent>
//                 <SidebarGroup >
//                     <SidebarContent>
//                         <SidebarMenu>
//                             {SideBarOptions.map((option, index) => (
//                                 <SidebarMenuItem key={index} className='!p-1 !mt-2'>
//                                     <SidebarMenuButton asChild className='!p-5'>
//                                         {/* <Link href={option.path}>
//                                             <option.icon />
//                                             <span className={`text-[16px] ${path == option.path && "text-blue-500"}`}>
//                                                 {option.name}
//                                             </span>
//                                         </Link> */}<Link
//                                             href={option.path}
//                                             className={`flex items-center gap-3 rounded-md transition-colors duration-200
//               ${path === option.path ? 'bg-blue-100 ' : 'text-gray-700 !hover:bg-gray-800'}`}
//                                         >
//                                             <option.icon className="w-5 h-5" />
//                                             <span className={`text-[16px] font-medium`}>
//                                                 {option.name}
//                                             </span>
//                                         </Link>

//                                     </SidebarMenuButton>
//                                 </SidebarMenuItem>
//                             ))}
//                         </SidebarMenu>
//                     </SidebarContent>
//                 </SidebarGroup>
//             </SidebarContent>
//             <SidebarFooter />
//         </Sidebar>
//     )
// }

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenu,
} from "@/components/ui/sidebar";

import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react";
import { SideBarOptions } from '@/services/Constant';

export function AppSidebar() {
    const path = usePathname();

    useEffect(() => {
        console.log("Current path:", path);
    }, [path]);

    return (
        <Sidebar>
            {/* Header */}
            <SidebarHeader className="!flex !flex-col items-center !mt-5">
                <Image
                    src="/logo.png"
                    alt="logo"
                    width={200}
                    height={100}
                    className="!w-[150px] !mb-2 !py-2"
                    priority 
                />
                <Button className="!p-2 w-[250px] !mt-3">
                    <Plus className="!mr-2" />
                    Create New Interview
                </Button>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {SideBarOptions.map((option, index) => (
                            <SidebarMenuItem key={index} className="!p-1 !mt-2 !ml-1">
                                <SidebarMenuButton asChild className="!p-0">
                                    <Link
                                        href={option.path}
                                        className={`!p-2 flex items-center gap-3 rounded-md transition-colors duration-200
                                                    ${path === option.path ? 'bg-blue-100 ' : 'text-gray-700 !hover:bg-gray-800'}`}
                                    >
                                        <option.icon className="!w-5 !h-5" />
                                        <span className="!text-sm">{option.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter />
        </Sidebar>
    );
}
