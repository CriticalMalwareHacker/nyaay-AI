// src/app/components/FileUpload.jsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';

const FileUpload = ({ onFilesChange, maxFiles = 5, maxSize = 10 }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);

  // This is the key change. We use useEffect to notify the parent
  // component AFTER the internal state has been updated.
  useEffect(() => {
    // This is the side effect: telling the parent about the change.
    if (onFilesChange) {
      onFilesChange(uploadedFiles);
    }
  }, [uploadedFiles, onFilesChange]); // This effect runs only when uploadedFiles changes

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    // Process accepted files
    const newAcceptedFiles = acceptedFiles.map(file => ({
      file,
      id: `${file.name}-${file.size}-${file.lastModified}`,
      errors: [],
    }));

    // Update the internal state. DO NOT call onFilesChange here.
    setUploadedFiles(prev => [...prev, ...newAcceptedFiles].slice(0, maxFiles));

    // Handle rejected files
    if (fileRejections.length > 0) {
      setRejectedFiles(prev => [...prev, ...fileRejections]);
    }
  }, [maxFiles]);

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    }
  });

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-10 h-10 mb-3 text-gray-400" />
          {isDragActive ? (
            <p className="text-lg font-semibold text-blue-600">Drop the files here...</p>
          ) : (
            <>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF, DOCX, or TXT (Max {maxSize}MB)</p>
            </>
          )}
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800">Uploaded Files:</h3>
          {uploadedFiles.map(({ file, id }) => (
            <div
              key={id}
              className="flex items-center justify-between p-2 bg-gray-100 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">{file.name}</span>
                <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(id)}
                className="p-1 text-red-500 hover:bg-red-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
