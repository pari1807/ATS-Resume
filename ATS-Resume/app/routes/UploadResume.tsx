import { useState } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import { useResumeStore } from "~/lib/store";
import { extractTextFromPdf } from "~/lib/pdf";
import { AIResponseFormat, prepareInstructions } from "../../constants";

export default function Upload() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { addResume } = useResumeStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a resume PDF first!");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!companyName || !jobTitle || !jobDescription) {
      alert("Please fill in all job details (Company, Title, Description).");
      return;
    }

    setIsProcessing(true);
    try {
      setStatusText("Extracting text from PDF resume...");
      const resumeText = await extractTextFromPdf(file);

      if (!resumeText.trim()) {
        throw new Error("Could not extract text from the PDF. Please make sure the PDF has readable text.");
      }

      setStatusText("Analyzing resume compatibility using Puter AI...");
      const instructions = prepareInstructions({
        jobTitle,
        jobDescription,
        AIResponseFormat,
      });
      const prompt = `${instructions}\n\nResume Text:\n${resumeText}`;

      const response = await puter.ai.chat(prompt);

      setStatusText("Processing evaluation results...");
      let responseText = response.toString().trim();

      // Clean up markdown block format if present
      if (responseText.startsWith("```json")) {
        responseText = responseText.substring(7);
      } else if (responseText.startsWith("```")) {
        responseText = responseText.substring(3);
      }
      if (responseText.endsWith("```")) {
        responseText = responseText.substring(0, responseText.length - 3);
      }
      responseText = responseText.trim();

      const feedback = JSON.parse(responseText);

      const id = Date.now().toString();
      const resumePath = URL.createObjectURL(file);
      const imagePath = "/images/resume_01.png"; // Default fallback preview representation

      addResume({
        id,
        companyName,
        jobTitle,
        imagePath,
        resumePath,
        feedback,
      });

      navigate(`/resume/${id}`);
    } catch (err: any) {
      console.error("Analysis error:", err);
      alert("Failed to analyze resume: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  // Determine active stepper index
  const getActiveStep = () => {
    const text = statusText.toLowerCase();
    if (text.includes("extracting")) return 0;
    if (text.includes("analyzing") || text.includes("generating")) return 1;
    if (text.includes("processing") || text.includes("parsing")) return 2;
    return 0;
  };
  const activeStep = getActiveStep();

  return (
    <main className="max-w-4xl mx-auto px-4 pt-28 pb-16">
      {isProcessing ? (
        /* Dynamic Loader Page */
        <div className="glass-panel max-w-md mx-auto p-10 bg-white/95 text-center space-y-8 animate-in zoom-in-95 duration-500 shadow-premium-hover relative overflow-hidden select-none">
          {/* Scanning radar indicator */}
          <div className="relative w-24 h-24 mx-auto rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center pulse-glow">
            <svg className="w-10 h-10 text-primary-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="absolute inset-0 rounded-full border-t-2 border-primary-500 animate-spin" style={{ animationDuration: "3s" }} />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Analyzing Resume</h2>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Puter AI Engine Active</p>
          </div>

          {/* Stepper timeline vertical checklist */}
          <div className="text-left space-y-6 max-w-xs mx-auto pt-4 border-t border-brand-border">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                {activeStep > 0 ? (
                  <span className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">✓</span>
                ) : activeStep === 0 ? (
                  <span className="relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-primary-500 flex items-center justify-center text-white text-[10px] font-bold">1</span>
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold">1</span>
                )}
              </div>
              <div className="space-y-0.5">
                <h4 className={`text-xs font-bold ${activeStep >= 0 ? "text-slate-800" : "text-slate-400"}`}>Extracting Document Text</h4>
                <p className="text-[10px] text-slate-400">Parsing characters from the uploaded PDF</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                {activeStep > 1 ? (
                  <span className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">✓</span>
                ) : activeStep === 1 ? (
                  <span className="relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-primary-500 flex items-center justify-center text-white text-[10px] font-bold">2</span>
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold">2</span>
                )}
              </div>
              <div className="space-y-0.5">
                <h4 className={`text-xs font-bold ${activeStep >= 1 ? "text-slate-800" : "text-slate-400"}`}>AI Match Analysis</h4>
                <p className="text-[10px] text-slate-400">Comparing criteria with job description</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                {activeStep > 2 ? (
                  <span className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">✓</span>
                ) : activeStep === 2 ? (
                  <span className="relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-primary-500 flex items-center justify-center text-white text-[10px] font-bold">3</span>
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold">3</span>
                )}
              </div>
              <div className="space-y-0.5">
                <h4 className={`text-xs font-bold ${activeStep >= 2 ? "text-slate-800" : "text-slate-400"}`}>Generating Report</h4>
                <p className="text-[10px] text-slate-400">Structuring compatibility scorecard</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Form Module */
        <div className="glass-panel max-w-2xl mx-auto p-8 bg-white/95 shadow-premium animate-in fade-in duration-500 select-none">
          <div className="border-b border-brand-border pb-6 mb-6 space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-primary-600 border border-emerald-100/50">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
              Puter AI Evaluation
            </div>
            <h1 className="!text-2xl font-bold text-slate-855 tracking-tight mt-2">Analyze Resume Compatibility</h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Provide target job details and upload your resume to generate a compliance report.
            </p>
          </div>

          <form id="upload-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input type="text" name="company-name" placeholder="Google, Microsoft, etc." id="company-name" required />
              </div>

              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input type="text" name="job-title" placeholder="Frontend Developer, etc." id="job-title" required />
              </div>
            </div>

            <div className="form-div">
              <label htmlFor="job-description">Job Description</label>
              <textarea name="job-description" placeholder="Paste the job requirements, responsibilities, and expected skills here..." id="job-description" required />
            </div>

            <div className="form-div">
              <label htmlFor="uploader">Upload Resume</label>
              <FileUploader onFileSelect={handleFileSelect} />
            </div>

            <button className="primary-button w-full mt-4 py-3.5 hover:shadow-primary-500/10 text-sm font-semibold tracking-wide" type="submit">
              Analyze Application Compatibility
            </button>
          </form>
        </div>
      )}
    </main>
  );
} 