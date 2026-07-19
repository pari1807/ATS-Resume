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

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" className="w-full" alt="Processing..." />
            </>
          ) : (
            <h2>Drop your resume for an ATS score and improvement tips</h2>
          )}
          {!isProcessing && (
            <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input type="text" name="company-name" placeholder="Company Name" id="company-name" required />
              </div>

              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input type="text" name="job-title" placeholder="Job Title" id="job-title" required />
              </div>

              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea name="job-description" placeholder="Job Description" id="job-description" required />
              </div>

              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button className="primary-button" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
} 