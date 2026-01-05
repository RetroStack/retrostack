"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NeonText } from "@/components/effects/NeonText";
import {
  ImportDropZone,
  ImportConfigForm,
  CharacterPreview,
} from "@/components/character-editor";
import { useCharacterLibrary } from "@/hooks/character-editor";
import {
  CharacterSetConfig,
  createDefaultConfig,
  parseCharacterRom,
  generateId,
} from "@/lib/character-editor";

/**
 * Import view for the Character ROM Editor
 */
export function ImportView() {
  const router = useRouter();
  const { save } = useCharacterLibrary();

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Config state
  const [config, setConfig] = useState<CharacterSetConfig>(createDefaultConfig());
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Saving state
  const [saving, setSaving] = useState(false);

  // Parse characters from file data
  const characters = useMemo(() => {
    if (!fileData) return [];
    try {
      return parseCharacterRom(fileData, config);
    } catch {
      return [];
    }
  }, [fileData, config]);

  const handleFileSelect = useCallback((selectedFile: File, data: ArrayBuffer) => {
    setFile(selectedFile);
    setFileData(data);
    setError(null);

    // Set default name from filename
    const baseName = selectedFile.name.replace(/\.[^/.]+$/, "");
    setName(baseName);
  }, []);

  const handleSave = useCallback(
    async (openEditor: boolean = false) => {
      if (!fileData || !name.trim()) {
        setError("Please provide a name for the character set");
        return;
      }

      try {
        setSaving(true);

        const now = Date.now();
        const id = generateId();

        const characterSet = {
          metadata: {
            id,
            name: name.trim(),
            description: description.trim(),
            source: "yourself",
            createdAt: now,
            updatedAt: now,
            isBuiltIn: false,
          },
          config,
          characters,
        };

        await save(characterSet);

        if (openEditor) {
          router.push(`/tools/character-rom-editor/edit?id=${id}`);
        } else {
          router.push("/tools/character-rom-editor");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save character set");
      } finally {
        setSaving(false);
      }
    },
    [fileData, name, description, config, characters, save, router]
  );

  const isValid = file && fileData && name.trim() && characters.length > 0;

  return (
    <div className="min-h-screen flex flex-col safe-top">
      <Header />

      <main className="flex-1 bg-retro-dark pt-24 pb-12">
        <Container size="default">
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
              <NeonText color="cyan">Import Character ROM</NeonText>
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              Upload a binary ROM file and configure the character format
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left column: Upload and config */}
            <div className="space-y-8">
              {/* File upload */}
              <section>
                <h2 className="text-sm font-medium text-gray-300 mb-4">
                  1. Select File
                </h2>
                <ImportDropZone
                  onFileSelect={handleFileSelect}
                  selectedFile={file}
                  loading={loading}
                  error={error}
                />
              </section>

              {/* Configuration */}
              <section>
                <h2 className="text-sm font-medium text-gray-300 mb-4">
                  2. Configure Format
                </h2>
                <div className="card-retro p-4 sm:p-6">
                  <ImportConfigForm
                    config={config}
                    onConfigChange={setConfig}
                    fileSize={file?.size}
                    name={name}
                    onNameChange={setName}
                    description={description}
                    onDescriptionChange={setDescription}
                    disabled={!file}
                  />
                </div>
              </section>
            </div>

            {/* Right column: Preview */}
            <div>
              <section>
                <h2 className="text-sm font-medium text-gray-300 mb-4">
                  3. Preview
                </h2>
                <div className="card-retro p-4 sm:p-6">
                  {characters.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-400">
                          {characters.length} character
                          {characters.length !== 1 ? "s" : ""} detected
                        </span>
                        <span className="text-xs text-gray-500">
                          {config.width}x{config.height}
                        </span>
                      </div>

                      {/* Character preview */}
                      <div className="bg-black/50 rounded-lg p-4 overflow-auto max-h-[400px]">
                        <CharacterPreview
                          characters={characters}
                          config={config}
                          maxCharacters={256}
                          maxWidth={320}
                          maxHeight={320}
                        />
                      </div>

                      {/* Tip */}
                      <p className="text-xs text-gray-500 mt-4">
                        If the preview looks scrambled, try adjusting the
                        dimensions, padding, or bit direction.
                      </p>
                    </div>
                  ) : file ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <svg
                        className="w-12 h-12 text-gray-600 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-sm text-gray-400">
                        No characters detected with current settings
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Try adjusting the dimensions
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <svg
                        className="w-12 h-12 text-gray-600 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm text-gray-400">
                        Select a file to preview
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  onClick={() => handleSave(false)}
                  disabled={!isValid || saving}
                  variant="cyan"
                  className="flex-1"
                >
                  {saving ? "Saving..." : "Save to Library"}
                </Button>
                <Button
                  onClick={() => handleSave(true)}
                  disabled={!isValid || saving}
                  variant="pink"
                  className="flex-1"
                >
                  {saving ? "Saving..." : "Save & Edit"}
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
