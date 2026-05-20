"use client"
import { React, useState, useEffect } from 'react'
import { Camera, AnotherIcon, Video } from "lucide-react";
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabaseClient';
import { useUser } from '@/app/Provider';
import InterviewCard from '../dashboard/_component/InterviewCard';
import Link from 'next/link';
function page() {
    const [interviewList, setInterviewList] = useState([]);
    const { user } = useUser()

    useEffect(() => {
        user && GetInterviewList()
    }, [user])
    const GetInterviewList = async () => {
        let { data: Interviews, error } = await supabase
            .from('Interviews')
            .select('*')
            .eq('userEmail', user?.email)
            .order('id', { ascending: false })
            .limit(6)
        console.log(Interviews)
        setInterviewList(Interviews)
    }


    return (
        <div className='!my-5'>
            <h2 className='font-bold text-2xl'>All Previously Created Interviews</h2>

            {interviewList?.length == 0 &&
                <div className='flex flex-col justify-center items-center !h-40 bg-gray-200 rounded-lg'>
                    <Camera className='!h-10 !w-10 text-primary' />
                    <h2 className='!mt-3 font-semibold text-gray-500'>No Interviews Created Yet!</h2>
                    <Link href="/dashboard/create-interview">
                        <Button className='!mt-1 !p-3 cursor-pointer'>+ Create New Interview</Button>
                    </Link>
                </div>
            }
            {interviewList &&
                < div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 !gap-5 !mt-5'>
                    {interviewList.map((interview, index) => (
                        <InterviewCard interview={interview} key={index} />
                    ))}
                </div>
            }
        </div>
    )
}


export default page