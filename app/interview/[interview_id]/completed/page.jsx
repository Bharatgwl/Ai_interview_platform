// app/interview/[interview_id]/completed/page.tsx
"use client";

import React from 'react';

const CompletedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-lg shadow-md !p-10 flex flex-col items-center">
        <div className="flex items-center gap-3 !mb-4">
          <svg
            className="!w-10 !h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
          </svg>
          <h1 className="text-3xl font-semibold text-gray-800">Interview Completed!</h1>
        </div>
        <p className="!mt-2 text-lg text-gray-700 max-w-xl">
          Your feedback has been submitted successfully.
        </p>
        <div className="!mt-6">
          <a
            href="/dashboard"
            className="flex items-center cursor-pointer gap-2 !mt-2 !p-1 !px-2 
    border border-gray-300 rounded-md transition-all duration-300 ease-in-out 
    hover:border-primary hover:bg-black hover:!text-white"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default CompletedPage;
