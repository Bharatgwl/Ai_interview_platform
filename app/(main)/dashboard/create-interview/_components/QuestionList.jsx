"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuestionListContainer from './QuestionListContainer';
import { supabase } from '@/services/supabaseClient'
import { useUser } from '@/app/Provider';
import { v4 as uuidv4 } from 'uuid';
import { BookmarkCheck } from 'lucide-react'; 
import { ListCheck } from 'lucide-react';
import InterviewLink from './InterviewLink';

function QuestionList({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (formData && formData.jobPosition) {
      GenerateQuestionList();

    }
  }, [formData]);





  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      console.log('Form data:', formData);
      const response = await axios.post('/api/ai-model', { ...formData });
      setQuestions(response.data.interviewQuestions);
      setLoading(false);

      // const response = await axios.post('/api/ai-model', { ...formData });

      // console.log('Raw response:', response.data.content);

      // const finalContent = response.data.content
      //   .replace("```json", "")
      //   .replace("```", "")
      //   .trim();

      // const parsed = JSON.parse(finalContent);
      // console.log('Parsed content:', parsed);

      // setQuestions(parsed?.interviewQuestions || []);
    } catch (error) {
      toast.error('Failed to generate questions.');
      console.error('Error parsing content:', error);
      setLoading(false);
    }

    // try {
    //   console.log(formData)
    //   const response = await axios.post('/api/ai-model',
    //     {
    //       ...formData
    //     }
    //   );
    //   // const response = null;

    //   console.log("Content" + response.data.content)
    //   // const Content = response.data.content;
    //   const finalContent = response.data.content
    //     .replace("```json", "")
    //     .replace("```", "")
    //     .trim();      // setQuestions(JSON.parse(Content));
    //   setQuestions(JSON.parse(finalContent)?.interviewQuestions);
    //   setLoading(false);
    // } catch (error) {
    //   toast.error('Server error, try again.');
    //   // console.error("Error fetching questions:", error);
    // }
  };
  const
    onFinish = async () => {
      setSaving(true)
      const interview_id = uuidv4();
      const { data, error } = await supabase
        .from('Interviews')
        .insert([
          {
            ...formData,
            Questions: questions,
            userEmail: user?.email,
            interview_id: interview_id
          },


        ])
        .select()
      setSaving(false);
      onCreateLink(interview_id)
      // console.log(data)

    }


  return (
    <div>
      {loading && (
        <div className='!p-5 !bg-blue-50 !rounded-xl !border !border-gray-200 !flex !gap-5 !items-center'>
          <Loader2Icon className="!animate-spin !w-6 !h-6 !text-blue-600" />
          <div>
            <h2 className="!font-semibold !text-blue-800">Generating Questions...</h2>
            <p className="!text-sm !text-gray-700">Our AI is crafting personalized questions based on your job role.</p>
          </div>
        </div>
      )}

      {questions?.length > 0 &&
        <div>
          <QuestionListContainer questions={questions} />
        </div>
      }
      <div className='flex justify-end'>
        <Button
          className='!p-2 !mt-4 !bg-black !text-white !rounded !transition-transform !duration-200 !cursor-pointer hover:!bg-white hover:!text-black active:!scale-95 hover:!border hover:!border-black'
          onClick={() => onFinish()}
        >
          {saving && <ListCheck />}
          Create Interview Link and Save
        </Button>


      </div>
    </div>
  );

}

export default QuestionList;
