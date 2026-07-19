import type { Route } from "./+types/home";
import { Link } from "react-router";
import { useEffect } from "react";
import ResumeCard from "../components/ResumeCard";
import { useResumeStore } from "../lib/store";
import { usePuterStore } from "~/lib/puter";
import { resumes as initialResumes } from "../../constants";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Dashboard | MatchRate" },
    { name: "description", content: "AI-Powered ATS Resume Tracker" },
  ];
}

export default function Home() {
  const { resumes, setResumes } = useResumeStore();
  const { kv } = usePuterStore();

  useEffect(() => {
    const syncWithKV = async () => {
      try {
        const kvPairs = await kv.list("resume:*", true);
        if (kvPairs && kvPairs.length > 0) {
          const kvResumes: Resume[] = kvPairs.map((pair: any) => {
            const data = JSON.parse(pair.value);
            return {
              id: data.id,
              companyName: data.companyName,
              jobTitle: data.jobTitle,
              imagePath: data.imagePath,
              resumePath: data.resumePath,
              feedback: data.feedback,
            };
          });

          // Filter out null/empty analyses
          const validKvResumes = kvResumes.filter(r => r.feedback);

          // Combine with mock initialResumes (Google, Microsoft, Apple)
          const combined = [...validKvResumes];
          initialResumes.forEach((mock) => {
            if (!combined.some((r) => r.id === mock.id)) {
              combined.push(mock);
            }
          });

          setResumes(combined);
        }
      } catch (err) {
        console.error("Failed to sync store with Puter KV:", err);
      }
    };

    syncWithKV();
  }, []);

  const totalResumes = resumes.length;
  const averageScore = totalResumes > 0 
    ? Math.round(resumes.reduce((acc, curr) => acc + curr.feedback.overallScore, 0) / totalResumes) 
    : 0;
  const highlyCompatible = resumes.filter(r => r.feedback.overallScore >= 80).length;

  return (
    <main className="max-w-6xl mx-auto px-4 pt-28 pb-16 select-none">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2 max-w-2xl">
          <h1 className="!text-3xl sm:!text-4xl font-extrabold text-slate-900 tracking-tight">
            ATS Evaluation <span className="text-primary-500">Dashboard</span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Track your job applications, view deep AI metrics, and optimize your resume compliance.
          </p>
        </div>
        {totalResumes > 0 && (
          <Link to="/upload" className="primary-button w-fit py-2.5 px-5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Analyze New Resume
          </Link>
        )}
      </div>

      {totalResumes > 0 ? (
        <div className="space-y-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {/* Stat 1 */}
            <div className="glass-panel p-6 flex flex-row items-center gap-4 bg-white/90">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Scanned</p>
                <h4 className="text-2xl font-bold text-slate-800">{totalResumes} Resumes</h4>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="glass-panel p-6 flex flex-row items-center gap-4 bg-white/90">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average ATS Score</p>
                <h4 className="text-2xl font-bold text-slate-800">{averageScore}% Rating</h4>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="glass-panel p-6 flex flex-row items-center gap-4 bg-white/90">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Highly Compatible</p>
                <h4 className="text-2xl font-bold text-slate-800">{highlyCompatible} Resumes</h4>
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <div className="space-y-4 animate-in fade-in duration-700 delay-150">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">Recent Evaluations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel max-w-xl mx-auto p-12 text-center flex flex-col items-center justify-center space-y-6 mt-16 bg-white/80 animate-in zoom-in-95 duration-500 shadow-premium">
          <div className="w-20 h-20 rounded-3xl bg-primary-50 border border-primary-100/50 flex items-center justify-center text-primary-500 shadow-sm animate-pulse">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v12m0 0l-4-4m4 4l4-4m0-4V3m0 0l-4 4m4-4l4 4" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800">No evaluations found</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
              Upload your first resume PDF and target job description to get a complete ATS compatibility report.
            </p>
          </div>

          <Link to="/upload" className="primary-button px-8 shadow-lg hover:shadow-primary-500/20">
            Upload & Analyze Resume
          </Link>
        </div>
      )}
    </main>
  );
}
