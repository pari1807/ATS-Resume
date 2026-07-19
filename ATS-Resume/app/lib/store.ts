import { create } from "zustand";
import { resumes as initialResumes } from "../../constants";

interface ResumeStore {
  resumes: Resume[];
  addResume: (resume: Resume) => void;
  setResumes: (resumes: Resume[]) => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  resumes: initialResumes,
  addResume: (resume) => set((state) => ({ resumes: [resume, ...state.resumes] })),
  setResumes: (resumes) => set({ resumes }),
}));
