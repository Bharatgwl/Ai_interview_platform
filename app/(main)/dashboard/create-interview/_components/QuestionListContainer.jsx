import React from "react";
import { BadgeCheck } from "lucide-react";

function QuestionListContainer({ questions }) {
  return (
    <div className="!space-y-4">
      <div className="flex items-center justify-between !gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-950">Generated interview questions</h2>
          <p className="!mt-1 text-sm text-slate-500">Review the AI set before saving the candidate link.</p>
        </div>
        <span className="rounded-full bg-emerald-50 !px-3 !py-1 text-xs font-semibold text-emerald-700">
          {questions.length} ready
        </span>
      </div>

      <div className="grid !gap-3">
        {questions.map((q, index) => (
          <article
            key={`${q.question}-${index}`}
            className="group rounded-2xl border border-slate-200 bg-white !p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex items-start !gap-3">
              <div className="flex !h-9 !w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-7 text-slate-950">{q.question}</p>
                <div className="!mt-3 inline-flex items-center !gap-2 rounded-full bg-slate-50 !px-3 !py-1 text-xs font-medium text-slate-600">
                  <BadgeCheck className="!h-3.5 !w-3.5 text-cyan-600" />
                  {Array.isArray(q.type) ? q.type.join(", ") : q.type || "Interview"}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default QuestionListContainer;
