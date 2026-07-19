import { useState, useEffect } from "react";
import { extractTextFromPdf } from "./pdf";

export function usePuterStore() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPuter = () => {
      if (typeof window !== "undefined" && window.puter) {
        setIsLoading(false);
      } else {
        setTimeout(checkPuter, 100);
      }
    };
    checkPuter();
  }, []);

  const fs = {
    upload: async (files: File[]) => {
      const result = await window.puter.fs.upload(files);
      return Array.isArray(result) ? result[0] : result;
    },
    read: async (path: string) => {
      return await window.puter.fs.read(path);
    }
  };

  const ai = {
    feedback: async (filePath: string, instructions: string) => {
      const blob = await window.puter.fs.read(filePath);
      const file = new File([blob], "resume.pdf", { type: "application/pdf" });
      const resumeText = await extractTextFromPdf(file);
      const prompt = `${instructions}\n\nResume Text:\n${resumeText}`;
      const response = await window.puter.ai.chat(prompt);
      return {
        message: {
          content: response.toString()
        }
      };
    }
  };

  const kv = {
    set: async (key: string, value: string) => {
      return await window.puter.kv.set(key, value);
    },
    get: async (key: string) => {
      return await window.puter.kv.get(key);
    },
    list: async (pattern: string = "*", returnValues: boolean = false) => {
      return await window.puter.kv.list(pattern, returnValues);
    }
  };

  return {
    isLoading,
    fs,
    ai,
    kv
  };
}
