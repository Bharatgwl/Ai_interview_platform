"use client"
import { React, useState } from 'react'
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabaseClient';

function LatestInterviewsList() {
    const [interviewList, setInterviewList] = useState([]);

    const GetInterviewList = async() => {

        let { data: Interviews, error } = await supabase
            .from('Interviews')
            .select('*')
            .eq('')

    }
    return (
        <div className='!my-5'>
            <h2 className='font-bold text-2xl'>Previously created interviews</h2>

            {interviewList?.length == 0 &&
                <div className='flex flex-col justify-center items-center !h-40 bg-gray-200 rounded-lg'>
                    <Camera className='!h-10 !w-10 text-primary' />
                    <h2 className='!mt-3 font-semibold text-gray-500'>No Interviews Created Yet!</h2>
                    <Button className='!mt-1 !p-3 cursor-pointer '>+ Create New Interview</Button>
                </div>
            }
        </div>
    )
}

export default LatestInterviewsList
