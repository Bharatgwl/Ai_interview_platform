"use client";

import React, { useState, useEffect } from 'react';
import { Camera, Plus } from "lucide-react";
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabaseClient';
import { useUser } from '@/app/Provider';
import InterviewCard from './InterviewCard';
import Link from 'next/link';

function LatestInterviewsList() {
    const [interviewList, setInterviewList] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        if (user) GetInterviewList();
    }, [user]);

    const GetInterviewList = async () => {
        const { data: Interviews, error } = await supabase
            .from('Interviews')
            .select('*')
            .eq('userEmail', user?.email)
            .order('id', { ascending: false })
            .limit(6);

        if (!error) setInterviewList(Interviews || []);
    };

    return (
        <section>
            <div className="!mb-4 flex items-end justify-between !gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-950">Recent interviews</h2>
                    <p className="text-sm text-slate-500">Copy links, send invitations, and continue managing candidate sessions.</p>
                </div>
                <Button asChild variant="outline" className="hidden rounded-lg !bg-white !p-3 !text-black hover:!bg-black hover:!text-white sm:flex">
                    <Link href="/all-interview">View all</Link>
                </Button>
            </div>

            {interviewList?.length === 0 ? (
                <div className="flex !min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white !p-8 text-center">
                    <Camera className="!h-10 !w-10 text-slate-400" />
                    <h3 className="!mt-4 font-semibold text-slate-950">No interviews created yet</h3>
                    <p className="!mt-2 !max-w-md text-sm text-slate-500">Create your first AI interview and share it with a candidate in minutes.</p>
                    <Button asChild className="group !mt-5 rounded-lg !bg-slate-950 !p-2 !text-white shadow hover:!bg-white hover:!text-black hover:border">
                        <Link href="/dashboard/create-interview">
                            <Plus className="plus-rotate !h-4 !w-4" />
                            Create interview
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 !gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {interviewList.map((interview) => (
                        <InterviewCard interview={interview} key={interview.id || interview.interview_id} />
                    ))}
                </div>
            )}
        </section>
    );
}

export default LatestInterviewsList;
