"use client";

import { useCallback, useState } from "react";
import { isValidBinaryFile, formatFileSize } from "@/lib/character-editor";

export interface ImportWizardStep1Props {
  /** Currently selected file */
  file: File | null;
  /** Callback when file is selected */
  onFileSelect: (file: File, data: ArrayBuffer) => void;
}

/**
 * Step 1: File upload with drag and drop
 */
export function ImportWizardStep1({
  file,
  onFileSelect,
}: ImportWizardStep1Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(
    async (selectedFile: File) => {
      setError(null);
      setLoading(true);

      try {
        // Validate file
        if (!isValidBinaryFile(selectedFile)) {
          throw new Error(
            "Invalid file type. Please select a binary ROM file (.bin, .rom, .chr, etc.)"
          );
        }

        // Check file size (max 1MB for character ROMs)
        if (selectedFile.size > 1024 * 1024) {
          throw new Error("File too large. Maximum size is 1MB.");
        }

        // Read file
        const data = await selectedFile.arrayBuffer();
        onFileSelect(selectedFile, data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to read file");
      } finally {
        setLoading(false);
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFile(droppedFile);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFile(selectedFile);
      }
    },
    [handleFile]
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-medium text-white mb-2">
          Select ROM File
        </h2>
        <p className="text-sm text-gray-400">
          Drag and drop a binary character ROM file, or click to browse
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-8
          transition-colors cursor-pointer
          ${
            isDragging
              ? "border-retro-cyan bg-retro-cyan/10"
              : file
              ? "border-retro-cyan/50 bg-retro-cyan/5"
              : "border-retro-grid/50 hover:border-retro-grid"
          }
        `}
      >
        <input
          type="file"
          accept=".bin,.rom,.chr,.fnt,.dat"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={loading}
        />

        <div className="flex flex-col items-center gap-4">
          {loading ? (
            <>
              <div className="w-12 h-12 border-2 border-retro-cyan border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-400">Reading file...</span>
            </>
          ) : file ? (
            <>
              <div className="w-16 h-16 rounded-xl bg-retro-cyan/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-retro-cyan"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Reset by triggering file input
                }}
                className="text-xs text-retro-cyan hover:text-retro-pink transition-colors"
              >
                Choose a different file
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-xl bg-retro-purple/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-retro-pink"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-300">
                  Drop your ROM file here
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  or click to browse
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Supported formats */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Supported formats: .bin, .rom, .chr, .fnt, .dat
        </p>
      </div>
    </div>
  );
}
