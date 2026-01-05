"use client";

import { useState, useCallback } from "react";
import { ImportWizardStep1 } from "./ImportWizardStep1";
import { ImportWizardStep2 } from "./ImportWizardStep2";
import { ImportWizardStep3 } from "./ImportWizardStep3";
import {
  CharacterSet,
  CharacterSetConfig,
  Character,
  parseCharacterRom,
  createDefaultConfig,
  generateId,
} from "@/lib/character-editor";

export interface ImportWizardProps {
  /** Callback when import is completed */
  onComplete: (characterSet: CharacterSet) => void;
  /** Callback when wizard is cancelled */
  onCancel: () => void;
}

export interface ImportWizardState {
  step: 1 | 2 | 3;
  file: File | null;
  fileData: ArrayBuffer | null;
  metadata: {
    name: string;
    description: string;
    source: string;
    maker: string;
    system: string;
  };
  config: CharacterSetConfig;
  characters: Character[];
}

const initialState: ImportWizardState = {
  step: 1,
  file: null,
  fileData: null,
  metadata: {
    name: "",
    description: "",
    source: "",
    maker: "",
    system: "",
  },
  config: createDefaultConfig(),
  characters: [],
};

/**
 * Multi-step import wizard for character ROM files
 * Step 1: File upload
 * Step 2: Metadata (name, description, source, maker, system)
 * Step 3: Interpretation settings with preview
 */
export function ImportWizard({ onComplete, onCancel }: ImportWizardProps) {
  const [state, setState] = useState<ImportWizardState>(initialState);
  const [error, setError] = useState<string | null>(null);

  // Step navigation
  const goToStep = useCallback((step: 1 | 2 | 3) => {
    setState((prev) => ({ ...prev, step }));
    setError(null);
  }, []);

  const goBack = useCallback(() => {
    if (state.step > 1) {
      goToStep((state.step - 1) as 1 | 2 | 3);
    }
  }, [state.step, goToStep]);

  const goNext = useCallback(() => {
    if (state.step < 3) {
      goToStep((state.step + 1) as 1 | 2 | 3);
    }
  }, [state.step, goToStep]);

  // Step 1: File upload handlers
  const handleFileSelect = useCallback((file: File, data: ArrayBuffer) => {
    // Extract name from filename
    const baseName = file.name.replace(/\.[^/.]+$/, "");

    setState((prev) => ({
      ...prev,
      file,
      fileData: data,
      metadata: {
        ...prev.metadata,
        name: prev.metadata.name || baseName,
      },
    }));
  }, []);

  // Step 2: Metadata handlers
  const handleMetadataChange = useCallback(
    (field: keyof ImportWizardState["metadata"], value: string) => {
      setState((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [field]: value,
        },
      }));
    },
    []
  );

  // Step 3: Config handlers
  const handleConfigChange = useCallback(
    (config: CharacterSetConfig) => {
      setState((prev) => {
        // Re-parse characters with new config
        let characters: Character[] = [];
        if (prev.fileData) {
          try {
            characters = parseCharacterRom(prev.fileData, config);
          } catch (e) {
            console.error("Failed to parse with new config:", e);
          }
        }
        return { ...prev, config, characters };
      });
    },
    []
  );

  // Parse file when entering step 3
  const handleEnterStep3 = useCallback(() => {
    if (state.fileData) {
      try {
        const characters = parseCharacterRom(state.fileData, state.config);
        setState((prev) => ({ ...prev, characters }));
        goNext();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to parse file");
      }
    }
  }, [state.fileData, state.config, goNext]);

  // Complete import
  const handleComplete = useCallback(() => {
    const now = Date.now();
    const characterSet: CharacterSet = {
      metadata: {
        id: generateId(),
        name: state.metadata.name.trim(),
        description: state.metadata.description.trim(),
        source: state.metadata.source.trim() || "yourself",
        maker: state.metadata.maker,
        system: state.metadata.system,
        createdAt: now,
        updatedAt: now,
        isBuiltIn: false,
      },
      config: state.config,
      characters: state.characters,
    };

    onComplete(characterSet);
  }, [state, onComplete]);

  // Validation for each step
  const canProceedStep1 = state.file !== null && state.fileData !== null;
  const canProceedStep2 = state.metadata.name.trim().length > 0;
  const canProceedStep3 = state.characters.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 p-4 border-b border-retro-grid/30">
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                transition-colors
                ${
                  state.step === stepNum
                    ? "bg-retro-cyan text-retro-dark"
                    : state.step > stepNum
                    ? "bg-retro-cyan/30 text-retro-cyan"
                    : "bg-retro-grid/30 text-gray-500"
                }
              `}
            >
              {state.step > stepNum ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              ) : (
                stepNum
              )}
            </div>
            {stepNum < 3 && (
              <div
                className={`w-12 h-0.5 mx-1 ${
                  state.step > stepNum ? "bg-retro-cyan/30" : "bg-retro-grid/30"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step labels */}
      <div className="flex justify-center gap-8 px-4 py-2 text-xs text-gray-500 border-b border-retro-grid/30">
        <span className={state.step >= 1 ? "text-gray-300" : ""}>File</span>
        <span className={state.step >= 2 ? "text-gray-300" : ""}>Metadata</span>
        <span className={state.step >= 3 ? "text-gray-300" : ""}>Settings</span>
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Step content */}
      <div className="flex-1 overflow-auto p-4">
        {state.step === 1 && (
          <ImportWizardStep1
            file={state.file}
            onFileSelect={handleFileSelect}
          />
        )}

        {state.step === 2 && (
          <ImportWizardStep2
            metadata={state.metadata}
            onChange={handleMetadataChange}
          />
        )}

        {state.step === 3 && (
          <ImportWizardStep3
            fileData={state.fileData}
            config={state.config}
            characters={state.characters}
            onConfigChange={handleConfigChange}
          />
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between p-4 border-t border-retro-grid/30">
        <button
          onClick={state.step === 1 ? onCancel : goBack}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          {state.step === 1 ? "Cancel" : "Back"}
        </button>

        <div className="flex items-center gap-2">
          {state.step < 3 ? (
            <button
              onClick={state.step === 2 ? handleEnterStep3 : goNext}
              disabled={
                (state.step === 1 && !canProceedStep1) ||
                (state.step === 2 && !canProceedStep2)
              }
              className="px-6 py-2 text-sm bg-retro-cyan/20 text-retro-cyan border border-retro-cyan rounded-lg hover:bg-retro-cyan/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!canProceedStep3}
              className="px-6 py-2 text-sm bg-retro-pink/20 text-retro-pink border border-retro-pink rounded-lg hover:bg-retro-pink/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import ({state.characters.length} characters)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
