import React from "react";
import moment from "moment";
import { Copy, Mail, Timer } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

function InterviewCard({ interview }) {
        const getInterviewUrl = () => {
                const appUrl = (process.env.NEXT_PUBLIC_HOST_URL || (typeof window !== "undefined" ? window.location.origin : ""))
                        .replace(/\/+$/, "")
                        .replace(/\/interview$/, "");
                return `${appUrl}/interview/${interview?.interview_id}`;
        };

        const copyLink = () => {
                navigator.clipboard.writeText(getInterviewUrl());
                toast('Interview link copied');
        };

        const onSend = () => {
                const subject = encodeURIComponent("Interview Link");
                const body = encodeURIComponent(`Here is the interview link: ${getInterviewUrl()}`);
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
        };

        return (
                <article className="rounded-xl border border-slate-200 bg-white !p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex items-start justify-between !gap-4">
                                <div>
                                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                                                {moment(interview?.created_at).format('DD MMM YYYY')}
                                        </p>
                                        <h3 className="!mt-2 line-clamp-2 text-lg font-bold text-slate-950">
                                                {interview?.jobPosition || 'Untitled interview'}
                                        </h3>
                                </div>
                                <div className="flex items-center !gap-1 rounded-full bg-slate-100 !px-3 !py-1 text-xs font-semibold text-slate-700">
                                        <Timer className="!h-3.5 !w-3.5" />
                                        {interview?.duration || '--'} min
                                </div>
                        </div>

                        <p className="!mt-4 line-clamp-2 !min-h-[40px] text-sm leading-5 text-slate-500">
                                {interview?.jobDescription || 'Share this interview link with candidates when you are ready.'}
                        </p>

                        <div className="!mt-5 flex flex-wrap !gap-3">
                                <Button variant="outline" className="flex-1 !min-w-[120px] rounded-lg hover:!bg-blue-200 hover:!text-slate-950" onClick={copyLink}>
                                        <Copy className="!h-4 !w-4" />
                                        Copy
                                </Button>
                                <Button className="flex-1 !min-w-[120px] rounded-lg !bg-slate-950 !text-white hover:!bg-slate-800" onClick={onSend}>
                                        <Mail className="!h-4 !w-4" />
                                        Send
                                </Button>
                        </div>
                </article>
        );
}

export default InterviewCard;
