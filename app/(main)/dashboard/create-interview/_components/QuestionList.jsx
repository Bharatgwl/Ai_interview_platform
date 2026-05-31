"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BookmarkCheck, Loader2Icon, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { useUser } from "@/app/Provider";
import QuestionListContainer from "./QuestionListContainer";

function QuestionList({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (formData?.jobPosition) {
      GenerateQuestionList();
    }
  }, [formData]);

  const getToken = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    return sessionData?.session?.access_token;
  };

  const GenerateQuestionList = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Please sign in again before generating questions.");
        return;
      }

      const response = await axios.post(
        "/api/ai-model",
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuestions(response.data.interviewQuestions || []);
      if (response.data?.usage?.remainingCredits !== undefined) {
        toast.success(`Questions generated. Credits left: ${response.data.usage.remainingCredits}`);
      }
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to generate questions.";
      toast.error(message);
      console.error("Question generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async () => {
    if (saving || questions.length === 0) return;
    setSaving(true);

    try {
      const interview_id = uuidv4();
      const { data, error } = await supabase
        .from("Interviews")
        .insert([
          {
            ...formData,
            Questions: questions,
            userEmail: user?.email,
            interview_id,
          },
        ])
        .select();

      if (error) {
        toast.error(error.message || "Failed to save interview.");
        return;
      }

      const token = await getToken();
      if (token) {
        axios
          .post(
            "/api/interviews/record-created",
            { interview_id },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .catch((recordError) => {
            console.warn("Interview usage tracking failed:", recordError?.response?.data || recordError);
          });
      }

      if (data?.length) {
        toast.success("Interview link created.");
      }
      onCreateLink(interview_id);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="!space-y-5">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-950 !p-6 text-white">
          <div className="flex flex-col justify-between !gap-4 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center !gap-2 rounded-full bg-white/10 !px-3 !py-1 text-xs font-semibold text-cyan-100">
                <Sparkles className="!h-3.5 !w-3.5" />
                Step 2
              </div>
              <h2 className="!mt-3 text-2xl font-bold">Question generation studio</h2>
              <p className="!mt-2 text-sm text-slate-300">
                AI is preparing a structured interview for {formData?.jobPosition || "this role"}.
              </p>
            </div>
            <div className="rounded-xl bg-white/10 !px-4 !py-3">
              <p className="text-xs text-slate-300">Duration</p>
              <p className="!mt-1 text-lg font-bold">{formData?.duration || "-"} min</p>
            </div>
          </div>
        </div>

        <div className="!p-5 sm:!p-6">
          {loading && (
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 !p-5">
              <div className="flex items-center !gap-4">
                <div className="flex !h-12 !w-12 items-center justify-center rounded-xl bg-white text-cyan-700 shadow-sm">
                  <Loader2Icon className="!h-6 !w-6 animate-spin" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-950">Generating questions...</h3>
                  <p className="!mt-1 text-sm text-slate-600">
                    Building a balanced set across the selected interview types.
                  </p>
                </div>
              </div>

              <div className="!mt-5 grid !gap-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="animate-pulse rounded-xl bg-white !p-4">
                    <div className="!h-4 !w-3/4 rounded-full bg-slate-200" />
                    <div className="!mt-3 !h-3 !w-1/3 rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && questions.length > 0 && <QuestionListContainer questions={questions} />}
        </div>
      </section>

      <div className="flex flex-col justify-end !gap-3 sm:flex-row">
        <Button
          variant="outline"
          className="!h-11 rounded-lg border-slate-300 hover:!bg-slate-100 hover:!text-slate-950"
          onClick={GenerateQuestionList}
          disabled={saving || loading}
        >
          <RefreshCw className={`!h-4 !w-4 ${loading ? "animate-spin" : ""}`} />
          Regenerate
        </Button>
        <Button
          className="!h-11 rounded-lg !bg-slate-950 !text-white hover:!bg-slate-800"
          onClick={onFinish}
          disabled={saving || loading || questions.length === 0}
        >
          {saving ? <Loader2Icon className="!h-4 !w-4 animate-spin" /> : <BookmarkCheck className="!h-4 !w-4" />}
          Create interview link and save
        </Button>
      </div>
    </div>
  );
}

export default QuestionList;
