"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NeonText } from "@/components/effects/NeonText";
import { CharacterPreview } from "@/components/character-editor";
import { useCharacterLibrary } from "@/hooks/character-editor";
import {
  CharacterSet,
  PaddingDirection,
  BitDirection,
  createDownloadBlob,
  downloadBlob,
  getSuggestedFilename,
  formatFileSize,
  bytesPerCharacter,
} from "@/lib/character-editor";

/**
 * Export view for the Character ROM Editor
 */
export function ExportView() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { getById } = useCharacterLibrary();

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [characterSet, setCharacterSet] = useState<CharacterSet | null>(null);

  // Export settings
  const [filename, setFilename] = useState("");
  const [padding, setPadding] = useState<PaddingDirection>("right");
  const [bitDirection, setBitDirection] = useState<BitDirection>("ltr");

  // Load character set
  useEffect(() => {
    async function loadCharacterSet() {
      if (!id) {
        setError("No character set ID provided");
        setLoading(false);
        return;
      }

      try {
        const loaded = await getById(id);
        if (!loaded) {
          setError("Character set not found");
        } else {
          setCharacterSet(loaded);
          setFilename(getSuggestedFilename(loaded.metadata.name));
          setPadding(loaded.config.padding);
          setBitDirection(loaded.config.bitDirection);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load character set");
      } finally {
        setLoading(false);
      }
    }

    loadCharacterSet();
  }, [id, getById]);

  // Calculate export size
  const exportSize = useMemo(() => {
    if (!characterSet) return 0;
    return characterSet.characters.length * bytesPerCharacter(characterSet.config);
  }, [characterSet]);

  // Handle export
  const handleExport = useCallback(() => {
    if (!characterSet) return;

    const exportConfig = {
      ...characterSet.config,
      padding,
      bitDirection,
    };

    const blob = createDownloadBlob(
      characterSet.characters,
      characterSet.config,
      exportConfig
    );

    downloadBlob(blob, filename || "charset.bin");
  }, [characterSet, padding, bitDirection, filename]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-retro-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-retro-cyan border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400">Loading character set...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col safe-top">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-retro-dark">
          <div className="flex flex-col items-center gap-4 text-center">
            <svg
              className="w-16 h-16 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-lg font-medium text-red-400">{error}</h2>
            <Link
              href="/tools/character-rom-editor"
              className="text-sm text-retro-cyan hover:text-retro-pink transition-colors"
            >
              Back to Library
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col safe-top">
      <Header />

      <main className="flex-1 bg-retro-dark pt-24 pb-12">
        <Container size="narrow">
          {/* Page header */}
          <div className="mb-8">
            <Link
              href="/tools/character-rom-editor"
              className="text-xs text-gray-500 hover:text-retro-cyan transition-colors mb-2 inline-flex items-center gap-1"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Library
            </Link>
            <h1 className="text-2xl sm:text-3xl font-display">
              <NeonText color="pink">Export Character ROM</NeonText>
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              Download &quot;{characterSet?.metadata.name}&quot; as a binary ROM file
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Preview */}
            <div>
              <h2 className="text-sm font-medium text-gray-300 mb-4">Preview</h2>
              <div className="card-retro p-4 sm:p-6">
                {characterSet && (
                  <div className="bg-black/50 rounded-lg p-4 overflow-auto max-h-[300px]">
                    <CharacterPreview
                      characters={characterSet.characters}
                      config={characterSet.config}
                      maxCharacters={256}
                      maxWidth={280}
                      maxHeight={280}
                    />
                  </div>
                )}

                <div className="mt-4 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Characters:</span>
                    <span>{characterSet?.characters.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>
                      {characterSet?.config.width}x{characterSet?.config.height}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>File size:</span>
                    <span>{formatFileSize(exportSize)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Export options */}
            <div>
              <h2 className="text-sm font-medium text-gray-300 mb-4">
                Export Options
              </h2>
              <div className="card-retro p-4 sm:p-6 space-y-6">
                {/* Filename */}
                <div>
                  <label
                    htmlFor="filename"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Filename
                  </label>
                  <input
                    type="text"
                    id="filename"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="w-full px-4 py-2 bg-retro-navy/50 border border-retro-grid/50 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-retro-cyan/50"
                  />
                </div>

                {/* Padding */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">
                    Bit Padding
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPadding("right")}
                      className={`
                        flex-1 px-3 py-2 text-sm rounded border transition-colors
                        ${
                          padding === "right"
                            ? "border-retro-cyan bg-retro-cyan/10 text-retro-cyan"
                            : "border-retro-grid/50 text-gray-400 hover:border-retro-grid"
                        }
                      `}
                    >
                      Right
                    </button>
                    <button
                      onClick={() => setPadding("left")}
                      className={`
                        flex-1 px-3 py-2 text-sm rounded border transition-colors
                        ${
                          padding === "left"
                            ? "border-retro-cyan bg-retro-cyan/10 text-retro-cyan"
                            : "border-retro-grid/50 text-gray-400 hover:border-retro-grid"
                        }
                      `}
                    >
                      Left
                    </button>
                  </div>
                </div>

                {/* Bit direction */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">
                    Bit Direction
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBitDirection("ltr")}
                      className={`
                        flex-1 px-3 py-2 text-sm rounded border transition-colors
                        ${
                          bitDirection === "ltr"
                            ? "border-retro-cyan bg-retro-cyan/10 text-retro-cyan"
                            : "border-retro-grid/50 text-gray-400 hover:border-retro-grid"
                        }
                      `}
                    >
                      Left to Right
                    </button>
                    <button
                      onClick={() => setBitDirection("rtl")}
                      className={`
                        flex-1 px-3 py-2 text-sm rounded border transition-colors
                        ${
                          bitDirection === "rtl"
                            ? "border-retro-cyan bg-retro-cyan/10 text-retro-cyan"
                            : "border-retro-grid/50 text-gray-400 hover:border-retro-grid"
                        }
                      `}
                    >
                      Right to Left
                    </button>
                  </div>
                </div>

                {/* Download button */}
                <Button onClick={handleExport} variant="pink" className="w-full">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download ROM
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
