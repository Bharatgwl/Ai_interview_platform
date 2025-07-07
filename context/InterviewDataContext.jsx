// // context/InterviewDataContext.jsx
// "use client";
// import { createContext, useState } from "react";

// export const InterviewDataContext = createContext();

// export function InterviewDataProvider({ children }) {
//   const [interviewInfo, setInterviewInfo] = useState();

//   return (
//     <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
//       {children}
//     </InterviewDataContext.Provider>
//   );
// }
"use client";
import { createContext, useState, useEffect } from "react";

export const InterviewDataContext = createContext();

export function InterviewDataProvider({ children }) {
  const [interviewInfo, setInterviewInfoState] = useState(null);

  // Store in both memory and localStorage
  const setInterviewInfo = (info) => {
    setInterviewInfoState(info);
    if (typeof window !== "undefined") {
      localStorage.setItem("interviewInfo", JSON.stringify(info));
    }
  };

  // Load from localStorage on first render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("interviewInfo");
      if (stored) {
        setInterviewInfoState(JSON.parse(stored));
      }
    }
  }, []);

  return (
    <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
      {children}
    </InterviewDataContext.Provider>
  );
}
