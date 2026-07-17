import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useResumeStore } from "../lib/store";
import { extractTextFromPdf } from "../lib/pdf";
import { prepareInstructions, AIResponseFormat } from "../../constants";

export default function Upload() {
  const navigate = useNavigate();
  const { addResume } = useResumeStore();

  // Form states
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Status states
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".pdf")) {
        setFile(droppedFile);
        setError("");
      } else {
        setError("Only PDF files are supported for parsing.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf")) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Only PDF files are supported for parsing.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload your PDF resume.");
      return;
    }
    if (!jobTitle) {
      setError("Please enter the Job Title.");
      return;
    }
    if (!jobDescription) {
      setError("Please enter the Job Description.");
      return;
    }

    setLoading(true);
    setError("");
    setStatusText("Extracting text from PDF...");

    try {
      // 1. Extract text from PDF
      const resumeText = await extractTextFromPdf(file);
      if (!resumeText.trim()) {
        throw new Error("Unable to extract text content from the PDF file. Make sure it contains text rather than scanned images.");
      }

      setStatusText("Analyzing resume matching via Puter AI...");

      // 2. Prepare instructions and call Puter AI
      const prompt = `
${prepareInstructions({
  jobTitle,
  jobDescription,
  AIResponseFormat,
})}

Resume Content:
${resumeText}
`;

      if (typeof window === "undefined" || !window.puter) {
        throw new Error("Puter AI helper library is not loaded. Please wait a second and try again.");
      }

      const response = await window.puter.ai.chat(prompt);
      
      setStatusText("Parsing AI evaluation results...");

      // 3. Clean up the response (remove markdown code fences if present)
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/^```(json)?\n/, "");
        cleanedResponse = cleanedResponse.replace(/\n```$/, "");
      }

      // 4. Parse feedback
      const feedback = JSON.parse(cleanedResponse.trim());

      // 5. Build and save new resume representation
      const randomId = (Math.floor(Math.random() * 3) + 1).toString();
      const newResume = {
        id: Date.now().toString(),
        companyName: companyName || "Target Company",
        jobTitle: jobTitle,
        imagePath: `/images/resume_0${randomId}.png`,
        resumePath: "#",
        feedback: feedback,
      };

      addResume(newResume);
      setStatusText("Done!");
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during resume analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover bg-no-repeat bg-center pt-24 px-4 pb-12 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border border-slate-100 relative">
        <div className="mb-8 text-center">
          <h1 className="!text-4xl text-gradient font-bold mb-2">Evaluate Your Resume</h1>
          <p className="text-dark-200">Submit your resume against the target role and description to receive instant AI rating and scoring.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-div">
            <label className="text-sm font-semibold text-slate-700">Company Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Google, Stripe"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-div">
            <label className="text-sm font-semibold text-slate-700">Job Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="e.g. Frontend Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-div">
            <label className="text-sm font-semibold text-slate-700">Job Description <span className="text-red-500">*</span></label>
            <textarea
              placeholder="Paste the full job details, specifications, and expectations here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
              required
              disabled={loading}
            />
          </div>

          <div className="form-div">
            <label className="text-sm font-semibold text-slate-700">Upload PDF Resume <span className="text-red-500">*</span></label>
            
            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="uplader-drag-area border-2 border-dashed border-slate-300 hover:border-indigo-500 flex flex-col items-center justify-center gap-2 cursor-pointer select-none"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                />
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm font-medium text-slate-600">Drag and drop your PDF resume here, or <span className="text-indigo-600 hover:underline">browse</span></p>
                <p className="text-xs text-slate-400">Supporting only PDF file formats</p>
              </div>
            ) : (
              <div className="uploader-selected-file">
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 text-indigo-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <div className="truncate pr-4">
                    <p className="text-sm font-semibold text-slate-700 truncate">{file.name}</p>
                    <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  disabled={loading}
                  className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary-button flex items-center justify-center gap-2 h-12"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{statusText}</span>
              </>
            ) : (
              <span>Start Analysis</span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
