"use client";
import { React, useState } from 'react'
import InterviewHeader from './_components/InterviewHeader';
// import { InterviewDataContext } from '@/context/InterviewDataContext';
function InterviewLayout({ children }) {
  // const [InterviewInfo, setInterviewInfo] = useState();
  return (

    // <InterviewDataContext.Provider value={{InterviewInfo, setInterviewInfo}}>
      <div className='bg-gray-50'>
        <InterviewHeader />
        {children}
      </div>
    // </InterviewDataContext.Provider>

  )
}

export default InterviewLayout
