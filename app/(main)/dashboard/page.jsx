import React from 'react';
import { CalendarCheck, Clock3, Sparkles, Users } from 'lucide-react';
import CreateOption from './_component/CreateOption';
import LatestInterviewsList from './_component/LatestInterviewsList';

function Dashboard() {
  const stats = [
    { label: 'Active interviews', value: 'Live', icon: CalendarCheck, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Average setup', value: '2 min', icon: Clock3, tone: 'bg-blue-50 text-blue-700' },
    { label: 'AI question sets', value: 'Ready', icon: Sparkles, tone: 'bg-violet-50 text-violet-700' },
    { label: 'Candidate flow', value: 'Open', icon: Users, tone: 'bg-amber-50 text-amber-700' },
  ];

  return (
    <div className="!space-y-7">
      <section className="rounded-2xl bg-slate-950 !p-6 text-white shadow-sm">
        <div className="!max-w-3xl">
          <p className="text-sm font-medium text-cyan-200">IntelliHire dashboard</p>
          <h2 className="!mt-3 text-3xl font-bold tracking-tight">Create, share, and review AI interviews from one focused workspace.</h2>
          <p className="!mt-3 !max-w-2xl text-sm leading-6 text-slate-300">
            Build structured interviews, send candidate links, and collect feedback without juggling spreadsheets or manual screening calls.
          </p>
        </div>
      </section>

      <section className="grid !gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white !p-5 shadow-sm">
            <div className={`flex !h-10 !w-10 items-center justify-center rounded-lg ${stat.tone}`}>
              <stat.icon className="!h-5 !w-5" />
            </div>
            <p className="!mt-4 text-2xl font-bold text-slate-950">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </section>

      <CreateOption />
      <LatestInterviewsList />
    </div>
  );
}

export default Dashboard;
