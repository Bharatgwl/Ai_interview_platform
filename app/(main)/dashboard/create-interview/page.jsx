'use client'
import { React, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Progress } from "@/components/ui/progress"
import Form from './_components/Form'
import QuestionList from './_components/QuestionList'
import { toast } from "sonner"
import InterviewLink from './_components/InterviewLink'
function CreateInterview() {
  const router = useRouter()
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState();
  const [interviewId, setinterviewId] = useState();

  const OnhandleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));  
    console.log("Form data", formData);
    // setTimeout(() => {
    //   console.log("Form data after 2 seconds", formData);
    // }, 2000);

  }
  const OnGoToNext = () => {
    if (!formData?.jobPosition || !formData?.jobDescription || !formData?.duration || !formData?.type) {
      toast("Please Fill up all details ")
      return;
    }
    setStep(step + 1);
  }

  const onCreateLink = (interview_id) => {
    setinterviewId(interview_id);
    setStep(step + 1);
  }
  return (
    <div className="!mt-7 !px-4 sm:!px-6 md:!px-10 lg:!px-20 xl:!px-32 2xl:!px-48">
      <div className="flex items-center !gap-4">
        <ArrowLeft onClick={() => router.back()} className="!h-6 !w-6 cursor-pointer text-gray-700" />
        <h2 className="text-lg font-bold sm:text-xl md:text-2xl">
          Create New Interview
        </h2>
      </div>
      <Progress value={step * 33.33} className="!my-5" />
      {step == 1 ? <Form OnhandleInputChange={OnhandleInputChange} GoToNext={() => OnGoToNext()} />
        : step == 2 ? <QuestionList formData={formData} onCreateLink={(interview_id) => onCreateLink(interview_id)} />  
          : step == 3 ? <InterviewLink interview_id={interviewId} formData={formData} /> : null}
    </div>
  )
}

export default CreateInterview
