import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import React, { useState, useEffect } from "react";

interface ResumeCardProps {
  resume: Resume;
}

export default function ResumeCard({ resume }: ResumeCardProps) {
  const isMockResume = ["1", "2", "3"].includes(resume.id);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    let active = true;
    let url = "";

    const loadImg = async () => {
      if (!isMockResume && resume.imagePath) {
        try {
          const blob = await window.puter.fs.read(resume.imagePath);
          if (active) {
            url = URL.createObjectURL(blob);
            setImageUrl(url);
          }
        } catch (err) {
          console.error("Failed to load dashboard card preview image:", err);
        }
      } else {
        setImageUrl(resume.imagePath);
      }
    };

    loadImg();

    return () => {
      active = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [resume, isMockResume]);
  // the rendered has not revoked the part that wil e communicateed further 

  const renderSrc = imageUrl || (isMockResume ? resume.imagePath : "/images/resume_01.png");

  return (
    <Link
      to={`/resume/${resume.id}`}
      className="glass-panel-interactive p-6 flex flex-col justify-between h-[450px] w-full max-w-[360px] animate-in fade-in duration-700 block select-none bg-white/95 group"
    >
      <div className="flex flex-row justify-between items-start gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-800 truncate">{resume.companyName}</h3>
          <p className="text-sm font-medium text-slate-500 truncate">{resume.jobTitle}</p>
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={resume.feedback.overallScore} />
        </div>
      </div>

      <div className="relative mt-4 flex-1 w-full rounded-2xl overflow-hidden border border-brand-border bg-slate-50">
        <img
          src={renderSrc}
          alt={`${resume.jobTitle || "Resume"} at ${resume.companyName || "Unknown"}`}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 via-transparent to-transparent pointer-events-none" />
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-border text-xs text-brand-muted">
        <span>AI ATS Assessment</span>
        <span className="font-semibold text-primary-600 group-hover:text-primary-700 flex items-center gap-1">
          View Details
          <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
