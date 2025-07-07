'use client'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import { AppSidebar } from './_components/AppSidebar'
import WelcomeContainer from './dashboard/_component/WelcomeContainer'

export default function DashboardProvider({ children }) {
    return (
        
        <SidebarProvider>
            <AppSidebar />
            <div className="w-full flex flex-col h-screen overflow-hidden">
                <div className="!px-10 !pt-5 bg-gray-100 shadow-md z-10"> 
                    {/* <SidebarTrigger className="!mt-2" /> */}
                    <WelcomeContainer />
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide custom-scroll-hide !px-10 !pt-5"> 
                    {children}
                </div>
            </div>
        </SidebarProvider>
        
    );
}


// 'use client'
// import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
// import React from 'react'
// import { AppSidebar } from './_components/AppSidebar'
// import WelcomeContainer from './dashboard/_component/WelcomeContainer'

// export default function DashboardProvider({ children }) {
//     return (
//         <SidebarProvider>
//             <AppSidebar />
//             <div className='w-full'>
//                 <SidebarTrigger className='!mt' />
//                 <WelcomeContainer/>
//                 {children}
//             </div>
//         </SidebarProvider>
//     );
// }

// 'use client'
// import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
// import React from 'react'
// import { AppSidebar } from './_components/AppSidebar'
// import WelcomeContainer from './dashboard/_component/WelcomeContainer'

// export default function DashboardProvider({ children }) {
//     return (
//         <SidebarProvider>
//             <AppSidebar />

//             <div className="w-full h-full overflow-hidden px-4 py-4">

//                 <div className="mb-4">
//                     <SidebarTrigger />
//                 </div>

//                 <div className="mb-6">
//                     <WelcomeContainer />
//                 </div>

//                 <div className="overflow-y-auto">
//                     {children}
//                 </div>
//             </div>
//         </SidebarProvider>
//     );
// }
