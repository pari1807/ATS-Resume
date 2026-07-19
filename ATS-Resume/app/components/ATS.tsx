import React, { useState } from "react";

interface ATSTip {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: ATSTip[];
}

export default function ATS({ score, suggestions }: ATSProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="glass-panel bg-white/95 shadow-premium overflow-hidden transition-all duration-300">
      {/* Header (Toggle click area) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
          <h3 className="font-bold text-slate-800 text-sm tracking-tight sm:text-base">ATS Compliance Metrics</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
              <div className="h-full bg-primary-500 rounded-full" style={{ width: `${score}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-700">{score}% Compliance</span>
          </div>
          <svg 
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Collapsible content with smooth transitions */}
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] border-t border-brand-border" : "max-h-0"}`}>
        <div className="p-6 space-y-3">
          {suggestions && suggestions.length > 0 ? (
            suggestions.map((tipObj, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed transition-all duration-200
                  ${tipObj.type === "good"
                    ? "bg-primary-50/30 border-primary-100/50 text-slate-700 hover:bg-primary-50/50"
                    : "bg-amber-50/30 border-amber-100/50 text-slate-700 hover:bg-amber-50/50"
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
                <p className="font-semibold text-slate-700">{tipObj.tip}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No specific recommendations recorded for this section.</p>
          )}
        </div>
      </div>
    </div>
  );
}
