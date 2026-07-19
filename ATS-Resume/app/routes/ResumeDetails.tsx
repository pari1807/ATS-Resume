import React from "react";
import { useParams, Link } from "react-router";
import { useResumeStore } from "../lib/store";
import ScoreCircle from "../components/ScoreCircle";

export default function ResumeDetails() {
  const { id } = useParams();
  const { resumes } = useResumeStore();

  // Find active resume
  const resume = resumes.find((r) => r.id === id);
  const isMockResume = resume ? ["1", "2", "3"].includes(resume.id) : false;

  if (!resume) {
    return (
      <main className="max-w-md mx-auto pt-32 px-4 text-center select-none">
        <div className="glass-panel p-8 bg-white/95 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 mx-auto">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="!text-xl font-bold text-slate-800">Resume Not Found</h1>
            <p className="text-slate-500 text-sm">The requested resume evaluation does not exist or has been removed.</p>
          </div>
          <Link to="/" className="primary-button inline-flex w-full">
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const { feedback } = resume;

  return (
    <main className="max-w-7xl mx-auto px-4 pt-28 pb-16 select-none animate-in fade-in duration-700">
      <div className="space-y-8">
        
        {/* Sticky Sub-Header bar */}
        <div className="glass-panel p-4 px-6 flex flex-row justify-between items-center bg-white/95 sticky top-20 z-10">
          <Link to="/" className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary-600 transition-colors duration-200 group">
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="text-right">
            <h2 className="!text-base font-bold text-slate-800">{resume.companyName}</h2>
            <p className="text-xs text-slate-400 font-medium">{resume.jobTitle}</p>
          </div>
        </div>

        {/* Detailed Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Side: Sticky document frame */}
          <div className="w-full lg:w-5/12 lg:sticky lg:top-36 bg-white/95 rounded-3xl border border-brand-border p-5 shadow-premium flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="text-sm font-bold text-slate-800">Resume Document Preview</h3>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">
                {isMockResume ? "Mock Preview" : "PDF Source"}
              </span>
            </div>
            
            {resume.resumePath && resume.resumePath !== "#" && !isMockResume ? (
              <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-brand-border bg-slate-50 shadow-inner">
                <iframe src={resume.resumePath} className="w-full h-full" title="Resume Document" />
              </div>
            ) : (
              <div className="flex-1 min-h-[450px] flex items-center justify-center relative bg-brand-bg rounded-2xl border border-dashed border-brand-border p-2">
                <img
                  src={resume.imagePath}
                  alt="Resume preview"
                  className="max-h-[500px] w-auto object-contain rounded-xl shadow-md border border-brand-border bg-white"
                />
              </div>
            )}
          </div>

          {/* Right Side: Score breakdowns & breakdown category cards */}
          <div className="w-full lg:w-7/12 flex flex-col gap-6">
            
            {/* Overall Score Circle Card */}
            <div className="glass-panel p-6 flex flex-row items-center justify-between gap-6 bg-white/95">
              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-lg font-bold text-slate-800">ATS Assessment Result</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Review the general score computed for your resume against the targeted job requirements and skills list.
                </p>
              </div>
              <div className="flex-shrink-0">
                <ScoreCircle score={feedback.overallScore} />
              </div>
            </div>

            {/* Category 1: ATS Compatibility */}
            <div className="glass-panel p-6 bg-white/95 space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  <h4 className="font-bold text-slate-800 text-sm tracking-tight">ATS Compliance Metrics</h4>
                </div>
                <div className="flex items-center gap-3">
                  {/* Category Progress Bar */}
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${feedback.ATS.score}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{feedback.ATS.score}% Compatibility</span>
                </div>
              </div>
              
              <div className="space-y-2">
                {feedback.ATS.tips && feedback.ATS.tips.length > 0 ? (
                  feedback.ATS.tips.map((tipObj, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed transition-colors duration-200
                        ${tipObj.type === "good"
                          ? "bg-primary-50/30 border-primary-100/50 text-slate-700"
                          : "bg-amber-50/30 border-amber-100/50 text-slate-700"
                        }
                      `}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {tipObj.type === "good" ? (
                          <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-amber-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        )}
                      </div>
                      <p className="font-medium">{tipObj.tip}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No specific recommendations recorded for this section.</p>
                )}
              </div>
            </div>

            {/* Dynamic detailed section list helper */}
            {[
              { title: "Tone & Style Compliance", data: feedback.toneAndStyle, color: "bg-teal-500" },
              { title: "Content & Achievement Quality", data: feedback.content, color: "bg-emerald-500" },
              { title: "Formatting & Structure Compliance", data: feedback.structure, color: "bg-green-500" },
              { title: "Skills Relevance & Match Rate", data: feedback.skills, color: "bg-emerald-600" },
            ].map((section, idx) => (
              <div key={idx} className="glass-panel p-6 bg-white/95 space-y-4">
                <div className="flex items-center justify-between border-b border-brand-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${section.color}`}></span>
                    <h4 className="font-bold text-slate-800 text-sm tracking-tight">{section.title}</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Category Progress Bar */}
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${section.data.score}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{section.data.score}% Compatibility</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {section.data.tips && section.data.tips.length > 0 ? (
                    section.data.tips.map((tipObj, tipIdx) => (
                      <div
                        key={tipIdx}
                        className={`p-4 rounded-2xl border flex flex-col gap-1.5 transition-colors duration-200
                          ${tipObj.type === "good"
                            ? "bg-primary-50/30 border-primary-100/50 text-slate-800"
                            : "bg-amber-50/30 border-amber-100/50 text-slate-800"
                          }
                        `}
                      >
                        <div className="flex items-start gap-2.5 text-xs font-bold">
                          <div className="flex-shrink-0 mt-0.5">
                            {tipObj.type === "good" ? (
                              <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            )}
                          </div>
                          <span>{tipObj.tip}</span>
                        </div>
                        {tipObj.explanation && (
                          <p className="text-[11px] text-slate-500 pl-6.5 leading-relaxed font-medium">
                            {tipObj.explanation}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No specific recommendations recorded for this section.</p>
                  )}
                </div>
              </div>
            ))}

          </div>

        </div>

      </div>
    </main>
  );
}
