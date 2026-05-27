import React from "react";
import moment from "moment";
import { Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useUser } from '@/app/Provider';
import Image from 'next/image';
import { toast } from 'sonner';

function InterviewCard({ interview }) {
        const { user } = useUser()
        const getInterviewUrl = () => {
                const appUrl = process.env.NEXT_PUBLIC_HOST_URL || window.location.origin;
                return `${appUrl}/interview/${interview?.interview_id}`;
        };
        const copyLink = () => {
                navigator.clipboard.writeText(getInterviewUrl());
                toast('Copied')
        }
        console.log(interview)
        const onSend = () => {
                const url = getInterviewUrl();
                const subject = encodeURIComponent("Interview Link");
                const body = encodeURIComponent(`Here is the interview link: ${url}`);
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
        };

        return (
                <div className="!p-5 bg-white rounded-lg border w-full max-w-md">
                        <div className="flex items-center justify-between bg-gray-200 !p-4 rounded-lg !mb-4">

                                <div className="!h-[40px] !w-[40px] rounded-full bg-white overflow-hidden">
                                        <Image
                                                src="/Round.png"
                                                alt="User Avatar"
                                                width={40}
                                                height={40}
                                                className="object-cover h-full w-full"
                                        />
                                </div>


                                <h2 className="text-sm">
                                        {moment(interview?.created_at).format('DD MMM YYYY')}
                                </h2>
                        </div>

                        <h2 className="!mt-3 font-bold text-lg">{interview?.jobPosition}</h2>
                        <h2 className="!mt-2 text-sm">{interview?.duration} min</h2>

                        <div className="flex flex-wrap gap-3 !mt-4">
                                <Button variant="outline" className="flex-1 min-w-[120px] cursor-pointer" onClick={copyLink} >
                                        <Copy className="!mr-2 !h-4 !w-4" /> Copy Link
                                </Button>
                                <Button className="flex-1 min-w-[120px] cursor-pointer" onClick={onSend}>Send</Button>
                        </div>
                </div>
        );
}

export default InterviewCard;
