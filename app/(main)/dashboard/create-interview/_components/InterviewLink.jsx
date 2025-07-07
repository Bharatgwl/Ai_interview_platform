import React from 'react'
import Image from 'next/image';
import { ArrowDown, Copy, Clock, List, Calendar, Mail, ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';
function InterviewLink({ interview_id, formData }) {
    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setDate(today.getDate() + 30); // Add 30 days

    const formattedDate = expiryDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
    // const final_url = "https://bird-innocent-sunbeam.ngrok-free.app" + '/' + interview_id
    const final_url = "http://localhost:3001/interview" + '/' + interview_id
    const getUrl = () => {
        let url = process.env.NEXT_PUBLIC_HOST_URL
        return final_url
    }

    const onCopyLink = async () => {
        await navigator.clipboard.writeText(final_url);
        toast("Link copied")
    }
    return (


        <div className='flex flex-col items-center px-6 py-10 bg-white rounded-xl shadow-md'>
            <Image
                src="/check.png"
                alt="check"
                width={200}
                height={200}
                className="w-[60px] h-[60px] mb-4"
            />

            <h2 className='font-bold text-xl text-gray-800 !mt-4'>
                Your AI Interview is Ready!!
            </h2>
            <p className='!mt-2 text-sm text-gray-600'>
                Share this link to schedule interview with candidates
            </p>

            <div className='w-full max-w-xl !p-6 mt-8 rounded-lg bg-gray-200 border'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='!p-1 !px-3 border bg-blue-50 text-blue-800 rounded-full flex items-center gap-2 text-sm font-medium'>
                        Interview link
                        <ArrowDown className="animate-bounce w-4 h-4 text-blue-600" />
                    </h2>
                    <h2 className='!p-1 !px-3 text-blue-700 border bg-blue-50 rounded-full text-sm font-medium'>
                        Valid for 30 Days
                    </h2>
                </div>

                <div className='!mt-2 flex gap-3 items-center'>
                    <Input
                        className='bg-black text-white text-sm !px-3 !py-2 rounded-md focus:outline-none w-full'
                        defaultValue={getUrl()}
                        disabled
                    />
                    <Button className='!p-2 !px-4 border bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all cursor-pointer'
                        onClick={() => onCopyLink()}>
                        <Copy className='w-4 h-4 mr-1' />
                        Copy Link
                    </Button>
                </div>
            </div>


            <hr className='!my-10 border-t border-gray-300 w-full max-w-xl' />

            {/* POST-HR CONTENT */}
            <div className='flex justify-around !w-full !max-w-xl !mt-6 !bg-gray-100 !px-4 !py-3 !rounded-lg !shadow-sm'>
                {/* Duration */}
                <div className='flex items-center !gap-2 !text-sm !text-gray-800'>
                    <Clock className='!w-4 !h-4 !text-blue-600' />
                    <span>{formData?.duration} mins</span>
                </div>

                {/* Question count */}
                <div className='flex items-center !gap-2 !text-sm !text-gray-800'>
                    <List className='!w-4 !h-4 !text-green-600' />
                    <span>10 questions</span>
                </div>

                {/* Expiry */}
                <div className='flex items-center !gap-2 !text-sm !text-gray-800'>
                    <Calendar className='!w-4 !h-4 !text-red-600' />
                    <span>Expires on {formattedDate}</span>
                </div>
            </div>

            {/* Share Via Section */}
            <div className='!mt-7 bg-white !p-5 rounded-lg !shadow-md'>
                <h2 className='font-bold text-lg text-gray-800'>Share Via</h2>

                <div className='flex gap-5 !mt-4 flex-wrap'>
                    <Button className='!p-2 !px-4 !bg-blue-600 !text-white hover:!bg-blue-700 !rounded-md !shadow-sm transition'>
                        <Mail className='!w-4 !h-4 mr-2' /> Email
                    </Button>
                    <Button className='!p-2 !px-4 !bg-green-600 !text-white hover:!bg-green-700 !rounded-md !shadow-sm transition'>
                        <Mail className='!w-4 !h-4 mr-2' /> SMS
                    </Button>
                    <Button className='!p-2 !px-4 !bg-emerald-600 !text-white hover:!bg-emerald-700 !rounded-md !shadow-sm transition'>
                        <Mail className='!w-4 !h-4 mr-2' /> WhatsApp
                    </Button>
                </div>
            </div>

            {/* Action Buttons */}

            <div className='flex w-full gap-5 justify-between !mt-6'>
                <Link href={'/dashboard'}>

                    <Button className='!p-2 !px-4 !mx-2 !my-2 !bg-gray-100 !text-gray-800 hover:!bg-gray-200 !rounded-md !shadow'>
                        <ArrowLeft className='!w-4 !h-4 mr-2' /> Back to Dashboard
                    </Button>
                </Link>
                <Link href={'/dashboard/create-interview'}>
                    <Button className='!p-2 !px-4 !mx-2 !my-2 !bg-blue-600 !text-white hover:!bg-blue-700 !rounded-md !shadow-md'>
                        <Plus className='!w-4 !h-4 mr-2' /> Create New Interview
                    </Button>
                </Link>
            </div>


        </div>

    );
}

export default InterviewLink;
