'use client';
import { React, useContext, useEffect, useState } from 'react'
import Image from 'next/image';
import { Clock, Info, Video } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';
import { toast } from "sonner"
import { InterviewDataContext } from '@/context/InterviewDataContext';

function Interview() {

  const { interview_id } = useParams();
  // console.log(interview_id)
  const [interviewData, setInterviewData] = useState(null);
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState();
  const [loading, setLoading] = useState(false);
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext)

  const route = useRouter();

  useEffect(() => {
    // GetInterviewDetails();
    // if (interview_id) {
    // }
    interview_id && GetInterviewDetails();
  }, [interview_id])




  const GetInterviewDetails = async () => {
    setLoading(true);
    try {

      let { data: Interviews, error } = await supabase
        .from('Interviews')
        .select("jobPosition ,jobDescription,duration,type")
        .eq("interview_id", interview_id)
      setInterviewData(Interviews[0])
      setLoading(false)
      // console.log(Interviews[0])
      if (Interviews?.length == 0) {
        toast('Incorrect interview Link')
        return;
      }

    }
    catch (error) {
      setLoading(false)
      toast("Incorrect interview Link")
    }
  }


  const onJoinInterview = async () => {
    setLoading(true);

    let { data: Interviews, error } = await supabase
      .from('Interviews')
      .select('*')

      .eq('interview_id', interview_id)
    console.log(Interviews[0])


    setInterviewInfo({
      userName:username,
      userEmail:userEmail,
      interviewData:Interviews[0]
    });
    setTimeout(() => {
      route.push(`/interview/${interview_id}/start`);
    }, 50);
    setLoading(false);
  }
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center !px-4 !mt-3'>
      <div className='w-full max-w-2xl bg-white rounded-xl shadow-lg !p-8 flex flex-col items-center'>
        <Image src='/logo.png' alt='logo' width={200} height={100} className='w-[150px] !mb-6' />

        <h2 className='text-lg text-gray-700 !mt-3'>AI-Powered Interview Platform</h2>

        <Image src='/interview.png' alt='interview' width={500} height={500} className='w-[250px] h-[200px] !my-6' priority />

        <h2 className='font-bold text-xl'>{interviewData?.jobPosition}</h2>
        <h2 className='flex gap-2 items-center text-gray-500 !mt-1'>
          <Clock className='h-5 w-5' />  {interviewData?.duration} Minutes
        </h2>

        <div className='w-full !mt-6'>
          <h2 className='!mb-1 text-sm font-bold text-black'>Enter your full name</h2>
          <Input placeholder='E.g. Bharat' className={' !px-1'} onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div className='w-full !mt-6'>
          <h2 className='!mb-1 text-sm font-bold text-black'>Enter your Email</h2>
          <Input placeholder='E.g. Bharat@gmail.com' className={' !px-1'} onChange={(event) => setUserEmail(event.target.value)} />
        </div>

        <div className='!p-4 bg-blue-100 flex gap-4 rounded-lg !mt-6 w-full'>
          <Info className='text-blue-600' />
          <div>
            <h2 className='font-bold mb-1 text-blue-800'>Before you begin</h2>
            <ul className='text-sm text-blue-700 list-disc list-inside space-y-1'>
              <li>Ensure you have a stable internet connection</li>
              <li>Use a device with a working microphone & camera</li>
              <li>Be in a quiet and well-lit environment</li>
            </ul>
          </div>
        </div>

        <Button className='!mt-6 w-full font-bold text-white bg-blue-600 hover:bg-blue-700 transition'
          disabled={loading || !username}
          onClick={() => onJoinInterview()}>
          <Video className='w-5 h-5 mr-2' /> Join Interview
        </Button>
      </div>
    </div>
  )
}

export default Interview;
