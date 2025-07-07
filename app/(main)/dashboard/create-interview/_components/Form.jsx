"use client"
import { React, useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InterviewType } from '@/services/Constant'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
// import { GlobalLayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'

function Form({ OnhandleInputChange, GoToNext }) {
  const [interviewType, setInterviewType] = useState([]);
  const [formData, setFormData] = useState({
    jobPosition: '',
  });
  useEffect(() => {
    if (interviewType) {
      OnhandleInputChange('type', interviewType)
      // console.log("Updated Form Data:", formData);
    }
  }, [interviewType]);
  const AddInterviewType = (type) => {
    const data = interviewType.includes(type);
    if (!data) {
      setInterviewType(prev => [...prev, type]);
    } else {
      const result = interviewType.filter(item => item !== type);
      setInterviewType(result);
    }
  }
  const handleInputChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, jobPosition: value }));
    OnhandleInputChange('jobPosition', value);
  };
  return (
    <div className='!p-5 bg-gray-200 rounded-2xl' >
      <div>
        <h2 className='text-md font'>Job Position</h2>
        <Input
          placeholder="E.g. Full Stack Developer"
          className="!p-1 !mt-2 transition-all duration-500 ease-in-out hover:border-primary"
          value={formData.jobPosition}
          onChange={handleInputChange}
        // value={formData?.jobPosition}
        // onChange={(event) =>
        // }
        />
      </div>
      <div className='!mt-5'>
        <h2 className='text-md font'>Job Description</h2>
        <Textarea placeholder="Enter details for job description."
          className="h-[200px] !mt-2 !p-1 transition-all duration-400 ease-in-out hover:border-primary"
          onChange={(event) => OnhandleInputChange('jobDescription', event.target.value)} />

      </div>
      <div className='!mt-5'>
        <h2 className='text-md font'>Interview Duration</h2>
        <Select onValueChange={(value) => OnhandleInputChange('duration', value)}>
          <SelectTrigger
            className="w-full !mt-2 !p-1 border border-gray-300 rounded-md transition-all duration-500 ease-in-out hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>

          <SelectContent
            className="bg-white border border-gray-300 shadow-lg rounded-md !mt-2"
          >
            <div className="flex flex-col divide-y divide-gray-200">
              <SelectItem
                value="5"
                className="!p-2 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                5 Min
              </SelectItem>
              <SelectItem
                value="15"
                className="!p-2 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                15 Min
              </SelectItem>
              <SelectItem
                value="30"
                className="!p-2 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                30 Min
              </SelectItem>
              <SelectItem
                value="45"
                className="!p-2 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                45 Min
              </SelectItem>
              <SelectItem
                value="60"
                className="!p-2 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                60 Min
              </SelectItem>
            </div>
          </SelectContent>
        </Select>
      </div>
      <div className='!mt-5'>
        <h2 className='text-md font '>Interview Type</h2>
        {/* <div className='flex flex-wrap gap-3 !mt-2'>

          {InterviewType.map((type, index) => (
            <div key={index} className={`flex items-center cursor-pointer gap-2 !mt-2 !p-1 !px-2 bg-gray-200 border border-gray-300 rounded-md transition-all duration-500 ease-in-out hover:border-primary hover:bg-white
              ${interviewType.includes(type.title) && 'bg-white text-black'}`
            }
              onClick={() => setInterviewType(prev => [...prev, type.title])}>
              <type.icon className='' />
              <span> {type.title}</span>
            </div>
          ))}
        </div> */}
        <div className='flex flex-wrap gap-3 !mt-2'>
          {InterviewType.map((type, index) => {
            const isSelected = interviewType.includes(type.title);

            return (
              <div
                key={index}
                className={`
          flex items-center cursor-pointer gap-2 !mt-2 !p-1 !px-2 
          border border-gray-300 rounded-md transition-all duration-300 ease-in-out 
          hover:border-primary 
          ${isSelected ? 'bg-black text-white' : 'bg-gray-200 text-black hover:bg-white'}
        `}
                onClick={() =>
                  AddInterviewType(type.title)

                }
              >
                <type.icon className='' />
                <span>{type.title}</span>
              </div>
            );
          })}
        </div>

      </div>
      <div className='flex justify-end !mt-8'>
        <Button
          className="!p-2 bg-black text-white hover:bg-gray-800 hover:scale-[1.02] transition-all duration-300 ease-in-out"
          onClick={() => GoToNext()}
        >
          Generate Question <ArrowRight />
        </Button>
      </div>
    </div >
  )
}

export default Form
