"use client";

import type { PaddingDirection } from "@/lib/character-editor/types";

export interface PaddingDirectionSelectorProps {
  /** Current padding direction */
  value: PaddingDirection;
  /** Callback when direction changes */
  onChange: (direction: PaddingDirection) => void;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * Reusable component for selecting padding direction
 * Consistent styling across all import/export views
 *
 * Used in:
 * - ImportConfigForm (binary ROM import)
 * - ImportFromTextModal (character import from code)
 * - ExportView (binary export)
 */
export function PaddingDirectionSelector({
  value,
  onChange,
  disabled = false,
  className = "",
}: PaddingDirectionSelectorProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => onChange("right")}
        disabled={disabled}
        className={`
          flex-1 px-3 py-2 text-xs rounded border transition-colors
          ${
            value === "right"
              ? "border-retro-cyan bg-retro-cyan/10 text-retro-cyan"
              : "border-retro-grid/50 text-gray-400 hover:border-retro-grid"
          }
          disabled:opacity-50
        `}
      >
        Right
      </button>
      <button
        type="button"
        onClick={() => onChange("left")}
        disabled={disabled}
        className={`
          flex-1 px-3 py-2 text-xs rounded border transition-colors
          ${
            value === "left"
              ? "border-retro-cyan bg-retro-cyan/10 text-retro-cyan"
              : "border-retro-grid/50 text-gray-400 hover:border-retro-grid"
          }
          disabled:opacity-50
        `}
      >
        Left
      </button>
    </div>
  );
}
