"use client";

import { useEffect, useContext, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { InterviewDataContext } from '@/context/InterviewDataContext';
import { Timer, Mic, MicOff, Phone, Sparkles, Volume2 } from 'lucide-react';
import Vapi from '@vapi-ai/web';
import { toast } from 'sonner';
import axios from 'axios';
import { supabase } from '@/services/supabaseClient';
import AlertConfirmation from './_components/AlertConfirmation';
import TimerComponent from './_components/TimerComponent';

function StartInterview() {
  const key = process.env.NEXT_PUBLIC_VAPI_API_KEY;
  const vapiRef = useRef(null);
  const callStartedRef = useRef(false);
  const feedbackStartedRef = useRef(false);
  const callStartedAtRef = useRef(null);
  const voiceUsageRecordedRef = useRef(false);
  const { interviewInfo } = useContext(InterviewDataContext);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [conversation, setConversation] = useState([]);
  const { interview_id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (isCallEnded && !feedbackStartedRef.current) {
      feedbackStartedRef.current = true;
      GenerateFeedback();
    }
  }, [isCallEnded]);

  useEffect(() => {
    if (!key) {
      toast.error("Missing Vapi public key. Add NEXT_PUBLIC_VAPI_API_KEY in Vercel.");
    }
  }, [key]);

  useEffect(() => {
    if (!key || vapiRef.current) return;

    const vapi = new Vapi(key);
    vapiRef.current = vapi;

    const handleCallStart = () => {
      callStartedAtRef.current = Date.now();
      toast("Interview connected");
    };
    const handleSpeechStart = () => setIsAiSpeaking(true);
    const handleSpeechEnd = () => setIsAiSpeaking(false);
    const handleCallEnd = () => {
      setIsAiSpeaking(false);
      callStartedRef.current = false;
      setIsCallEnded(true);
    };
    const handleError = (error) => {
      const isMeetingEnded =
        error?.errorMsg === "Meeting has ended" ||
        error?.error?.msg === "Meeting has ended" ||
        error?.error?.type === "ejected";

      if (isMeetingEnded) {
        setIsAiSpeaking(false);
        callStartedRef.current = false;
        return;
      }

      console.error("Vapi error:", error);
      toast.error("Unable to start the interview call. Check the Vapi key and assistant permissions.");
    };
    const handleMessage = (message) => {
      if (message?.conversation) {
        setConversation(message.conversation);
      }
    };

    vapi.on("call-start", handleCallStart);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("call-end", handleCallEnd);
    vapi.on("error", handleError);
    vapi.on("message", handleMessage);

    return () => {
      vapi.off("call-start", handleCallStart);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("call-end", handleCallEnd);
      vapi.off("error", handleError);
      vapi.off("message", handleMessage);
    };
  }, [key]);

  const startCall = useCallback(() => {
    const questions = interviewInfo?.interviewData?.Questions
      ?.map((item) => item?.question)
      ?.filter(Boolean)
      ?.join(', ');

    const assistantOptions = {
      name: "AI Recruiter",
      customerJoinTimeoutSeconds: 60,
      silenceTimeoutSeconds: 600,
      endCallFunctionEnabled: false,
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
Ask one question at a time and wait for the candidate response before continuing.
Keep the tone friendly, concise, and professional.
Questions: ${questions}
After the final question, thank the candidate and close the interview.
            `.trim(),
          },
        ],
      },
    };

    vapiRef.current?.start(assistantOptions);
  }, [interviewInfo]);

  useEffect(() => {
    if (interviewInfo && vapiRef.current && !callStartedRef.current) {
      callStartedRef.current = true;
      startCall();
    }
  }, [interviewInfo, startCall]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    vapiRef.current?.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  const StopInterview = () => {
    setIsAiSpeaking(false);
    toast("Ending interview...");
    vapiRef.current?.stop();
    callStartedRef.current = false;
    setIsCallEnded(true);
  };

  const GenerateFeedback = async () => {
    if (!voiceUsageRecordedRef.current && callStartedAtRef.current) {
      voiceUsageRecordedRef.current = true;
      const elapsedSeconds = Math.max(Math.round((Date.now() - callStartedAtRef.current) / 1000), 1);
      axios.post('/api/interviews/voice-usage', {
        interview_id,
        elapsedSeconds,
      }).catch((error) => {
        console.error("Voice usage tracking failed:", error?.response?.data || error);
      });
    }

    const hasUserMessage = conversation.some((msg) => msg.role === 'user');
    if (!hasUserMessage) {
      toast.error("No meaningful interview data to generate feedback.");
      router.replace(`/interview/${interview_id}/notcompleted`);
      return;
    }

    try {
      const result = await axios.post('/api/ai-feedback', {
        conversation,
        interview_id,
      });
      const content = result?.data?.content;
      const FINAL_CONTENT = content.replace(/```json|```/g, '').trim();
      let feedbackParsed;

      try {
        feedbackParsed = JSON.parse(FINAL_CONTENT);
      } catch (err) {
        feedbackParsed = { raw_feedback: FINAL_CONTENT };
      }

      await supabase
        .from('interview-feedback')
        .insert([
          {
            userName: interviewInfo?.userName,
            userEmail: interviewInfo?.userEmail,
            interview_id,
            feedback: feedbackParsed,
            recommended: false,
          },
        ]);

      router.replace(`/interview/${interview_id}/completed`);
    } catch (error) {
      console.error("Feedback Generation Error:", error);
      toast.error("Error generating feedback.");
    }
  };

  return (
    <main className="!min-h-screen bg-slate-950 !px-4 !py-6 text-white sm:!px-8">
      <div className="!mx-auto flex !min-h-[calc(100vh-48px)] !max-w-6xl flex-col">
        <header className="flex flex-col justify-between !gap-4 rounded-2xl border border-white/10 bg-white/10 !p-5 backdrop-blur md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center !gap-2 rounded-full bg-cyan-400/10 !px-3 !py-1 text-xs font-medium text-cyan-200">
              <Sparkles className="!h-3.5 !w-3.5" />
              AI Interview Session
            </div>
            <h1 className="!mt-3 text-2xl font-bold">{interviewInfo?.interviewData?.jobPosition || 'Interview in progress'}</h1>
          </div>
          <div className="flex items-center !gap-3 rounded-xl bg-black/20 !px-4 !py-3">
            <Timer className="!h-5 !w-5 text-cyan-200" />
            <TimerComponent start={true} />
          </div>
        </header>

        <section className="grid flex-1 items-center !gap-5 !py-8 lg:grid-cols-2">
          <div className={`relative rounded-2xl border !p-8 text-center transition ${
            isAiSpeaking ? 'border-cyan-300 bg-cyan-400/10 shadow-[0_0_60px_rgba(34,211,238,0.2)]' : 'border-white/10 bg-white/5'
          }`}>
            <div className="relative !mx-auto flex !h-36 !w-36 items-center justify-center">
              {isAiSpeaking && (
                <>
                  <span className="absolute inset-0 rounded-full bg-cyan-300/25 animate-ping" />
                  <span className="absolute inset-4 rounded-full bg-cyan-300/20 animate-pulse" />
                </>
              )}
              <Image src="/Ai.ico" alt="AI recruiter" width={96} height={96} className="relative !h-24 !w-24 rounded-full object-cover ring-4 ring-white/15" />
            </div>
            <h2 className="!mt-6 text-xl font-bold">AI Recruiter</h2>
            <p className="!mt-2 text-sm text-slate-300">{isAiSpeaking ? 'Speaking now' : 'Listening for responses'}</p>
            <div className="!mt-5 inline-flex items-center !gap-2 rounded-full bg-white/10 !px-4 !py-2 text-sm text-slate-200">
              <Volume2 className="!h-4 !w-4" />
              Voice assistant
            </div>
          </div>

          <div className={`rounded-2xl border !p-8 text-center transition ${
            !isAiSpeaking ? 'border-emerald-300 bg-emerald-400/10' : 'border-white/10 bg-white/5'
          }`}>
            <div className="!mx-auto flex !h-36 !w-36 items-center justify-center rounded-full bg-white text-4xl font-bold text-slate-950 ring-4 ring-white/15">
              {(interviewInfo?.userName || 'C').charAt(0).toUpperCase()}
            </div>
            <h2 className="!mt-6 text-xl font-bold">{interviewInfo?.userName || 'Candidate'}</h2>
            <p className="!mt-2 text-sm text-slate-300">{isAiSpeaking ? 'Candidate microphone ready' : 'Your turn to answer'}</p>
          </div>
        </section>

        <footer className="flex flex-col items-center !gap-4 rounded-2xl border border-white/10 bg-white/10 !p-5 backdrop-blur">
          <p className="text-sm text-slate-300">{isMuted ? 'Microphone muted' : 'Interview in progress'}</p>
          <div className="flex items-center !gap-4">
            <button
              onClick={toggleMute}
              className={`flex !h-14 !w-14 items-center justify-center rounded-full transition ${
                isMuted ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' : 'bg-white/15 text-white hover:bg-white/25'
              }`}
              aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? <MicOff className="!h-6 !w-6" /> : <Mic className="!h-6 !w-6" />}
            </button>
            <AlertConfirmation stopInterview={StopInterview}>
              <button className="flex !h-14 !w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-950/30 transition hover:bg-red-700" aria-label="End interview">
                <Phone className="!h-6 !w-6 rotate-[135deg]" />
              </button>
            </AlertConfirmation>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default StartInterview;
