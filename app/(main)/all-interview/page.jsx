"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/services/supabaseClient';
import { useUser } from '@/app/Provider';
import InterviewCard from '../dashboard/_component/InterviewCard';
import Link from 'next/link';

function AllInterviewPage() {
    const [interviewList, setInterviewList] = useState([]);
    const [query, setQuery] = useState('');
    const { user } = useUser();

    useEffect(() => {
        if (user) GetInterviewList();
    }, [user]);

    const GetInterviewList = async () => {
        const { data: Interviews, error } = await supabase
            .from('Interviews')
            .select('*')
            .eq('userEmail', user?.email)
            .order('id', { ascending: false });

        if (!error) setInterviewList(Interviews || []);
    };

    const filteredInterviews = interviewList.filter((interview) =>
        `${interview?.jobPosition || ''} ${interview?.jobDescription || ''}`.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="!space-y-6">
            <div className="flex flex-col justify-between !gap-4 md:flex-row md:items-end">
                <div>
                    <p className="text-sm font-medium text-slate-500">Library</p>
                    <h2 className="text-3xl font-bold text-slate-950">All interviews</h2>
                    <p className="!mt-2 text-sm text-slate-500">Browse every interview created from your account.</p>
                </div>
                <Button asChild className="group rounded-lg !bg-slate-950 !p-3 !text-white hover:!bg-white hover:!text-black hover:border-2">
                    <Link href="/dashboard/create-interview">
                        <Plus className="plus-rotate !h-4 !w-4" />
                        New interview
                    </Link>
                </Button>
            </div>

            <div className="flex items-center !gap-2 rounded-xl border border-slate-200 bg-white !px-3 shadow-sm">
                <Search className="!h-4 !w-4 text-slate-400" />
                <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by role or description"
                    className="border-0 shadow-none focus-visible:ring-0"
                />
            </div>

            {filteredInterviews.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white !p-10 text-center">
                    <h3 className="font-semibold text-slate-950">No matching interviews</h3>
                    <p className="!mt-2 text-sm text-slate-500">Create a new interview or adjust your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 !gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredInterviews.map((interview) => (
                        <InterviewCard interview={interview} key={interview.id || interview.interview_id} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default AllInterviewPage;
