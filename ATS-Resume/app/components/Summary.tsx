import React from "react";
import ScoreCircle from "./ScoreCircle";

interface SummaryProps {
  feedback: Feedback;
}

export default function Summary({ feedback }: SummaryProps) {
  const score = feedback.overallScore;
  let statusText = "Needs Refinement";
  let statusColor = "text-amber-600 bg-amber-50 border-amber-100/50";
  
  if (score >= 80) {
    statusText = "Excellent Compliance";
    statusColor = "text-emerald-600 bg-emerald-50 border-emerald-100/50";
  } else if (score >= 65) {
    statusText = "Highly Compatible";
    statusColor = "text-primary-600 bg-primary-50 border-primary-100/50";
  }

  return (
    <div className="glass-panel p-6 bg-white/95 shadow-premium animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center sm:text-left">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
            {statusText}
          </span>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Application Compatibility Rating</h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md leading-relaxed">
            Your resume was analyzed against the target job requirements. The overall rating indicates how well your experience, skills, and tone match the requirements.
          </p>
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={score} />
        </div>
      </div>
      
      {/* Category Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
        {[
          { label: "ATS Score", val: feedback.ATS.score, color: "bg-primary-500" },
          { label: "Tone & Style", val: feedback.toneAndStyle.score, color: "bg-teal-500" },
          { label: "Content", val: feedback.content.score, color: "bg-indigo-500" },
          { label: "Skills", val: feedback.skills.score, color: "bg-emerald-600" },
        ].map((item, idx) => (
          <div key={idx} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</span>
            <div className="flex items-center justify-between">
              <span className="text-base font-extrabold text-slate-700">{item.val}%</span>
              <div className={`${item.color} w-2 h-2 rounded-full`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
