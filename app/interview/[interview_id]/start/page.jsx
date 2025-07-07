// "use client";
// import { React, useEffect, useContext, useState, useRef } from 'react'
// import { InterviewDataContext } from '@/context/InterviewDataContext';
// import Image from 'next/image';
// import { useUser } from '@/app/Provider';
// import { Timer, Mic, Phone } from 'lucide-react';
// import Vapi from '@vapi-ai/web';
// // import QuestionList from './../../../(main)/dashboard/create-interview/_components/QuestionList';
// import AlertConfirmation from './_components/AlertConfirmation';
// import { toast } from 'sonner';
// import axios from 'axios';
// import { supabase } from '@/services/supabaseClient';
// import { useParams, useRouter } from 'next/navigation';
// function StartInterview() {

//   // const key = process.env.NEXT_PUBLIC_VAPI_API_KEY
//   // const vapi = new Vapi(key);

//   const key = process.env.NEXT_PUBLIC_VAPI_API_KEY;
//   const vapiRef = useRef(null);
//   const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
//   const [isUserSpeaking, setIsUserSpeaking] = useState(false);
//   const [conversation, setConversation] = useState();
//   const {interview_id} = useParams()
//   const { user } = useUser();
//   const router = useRouter();
//   // console.log(interviewInfo)
//   // console.log("interviewInfo:", interviewInfo);

//   useEffect(() => {
//     if (key && !vapiRef.current) {
//       vapiRef.current = new Vapi(key);

//       vapiRef.current.on("call-start", () => {
//         toast("Call Connected...");
//       });

//       vapiRef.current.on("speech-start", () => {
//         setIsUserSpeaking(true); // user starts speaking
//       });

//       vapiRef.current.on("speech-end", () => {
//         setIsUserSpeaking(false); // user stops → AI likely responds next
//       });


//       vapiRef.current.on("call-end", () => {
//         toast("Interview ended.");
//         GenerateFeedback();
//       });

//       vapiRef.current?.on("message", (message) => {
//         console.log("Vapi msg", message?.conversation)
//         setConversation(message?.conversation)
//       })
//     }
//   }, [key]);

//   // Start the interview when info is ready
//   useEffect(() => {
//     if (interviewInfo && vapiRef.current) {
//       startCall();
//     }
//   }, [interviewInfo]);

//   // useEffect(() => {
//   //   interviewInfo && startCall();
//   // }, [interviewInfo])



//   const startCall = () => {
//     let QuestionList;
//     interviewInfo?.interviewData?.Questions.forEach((item, index) => (
//       QuestionList = item?.question + "," + QuestionList
//     ));
//     // const QuestionList = interviewInfo?.interviewData?.Questions
//     //   ?.map((item) => item?.question)
//     //   ?.filter(Boolean) // removes null or undefined
//     //   ?.join(', ');
//     // console.log(QuestionList)

//     const assistantOptions = {
//       name: "AI Recruiter",
//       firstMessage: "Hi " + interviewInfo?.userName + ", how are you? Ready for your interview on " + interviewInfo?.interviewData?.jobPosition,
//       transcriber: {
//         provider: "deepgram",
//         model: "nova-2",
//         language: "en-US",
//       },
//       voice: {
//         provider: "11labs",
//         voiceId: "21m00Tcm4TlvDq8ikWAM",
//         // provider: "elevenlabs",
//         // voiceId: "bella",
//       },
//       model: {
//         provider: "openai",
//         model: "gpt-4",
//         messages: [
//           {
//             role: "system",
//             content: `
// You are an AI voice assistant conducting interviews.
// Your job is to ask candidates provided interview questions, assess their responses.
// Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
// "Hey there! Welcome to your `+ interviewInfo?.interviewData?.jobPosition + ` interview. Let’s get started with a few questions!"
// Ask one question at a time and wait for the candidate’s response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
// Questions: `+ QuestionList + `
// If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
// "Need a hint? Think about how React tracks component updates!"
// Provide brief, encouraging feedback after each answer. Example:
// "Nice! That’s a solid answer."
// "Hmm, not quite! Want to try again?"
// Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let’s tackle a tricky one!"
// After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
// "That was great! You handled some tough questions well. Keep sharpening your skills!"
// End on a positive note:
// "Thanks for chatting! Hope to see you crushing projects soon!"
// Key Guidelines:
// ✅ Be friendly, engaging, and witty
// ✅ Keep responses short and natural, like a real conversation
// ✅ Adapt based on the candidate’s confidence level
// ✅ Ensure the interview remains focused on React
// `.trim(),
//           },
//         ],
//       },
//     };
//     // console.log("Final Assistant Options:", assistantOptions);

//     // vapi.start(assistantOptions);
//     vapiRef.current?.start(assistantOptions);
//   }

//   // const StopInterview = () => {
//   //     setAiSpeaking(true);     // AI stops when user speaks
//   //   setUserSpeaking(true);
//   //   toast("Disconneting...")
//   //   vapi.stop()
//   // }

//   // vapi.on("call-start", () => {
//   //   toast("Call Connected...")
//   // });
//   // vapi.on("speech-start", () => {
//   //   setAiSpeaking(true);     // AI stops when user speaks
//   //   setUserSpeaking(false);    // User starts speaking
//   // });

//   // vapi.on("speech-end", () => {
//   //   setUserSpeaking(true);   // User stops
//   //   setAiSpeaking(false);      // AI starts speaking
//   // });
//   // vapi.on("call-end", () => {
//   //   toast("Itnerview ended.")
//   // })

//   const StopInterview = () => {
//     setIsUserSpeaking(false);
//     toast("Disconnecting...");
//     vapiRef.current?.stop();

//   };



//   const GenerateFeedback = async () => {
//     const result = await axios.post('/api/ai-feedback', {
//       conversation: conversation
//     })
//     // console.log(result?.data);
//     const Content = result.data.content;
//     const FINAL_CONTENT = Content.replace(/```json|```/g, '').trim();

//     console.log(FINAL_CONTENT)


//     const { data, error } = await supabase
//       .from('interview-feedback')
//       .insert([
//         { 
//           userName:interviewInfo?.userName,
//           userEmail:interviewInfo?.userEmail,
//           interview_id :interview_id,
//           feedback:JSON.parse(FINAL_CONTENT),
//           recommended:false,
//         },
//       ])
//       .select()

//       console.log(data)

//       router.replace("/interview/"+interview_id+"/completed");

//   }


//   return (

//     <div className='!p-20 lg:!px-48 xl:px-56 bg-gray-100'>
//       <h2 className='text-xl font-bold flex justify-between'>AI Interview Session
//         <span className='flex gap-2 items-center'>
//           <Timer />
//           00:00:00
//         </span>
//       </h2>



//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 !mt-5 justify-items-center">

//         <div className="bg-white w-full max-w-sm !h-72 rounded-lg border shadow-sm flex flex-col gap-3 items-center justify-center">
//           <div className="relative">
//             {!isUserSpeaking && (
//               <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />
//             )}            <Image
//               src="/Ai.ico"
//               alt="AI Icon"
//               width={90}
//               height={90}
//               className="w-[60px] h-[60px] rounded-full object-cover"
//             />
//           </div>
//           <h2>Ai Recruiter</h2>
//         </div>


//         <div className="bg-white w-full max-w-sm h-72 rounded-lg border shadow-sm flex flex-col gap-3 items-center justify-center">
//           <div className="relative">
//             {isUserSpeaking && (
//               <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />
//             )}
//             {
//               user?.picture ? (
//                 <Image
//                   src={user?.picture}
//                   alt="Candidate"
//                   width={90}
//                   height={90}
//                   className="w-[60px] h-[60px] rounded-full object-cover"
//                   priority
//                 />
//               ) :
//                 (
//                   <span className="text-gray-400 text-sm">No Picture Available</span>
//                 )}
//           </div>
//           <h2 className='text-'>{interviewInfo?.userName}</h2>
//         </div>
//       </div>
//       <div className="w-full flex justify-center items-center !my-6">
//         <div className="flex gap-6">
//           <Mic className="!h-12 !w-12 !p-3 bg-gray-500 text-white rounded-full cursor-pointer " />
//           <AlertConfirmation stopInterview={() => StopInterview()}>
//            <Phone className="!h-12 !w-12 !p-3 bg-red-600 text-white rounded-full cursor-pointer" />
//          </AlertConfirmation>
//         </div>
//       </div>



//       <h2 className="text-gray-400 text-sm text-center !mt-3">Interview in Progress...</h2>
//     </div>
//   )
// }

// export default StartInterview
"use client";

import { useEffect, useContext, useState, useRef } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { InterviewDataContext } from '@/context/InterviewDataContext';
import { useUser } from '@/app/Provider';
import { Timer, Mic, Phone } from 'lucide-react';
import Vapi from '@vapi-ai/web';
import { toast } from 'sonner';
import axios from 'axios';
import { supabase } from '@/services/supabaseClient';
import AlertConfirmation from './_components/AlertConfirmation';
import TimerComponent from './_components/TimerComponent';

function StartInterview() {
  const key = process.env.NEXT_PUBLIC_VAPI_API_KEY;
  const vapiRef = useRef(null);
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [conversation, setConversation] = useState([]);
  const { interview_id } = useParams();
  const { user } = useUser();
  const router = useRouter();

  // Initialize Vapi and register listeners
  useEffect(() => {
    if (!key || vapiRef.current) return;

    const vapi = new Vapi(key);
    vapiRef.current = vapi;

    const handleCallStart = () => toast("Call Connected...");
    const handleSpeechStart = () => setIsUserSpeaking(true);
    const handleSpeechEnd = () => setIsUserSpeaking(false);
    const handleCallEnd = () => {
      toast("Interview ended.");
      GenerateFeedback();
    };
    const handleMessage = (message) => {
      console.log("Vapi msg", message?.conversation);
      if (message?.conversation) {
        setConversation((prev) => [...prev, message.conversation]);
      }
    };

    vapi.on("call-start", handleCallStart);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("call-end", handleCallEnd);
    vapi.on("message", handleMessage);

    // Cleanup listeners on unmount
    return () => {
      vapi.off("call-start", handleCallStart);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("call-end", handleCallEnd);
      vapi.off("message", handleMessage);
    };
  }, [key]);

  // Start the interview when info is ready
  useEffect(() => {
    if (interviewInfo && vapiRef.current) {
      startCall();
    }
  }, [interviewInfo]);

  const startCall = () => {
    const questions = interviewInfo?.interviewData?.Questions
      ?.map((item) => item?.question)
      ?.filter(Boolean)
      ?.join(', ');

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo?.userName}, how are you? Ready for your interview on ${interviewInfo?.interviewData?.jobPosition}?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "11labs",
        voiceId: "21m00Tcm4TlvDq8ikWAM",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
You are an AI voice assistant conducting interviews.
Begin with a friendly intro, ask questions one by one, wait for answers.
Use these questions: ${questions}
Give feedback, help when stuck, and wrap up with encouragement.
Always stay focused on React and be witty and engaging.
`.trim(),
          },
        ],
      },
    };

    vapiRef.current?.start(assistantOptions);
  };

  const StopInterview = () => {
    setIsUserSpeaking(false);
    toast("Disconnecting...");
    vapiRef.current?.stop();
  };

  const GenerateFeedback = async () => {
    if (!conversation || conversation.length < 2) { // or whatever threshold you want
      toast.error("No meaningful interview data to generate feedback.");
      router.replace(`/interview/${interview_id}/notcompleted`);
      return;
    }
    try {
      const result = await axios.post('/api/ai-feedback', {
        conversation: conversation
      });
      const content = result?.data?.content;
      const FINAL_CONTENT = content.replace(/```json|```/g, '').trim();
      let feedbackParsed;
      try {
        feedbackParsed = JSON.parse(FINAL_CONTENT);
      } catch (err) {
        console.error("⚠️ JSON parsing failed. Storing raw content as feedback.");
        feedbackParsed = { raw_feedback: FINAL_CONTENT }; // fallback format
      }
      const { data, error } = await supabase
        .from('interview-feedback')
        .insert([
          {
            userName: interviewInfo?.userName,
            userEmail: interviewInfo?.userEmail,
            interview_id: interview_id,
            feedback: feedbackParsed,
            recommended: false,
          },
        ])
        .select();
      console.log("✅ Feedback stored:", data);
      router.replace(`/interview/${interview_id}/completed`);
    } catch (error) {
      console.error("❌ Feedback Generation Error:", error);
      toast.error("Error generating feedback.");
    }
  };

  return (
    <div className="!p-20 lg:!px-48 xl:px-56 bg-gray-100">
      <h2 className="text-xl font-bold flex justify-between">
        AI Interview Session
        <span className="flex gap-2 items-center">
          <Timer />
          <TimerComponent start={true} />
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 !mt-5 justify-items-center">
        {/* AI Recruiter */}
        <div className="bg-white w-full max-w-sm h-72 rounded-lg border shadow-sm flex flex-col gap-3 items-center justify-center">
          <div className="relative">
            {!isUserSpeaking && (
              <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />
            )}
            <Image
              src="/Ai.ico"
              alt="AI Icon"
              width={90}
              height={90}
              className="w-[60px] h-[60px] rounded-full object-cover"
            />
          </div>
          <h2>AI Recruiter</h2>
        </div>

        {/* Candidate */}
        <div className="bg-white w-full max-w-sm h-72 rounded-lg border shadow-sm flex flex-col gap-3 items-center justify-center">
          <div className="relative">
            {isUserSpeaking && (
              <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />
            )}
            {user?.picture ? (
              <Image
                src={user?.picture}
                alt="Candidate"
                width={90}
                height={90}
                className="w-[60px] h-[60px] rounded-full object-cover"
                priority
              />
            ) : (
              <span className="text-gray-400 text-sm">No Picture Available</span>
            )}
          </div>
          <h2>{interviewInfo?.userName}</h2>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full flex justify-center items-center my-6">
        <div className="flex gap-6">
          <Mic className="!h-12 !w-12 !p-3 bg-gray-500 text-white rounded-full cursor-pointer" />
          <AlertConfirmation stopInterview={StopInterview}>
            <Phone className="!h-12 !w-12 !p-3 bg-red-600 text-white rounded-full cursor-pointer" />
          </AlertConfirmation>
        </div>
      </div>

      <h2 className="text-gray-400 text-sm text-center !mt-3">Interview in Progress...</h2>
    </div>
  );
}

export default StartInterview;
