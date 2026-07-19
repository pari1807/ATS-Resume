import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { useResumeStore } from "../lib/store";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export default function ResumeDetails() {
  const { id } = useParams();
  const { resumes } = useResumeStore();
  const { kv, fs, isLoading } = usePuterStore();

  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoadingKV, setIsLoadingKV] = useState(true);

  useEffect(() => {
    // 1. Check local Zustand store
    const found = resumes.find((r) => r.id === id);
    if (found) {
      setResume(found);
      setIsLoadingKV(false);
    } else {
      // Check localStorage backup
      let localFound = null;
      if (typeof window !== "undefined") {
        const localData = localStorage.getItem("matchrate_resumes");
        if (localData) {
          try {
            const list = JSON.parse(localData) as Resume[];
            localFound = list.find(r => r.id === id) || null;
          } catch (e) {
            console.error(e);
          }
        }
      }

      if (localFound) {
        setResume(localFound);
        setIsLoadingKV(false);
      } else if (typeof window !== "undefined" && window.puter && window.puter.auth.isSignedIn()) {
        // 2. Fetch from Puter Key-Value cloud storage
        const loadFromKV = async () => {
          try {
            const dataStr = await kv.get(`resume:${id}`);
            if (dataStr) {
              setResume(JSON.parse(dataStr));
            }
          } catch (err) {
            console.error("Failed to load resume from Puter KV:", err);
          } finally {
            setIsLoadingKV(false);
          }
        };
        loadFromKV();
      } else {
        setIsLoadingKV(false);
      }
    }
  }, [id, resumes]);

  const isMockResume = resume ? ["1", "2", "3"].includes(resume.id) : false;
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!resume || isLoading) return;

    let active = true;
    let urlPdf = "";
    let urlImg = "";

    const loadAssets = async () => {
      // Load PDF
      if (!isMockResume && resume.resumePath && resume.resumePath !== "#") {
        try {
          const rawBlob = await fs.read(resume.resumePath);
          const pdfBlob = new Blob([rawBlob], { type: "application/pdf" });
          if (active) {
            urlPdf = URL.createObjectURL(pdfBlob);
            setPdfUrl(urlPdf);
          }
        } catch (err) {
          console.error("Failed to load PDF from Puter Storage:", err);
        }
      }

      // Load Image preview representation
      if (!isMockResume && resume.imagePath) {
        try {
          const rawBlob = await fs.read(resume.imagePath);
          const imgBlob = new Blob([rawBlob], { type: "image/png" });
          if (active) {
            urlImg = URL.createObjectURL(imgBlob);
            setImageUrl(urlImg);
          }
        } catch (err) {
          console.error("Failed to load image preview from Puter Storage:", err);
        }
      } else if (isMockResume) {
        setImageUrl(resume.imagePath);
      }
    };

    loadAssets();

    return () => {
      active = false;
      if (urlPdf) URL.revokeObjectURL(urlPdf);
      if (urlImg) URL.revokeObjectURL(urlImg);
    };
  }, [resume, isMockResume, isLoading, fs]);

  if (isLoadingKV) {
    return (
      <main className="max-w-md mx-auto pt-32 px-4 text-center select-none">
        <div className="glass-panel p-8 bg-white/95 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-primary-500 mx-auto pulse-glow">
            <svg className="w-8 h-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18v3" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-slate-400">Loading analysis from Puter Cloud...</p>
        </div>
      </main>
    );
  }

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
        
        {/* Sub-Header bar */}
        <div className="glass-panel p-4 px-6 flex flex-row justify-between items-center bg-white/95">
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
          <div className="w-full lg:w-5/12 lg:sticky lg:top-20 bg-white/95 rounded-3xl border border-brand-border p-5 shadow-premium flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="text-sm font-bold text-slate-800">Resume Document Preview</h3>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">
                {isMockResume ? "Mock Preview" : "PDF Source"}
              </span>
            </div>
            
            {pdfUrl ? (
              <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-brand-border bg-slate-50 shadow-inner">
                <iframe src={pdfUrl} className="w-full h-full" title="Resume Document" />
              </div>
            ) : !isMockResume && resume.resumePath && resume.resumePath !== "#" ? (
              <div className="w-full h-[600px] rounded-2xl border border-brand-border bg-slate-50/50 flex flex-col items-center justify-center space-y-3 animate-pulse">
                <svg className="w-10 h-10 text-primary-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-xs font-semibold text-slate-400">Loading document from Puter Storage...</p>
              </div>
            ) : (
              <div className="flex-1 min-h-[450px] flex items-center justify-center relative bg-brand-bg rounded-2xl border border-dashed border-brand-border p-2">
                <img
                  src={imageUrl || "/images/resume_01.png"}
                  alt="Resume preview"
                  className="max-h-[500px] w-auto object-contain rounded-xl shadow-md border border-brand-border bg-white"
                />
              </div>
            )}
          </div>

          {/* Right Side: Score breakdowns & breakdown category cards */}
          <div className="w-full lg:w-7/12 flex flex-col gap-6 animate-in fade-in duration-1000">
            <Summary feedback={feedback} />
            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
            <Details feedback={feedback} />
          </div>

        </div>

      </div>
    </main>
  );
}
