import React, { useState } from "react";

interface DetailTip {
  type: "good" | "improve";
  tip: string;
  explanation: string;
}

interface DetailSection {
  score: number;
  tips: DetailTip[];
}

interface DetailsProps {
  feedback: Feedback;
}

export default function Details({ feedback }: DetailsProps) {
  // States to track open/closed sections
  const [openSections, setOpenSections] = useState({
    tone: true,
    content: false,
    structure: false,
    skills: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sectionsList = [
    {
      key: "tone" as const,
      title: "Tone & Style Compliance",
      data: feedback.toneAndStyle,
      color: "bg-teal-500",
      shadow: "shadow-[0_0_8px_rgba(20,184,166,0.4)]"
    },
    {
      key: "content" as const,
      title: "Content & Achievement Quality",
      data: feedback.content,
      color: "bg-emerald-500",
      shadow: "shadow-[0_0_8px_rgba(16,185,129,0.4)]"
    },
    {
      key: "structure" as const,
      title: "Formatting & Structure Compliance",
      data: feedback.structure,
      color: "bg-green-500",
      shadow: "shadow-[0_0_8px_rgba(34,197,94,0.4)]"
    },
    {
      key: "skills" as const,
      title: "Skills Relevance & Match Rate",
      data: feedback.skills,
      color: "bg-emerald-600",
      shadow: "shadow-[0_0_8px_rgba(5,150,105,0.4)]"
    }
  ];

  return (
    <div className="space-y-4">
      {sectionsList.map((section, idx) => {
        const isSectionOpen = openSections[section.key];
        return (
          <div 
            key={idx} 
            className="glass-panel bg-white/95 shadow-premium overflow-hidden transition-all duration-300"
          >
            {/* Header / Click trigger */}
            <div 
              onClick={() => toggleSection(section.key)}
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${section.color} ${section.shadow}`} />
                <h4 className="font-bold text-slate-800 text-sm tracking-tight sm:text-base">{section.title}</h4>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${section.data.score}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{section.data.score}% Compatibility</span>
                </div>
                <svg 
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isSectionOpen ? "transform rotate-180" : ""}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Collapsible items list */}
            <div className={`transition-all duration-300 ease-in-out ${isSectionOpen ? "max-h-[1500px] border-t border-brand-border" : "max-h-0"}`}>
              <div className="p-6 space-y-4">
                {section.data.tips && section.data.tips.length > 0 ? (
                  section.data.tips.map((tipObj, tipIdx) => (
                    <div
                      key={tipIdx}
                      className={`p-4 rounded-2xl border flex flex-col gap-1.5 transition-all duration-200
                        ${tipObj.type === "good"
                          ? "bg-primary-50/30 border-primary-100/50 text-slate-800 hover:bg-primary-50/50"
                          : "bg-amber-50/30 border-amber-100/50 text-slate-800 hover:bg-amber-50/50"
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
                        <span className="text-slate-800 leading-tight">{tipObj.tip}</span>
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

          </div>
        );
      })}
    </div>
  );
}
