import React, {useCallback} from "react";
import {useDropzone} from "react-dropzone";
import {formatSize} from '../lib/util';

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 20 * 1024 * 1024,
  });

  const file = acceptedFiles[0] || null;

  return (
    <div
      {...getRootProps()}
      className={`relative w-full border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 select-none group
        ${isDragActive 
          ? "border-primary-500 bg-primary-50/40 shadow-premium-glow scale-[1.01]" 
          : "border-emerald-200/80 bg-white hover:border-primary-400 hover:bg-emerald-50/20 hover:-translate-y-0.5 hover:shadow-premium"
        }
      `}
    >
      <input {...getInputProps()} />
      
      {file ? (
        <div className="flex flex-col items-center justify-center space-y-3 py-4 animate-in fade-in duration-500">
          <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500 shadow-sm">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-800">Selected Resume</p>
            <p className="text-xs text-primary-600 font-medium break-all">{file.name}</p>
            <p className="text-[10px] text-slate-400">{formatSize(file.size)}</p>
          </div>
          <div className="pt-2 text-xs text-primary-500 font-semibold underline decoration-dotted group-hover:text-primary-600">
            Click or drag to replace
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50/80 border border-emerald-100/50 flex items-center justify-center text-primary-500 group-hover:scale-110 group-hover:bg-primary-50 transition-all duration-300 shadow-sm">
            <svg className="w-7 h-7 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-primary-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-400">PDF Resumes up to {formatSize(20 * 1024 * 1024)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;