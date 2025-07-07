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
      <div className="flex gap-4 items-center">
        <ArrowLeft onClick={() => router.back()} className="w-6 h-6 text-gray-700 cursor-pointer" />
        <h2 className="font-bold !text-lg sm:!text-xl md:!text-2xl lg:!text-2xl xl:!text-2xl">
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
