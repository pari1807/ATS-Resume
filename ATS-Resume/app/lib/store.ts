import { create } from "zustand";
import { resumes as initialResumes } from "../../constants";

interface ResumeStore {
  resumes: Resume[];
  addResume: (resume: Resume) => void;
  setResumes: (resumes: Resume[]) => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  resumes: [],
  addResume: (resume) => set((state) => {
    const updated = [resume, ...state.resumes];
    if (typeof window !== "undefined") {
      localStorage.setItem("matchrate_resumes", JSON.stringify(updated));
    }
    return { resumes: updated };
  }),
  setResumes: (resumes) => set({ resumes }),
}));
