"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { CharacterPreview } from "./CharacterPreview";
import {
  FontImportOptions,
  getDefaultFontImportOptions,
  parseFontToCharacters,
  isValidFontFile,
  getSupportedFontExtensions,
  CHARACTER_RANGES,
  getCharacterRangePreview,
  FontParseResult,
} from "@/lib/character-editor/fontImport";
import { CharacterSetConfig, Character } from "@/lib/character-editor";

export interface ImportFromFontModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback when import is complete */
  onImport: (characters: Character[], config: CharacterSetConfig, fontName: string) => void;
}

/**
 * Modal for importing characters from a TTF/OTF/WOFF font file
 */
export function ImportFromFontModal({
  isOpen,
  onClose,
  onImport,
}: ImportFromFontModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<FontParseResult | null>(null);

  // Import options
  const [options, setOptions] = useState<FontImportOptions>(
    getDefaultFontImportOptions()
  );

  // Preview of character range
  const rangePreview = useMemo(
    () => getCharacterRangePreview(options.startCode, options.endCode),
    [options.startCode, options.endCode]
  );

  // Character count
  const characterCount = options.endCode - options.startCode + 1;

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setError(null);
      setParseResult(null);
      setOptions(getDefaultFontImportOptions());
    }
  }, [isOpen]);

  // Parse font when file or options change
  useEffect(() => {
    if (!file) return;

    let cancelled = false;

    const parseFont = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await parseFontToCharacters(file, options);
        if (!cancelled) {
          setParseResult(result);
        }
      } catch (e) {
        if (!cancelled) {
          const message = e instanceof Error ? e.message : "Failed to parse font";
          // Check if it's a missing dependency error
          if (message.includes("opentype") || message.includes("Cannot find module")) {
            setError(
              "Font import requires the opentype.js library. Please install it with: npm install opentype.js"
            );
          } else {
            setError(message);
          }
          setParseResult(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    parseFont();

    return () => {
      cancelled = true;
    };
  }, [file, options]);

  // Handle file selection
  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setError(null);
    setParseResult(null);

    if (!isValidFontFile(selectedFile)) {
      setError(
        `Invalid file type. Please select a font file (${getSupportedFontExtensions()})`
      );
      return;
    }

    // Limit file size to 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5MB.");
      return;
    }

    setFile(selectedFile);
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Handle file input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  // Handle import
  const handleImport = useCallback(() => {
    if (!parseResult || parseResult.characters.length === 0) return;

    const config: CharacterSetConfig = {
      width: options.charWidth,
      height: options.charHeight,
      padding: "right",
      bitDirection: "ltr",
    };

    onImport(parseResult.characters, config, parseResult.fontFamily);
    onClose();
  }, [parseResult, options, onImport, onClose]);

  // Update option handlers
  const updateOption = useCallback(
    <K extends keyof FontImportOptions>(key: K, value: FontImportOptions[K]) => {
      setOptions((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Apply character range preset
  const applyRangePreset = useCallback(
    (startCode: number, endCode: number) => {
      setOptions((prev) => ({ ...prev, startCode, endCode }));
    },
    []
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-retro-dark border border-retro-grid/50 rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-retro-grid/30">
          <h2 className="text-lg font-display text-gray-200">
            Import from Font
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {!file ? (
            /* File upload */
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                onChange={handleInputChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`
                  flex flex-col items-center justify-center p-12
                  border-2 border-dashed rounded-lg cursor-pointer
                  transition-colors
                  border-retro-grid/50 hover:border-retro-cyan/50 bg-retro-navy/30
                `}
              >
                <div className="w-16 h-16 rounded-full bg-retro-purple/20 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-retro-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-300 mb-1">
                  Drag and drop a font file here
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  or click to browse
                </p>
                <p className="text-[10px] text-gray-600">
                  Supports: {getSupportedFontExtensions()}
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-sm text-red-400">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>Tip:</strong> TrueType (.ttf), OpenType (.otf), and Web Open Font Format (.woff) files are supported.</p>
                <p>The font will be rasterized at the specified size to create bitmap characters.</p>
              </div>
            </div>
          ) : (
            /* Configuration and preview */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Settings */}
              <div className="space-y-4">
                {/* Font info */}
                <div className="card-retro p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-400">Font File</span>
                    <button
                      onClick={() => {
                        setFile(null);
                        setParseResult(null);
                      }}
                      className="text-xs text-retro-cyan hover:text-retro-pink"
                    >
                      Change
                    </button>
                  </div>
                  <div className="text-sm text-gray-200 truncate">
                    {file.name}
                  </div>
                  {parseResult && (
                    <div className="text-xs text-gray-500 mt-1">
                      {parseResult.fontFamily}
                    </div>
                  )}
                </div>

                {/* Character dimensions */}
                <div className="card-retro p-4 space-y-4">
                  <h3 className="text-sm font-medium text-gray-300">Character Size</h3>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Width
                      </label>
                      <input
                        type="number"
                        min={4}
                        max={32}
                        value={options.charWidth}
                        onChange={(e) => updateOption("charWidth", parseInt(e.target.value) || 8)}
                        className="w-full px-3 py-1.5 bg-retro-navy/50 border border-retro-grid/50 rounded text-sm text-gray-200 focus:outline-none focus:border-retro-cyan/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Height
                      </label>
                      <input
                        type="number"
                        min={4}
                        max={32}
                        value={options.charHeight}
                        onChange={(e) => updateOption("charHeight", parseInt(e.target.value) || 8)}
                        className="w-full px-3 py-1.5 bg-retro-navy/50 border border-retro-grid/50 rounded text-sm text-gray-200 focus:outline-none focus:border-retro-cyan/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Font Size
                      </label>
                      <input
                        type="number"
                        min={4}
                        max={48}
                        value={options.fontSize}
                        onChange={(e) => updateOption("fontSize", parseInt(e.target.value) || 8)}
                        className="w-full px-3 py-1.5 bg-retro-navy/50 border border-retro-grid/50 rounded text-sm text-gray-200 focus:outline-none focus:border-retro-cyan/50"
                      />
                    </div>
                  </div>

                  {/* Size presets */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { w: 8, h: 8, f: 8, label: "8x8" },
                      { w: 8, h: 16, f: 14, label: "8x16" },
                      { w: 6, h: 8, f: 7, label: "6x8" },
                      { w: 16, h: 16, f: 14, label: "16x16" },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => {
                          updateOption("charWidth", preset.w);
                          updateOption("charHeight", preset.h);
                          updateOption("fontSize", preset.f);
                        }}
                        className={`
                          px-2 py-1 text-xs rounded border transition-colors
                          ${
                            options.charWidth === preset.w && options.charHeight === preset.h
                              ? "border-retro-cyan bg-retro-cyan/10 text-retro-cyan"
                              : "border-retro-grid/50 text-gray-400 hover:border-retro-grid"
                          }
                        `}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Character range */}
                <div className="card-retro p-4 space-y-4">
                  <h3 className="text-sm font-medium text-gray-300">Character Range</h3>

                  {/* Range presets */}
                  <div className="flex flex-wrap gap-2">
                    {CHARACTER_RANGES.slice(0, 4).map((range) => (
                      <button
                        key={range.name}
                        onClick={() => applyRangePreset(range.startCode, range.endCode)}
                        className={`
                          px-2 py-1 text-xs rounded border transition-colors
                          ${
                            options.startCode === range.startCode && options.endCode === range.endCode
                              ? "border-retro-cyan bg-retro-cyan/10 text-retro-cyan"
                              : "border-retro-grid/50 text-gray-400 hover:border-retro-grid"
                          }
                        `}
                      >
                        {range.name}
                      </button>
                    ))}
                  </div>

                  {/* Manual range */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Start Code
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={65535}
                        value={options.startCode}
                        onChange={(e) => updateOption("startCode", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-retro-navy/50 border border-retro-grid/50 rounded text-sm text-gray-200 focus:outline-none focus:border-retro-cyan/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        End Code
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={65535}
                        value={options.endCode}
                        onChange={(e) => updateOption("endCode", parseInt(e.target.value) || 255)}
                        className="w-full px-3 py-1.5 bg-retro-navy/50 border border-retro-grid/50 rounded text-sm text-gray-200 focus:outline-none focus:border-retro-cyan/50"
                      />
                    </div>
                  </div>

                  {/* Range preview */}
                  <div className="text-xs text-gray-500">
                    <span className="text-gray-400">{characterCount} characters:</span>{" "}
                    <span className="font-mono">{rangePreview.join("")}</span>
                  </div>
                </div>

                {/* Rendering options */}
                <div className="card-retro p-4 space-y-4">
                  <h3 className="text-sm font-medium text-gray-300">Rendering Options</h3>

                  {/* Threshold slider */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-gray-500">
                        Threshold
                      </label>
                      <span className="text-xs text-gray-400">{options.threshold}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={options.threshold}
                      onChange={(e) => updateOption("threshold", parseInt(e.target.value))}
                      className="w-full accent-retro-cyan"
                    />
                  </div>

                  {/* Baseline offset */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-gray-500">
                        Baseline Offset
                      </label>
                      <span className="text-xs text-gray-400">{options.baselineOffset}</span>
                    </div>
                    <input
                      type="range"
                      min={-8}
                      max={8}
                      value={options.baselineOffset}
                      onChange={(e) => updateOption("baselineOffset", parseInt(e.target.value))}
                      className="w-full accent-retro-cyan"
                    />
                  </div>

                  {/* Center toggle */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="centerGlyphs"
                      checked={options.centerGlyphs}
                      onChange={(e) => updateOption("centerGlyphs", e.target.checked)}
                      className="rounded border-retro-grid/50 bg-retro-navy/50 text-retro-cyan focus:ring-retro-cyan"
                    />
                    <label htmlFor="centerGlyphs" className="text-xs text-gray-400">
                      Center glyphs in cells
                    </label>
                  </div>
                </div>
              </div>

              {/* Right: Character preview */}
              <div className="space-y-4">
                <div className="card-retro p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-400">
                      Preview
                    </span>
                    {loading && (
                      <span className="text-xs text-retro-cyan">Processing...</span>
                    )}
                    {parseResult && !loading && (
                      <span className="text-xs text-gray-500">
                        {parseResult.importedCount} glyphs, {parseResult.missingCount} missing
                      </span>
                    )}
                  </div>

                  {error ? (
                    <div className="flex items-start gap-2 text-sm text-red-400 py-8">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  ) : loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-10 h-10 border-2 border-retro-cyan border-t-transparent rounded-full animate-spin mb-3" />
                      <p className="text-sm text-gray-400">Rendering font...</p>
                    </div>
                  ) : parseResult && parseResult.characters.length > 0 ? (
                    <div className="bg-black/50 rounded p-2 max-h-96 overflow-y-auto">
                      <CharacterPreview
                        characters={parseResult.characters}
                        config={{
                          width: options.charWidth,
                          height: options.charHeight,
                          padding: "right",
                          bitDirection: "ltr",
                        }}
                        maxCharacters={256}
                        maxWidth={400}
                        maxHeight={2000}
                        scale={2}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-12 text-center text-gray-500">
                      <p className="text-sm">Upload a font to see preview</p>
                    </div>
                  )}
                </div>

                {parseResult && !loading && (
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>
                      Characters will be created at {options.charWidth}x{options.charHeight} pixels.
                    </p>
                    <p>
                      Adjust font size and threshold for best results.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-retro-grid/30">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="cyan"
            onClick={handleImport}
            disabled={!parseResult || parseResult.characters.length === 0 || loading}
          >
            Import {parseResult?.characters.length || 0} Characters
          </Button>
        </div>
      </div>
    </div>
  );
}
