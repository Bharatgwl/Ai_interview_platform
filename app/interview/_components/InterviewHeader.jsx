import React from 'react'
import Image from 'next/image';

function InterviewHeader() {
  return (
    <div className='!p-4 shadow-lg bg-white'>
      <Image src='/logo.png' alt='logo' width={200} height={100} className='w-[150px] mb-6' priority />
    </div>

  )
}

export default InterviewHeader;
