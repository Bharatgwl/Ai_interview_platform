"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarClock, Copy, Mail, Plus } from 'lucide-react';
import { supabase } from '@/services/supabaseClient';
import { useUser } from '@/app/Provider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ScheduledInterview = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    if (user) GetInterviewList();
  }, [user]);

  const getUrl = (interviewId) => {
    const appUrl = (process.env.NEXT_PUBLIC_HOST_URL || (typeof window !== "undefined" ? window.location.origin : ""))
      .replace(/\/+$/, "")
      .replace(/\/interview$/, "");
    return `${appUrl}/interview/${interviewId}`;
  };

  const GetInterviewList = async () => {
    const { data, error } = await supabase
      .from('Interviews')
      .select('*')
      .eq('userEmail', user?.email)
      .order('id', { ascending: false });

    if (!error) setInterviewList(data || []);
  };

  const onCopy = (interviewId) => {
    navigator.clipboard.writeText(getUrl(interviewId));
    toast('Interview link copied');
  };

  const onMail = (interviewId) => {
    const subject = encodeURIComponent('Interview Link');
    const body = encodeURIComponent(`Here is the interview link: ${getUrl(interviewId)}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="!space-y-6">
      <div className="flex flex-col justify-between !gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">Invitations</p>
          <h2 className="text-3xl font-bold text-slate-950 venom">Scheduled interviews</h2>
          <p className="!mt-2 text-sm text-slate-500">Manage links that are ready to send to candidates.</p>
        </div>
        <Button asChild className="group rounded-lg !bg-slate-950 !p-4 !text-white hover:!bg-white hover:!text-black hover:border-2">
          <Link href="/dashboard/create-interview">
            <Plus className="plus-rotate !h-4 !w-4" />
            New interview
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {interviewList.length === 0 ? (
          <div className="flex !min-h-56 flex-col items-center justify-center !p-8 text-center">
            <CalendarClock className="!h-10 !w-10 text-slate-400" />
            <h3 className="!mt-4 font-semibold text-slate-950">No scheduled interviews</h3>
            <p className="!mt-2 text-sm text-slate-500">Create an interview to generate a candidate-ready link.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {interviewList.map((interview) => (
              <div key={interview.id || interview.interview_id} className="flex flex-col !gap-4 !p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold text-slate-950">{interview.jobPosition}</h3>
                  <p className="!mt-1 text-sm text-slate-500">{interview.duration} min interview</p>
                </div>
                <div className="flex !gap-2">
                  <Button variant="outline" className="cursor-pointer rounded-lg !p-4 hover:!bg-slate-100 hover:!text-slate-950" onClick={() => onCopy(interview.interview_id)}>
                    <Copy className="!h-4 !w-4" />
                    Copy
                  </Button>
                  <Button className="cursor-pointer rounded-lg !bg-slate-950 !p-4 !text-white hover:!bg-slate-800" onClick={() => onMail(interview.interview_id)}>
                    <Mail className="!h-4 !w-4" />
                    Email
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduledInterview;
