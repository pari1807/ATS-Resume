import React from "react";
import { useParams, Link } from "react-router";
import { useResumeStore } from "../lib/store";
import ScoreCircle from "../components/ScoreCircle";

export default function ResumeDetails() {
  const { id } = useParams();
  const { resumes } = useResumeStore();

  // Find active resume
  const resume = resumes.find((r) => r.id === id);

  if (!resume) {
    return (
      <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover pt-24 px-6 text-center">
        <h1 className="!text-3xl text-red-500 font-bold mb-4">Resume Not Found</h1>
        <p className="text-slate-600 mb-6">The requested resume evaluation does not exist or has been removed.</p>
        <Link to="/" className="primary-button w-fit mx-auto px-6 py-2">
          Back to Dashboard
        </Link>
      </main>
    );
  }

  const { feedback } = resume;

  return (
    <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover bg-no-repeat bg-center pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="resume-nav bg-white rounded-2xl shadow-sm border border-slate-100">
          <Link to="/" className="back-button hover:bg-slate-50 transition cursor-pointer">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-semibold text-slate-700">Back</span>
          </Link>
          <div className="text-right">
            <h2 className="!text-xl font-bold text-slate-900">{resume.companyName}</h2>
            <p className="text-sm text-slate-500">{resume.jobTitle}</p>
          </div>
        </div>

        {/* Detailed Feedback Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Side: Resume representation */}
          <div className="w-full lg:w-1/2 bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Resume Document View</h3>
            
            {resume.resumePath && resume.resumePath !== "#" ? (
              <div className="w-full h-[600px] rounded-lg overflow-hidden border border-slate-200">
                <iframe src={resume.resumePath} className="w-full h-full" title="Resume Document" />
              </div>
            ) : (
              <div className="gradient-border flex-1 min-h-[450px] flex items-center justify-center relative">
                <img
                  src={resume.imagePath}
                  alt="Resume preview representation"
                  className="max-h-[550px] w-auto object-contain rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Right Side: Score breakdowns & detailed categories */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            
            {/* Overall Score Circle Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center gap-6 shadow-sm justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Evaluation Summary</h3>
                <p className="text-sm text-slate-500 mt-1">Review the overall rating and breakdown of specific categories below.</p>
              </div>
              <div className="flex-shrink-0">
                <ScoreCircle score={feedback.overallScore} />
              </div>
            </div>

            {/* Category 1: ATS Compatibility */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <h4 className="font-bold text-slate-900">ATS Optimization</h4>
                </div>
                <span className="text-sm font-semibold text-slate-700">Score: {feedback.ATS.score}/100</span>
              </div>
              
              <div className="space-y-2">
                {feedback.ATS.tips && feedback.ATS.tips.length > 0 ? (
                  feedback.ATS.tips.map((tipObj, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-start gap-3 ${
                        tipObj.type === "good"
                          ? "bg-emerald-50/50 border-emerald-100 text-emerald-800"
                          : "bg-amber-50/50 border-amber-100 text-amber-800"
                      }`}
                    >
                      <span className="mt-0.5 font-bold">{tipObj.type === "good" ? "✓" : "⚡"}</span>
                      <p className="text-sm">{tipObj.tip}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">No specific recommendations recorded for this section.</p>
                )}
              </div>
            </div>

            {/* Dynamic detailed section list helper */}
            {[
              { title: "Tone & Style", data: feedback.toneAndStyle, color: "bg-purple-500" },
              { title: "Content Quality", data: feedback.content, color: "bg-indigo-500" },
              { title: "Formatting & Structure", data: feedback.structure, color: "bg-pink-500" },
              { title: "Skills Relevance", data: feedback.skills, color: "bg-teal-500" },
            ].map((section, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${section.color}`}></span>
                    <h4 className="font-bold text-slate-900">{section.title}</h4>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Score: {section.data.score}/100</span>
                </div>
                
                <div className="space-y-3">
                  {section.data.tips && section.data.tips.length > 0 ? (
                    section.data.tips.map((tipObj, tipIdx) => (
                      <div
                        key={tipIdx}
                        className={`p-4 rounded-xl border flex flex-col gap-1.5 ${
                          tipObj.type === "good"
                            ? "bg-emerald-50/50 border-emerald-100 text-emerald-950"
                            : "bg-amber-50/50 border-amber-100 text-amber-950"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <span>{tipObj.type === "good" ? "✓" : "⚡"}</span>
                          <span>{tipObj.tip}</span>
                        </div>
                        {tipObj.explanation && (
                          <p className="text-xs text-slate-600 pl-5 leading-relaxed">{tipObj.explanation}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic">No specific recommendations recorded for this section.</p>
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
