'use client'

import DashboardProvider from './Provider'

export default function DashboardLayout({ children }) {
  return (
    <DashboardProvider>
      <div className="!p-10">
        {children}
      </div>
    </DashboardProvider>
  );
}
