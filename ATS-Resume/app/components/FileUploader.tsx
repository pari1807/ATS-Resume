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
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="space-y-4 cursor-pointer">
          <img src="/icons/info.svg" alt="upload" className="size-20" />
        </div>

        {file ? (
          <div className="text-center py-4">
            <p className="text-lg font-semibold text-green-600">Selected file:</p>
            <p className="text-md text-gray-700">{file.name}</p>
          </div>
        ) : (
          <div>
            <p className="text-lg text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-lg text-gray-500">PDF (max {formatSize(20 * 1024 * 1024)})</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;