"use client";

import { CharacterCountPresetSelector } from "./CharacterCountPresetSelector";

export interface CharacterCountPresetDropdownProps {
  /** Current character count */
  currentCount: number;
  /** Callback when a preset is selected */
  onSelect: (count: number) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Dropdown component for selecting character count presets
 * Now a simple wrapper around CharacterCountPresetSelector
 */
export function CharacterCountPresetDropdown({
  currentCount,
  onSelect,
  className = "",
}: CharacterCountPresetDropdownProps) {
  return (
    <CharacterCountPresetSelector
      currentCount={currentCount}
      onSelect={onSelect}
      className={className}
    />
  );
}
