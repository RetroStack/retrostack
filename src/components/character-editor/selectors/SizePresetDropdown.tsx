"use client";

import { DimensionPresetSelector } from "./DimensionPresetSelector";

export interface SizePresetDropdownProps {
  /** Current width */
  currentWidth: number;
  /** Current height */
  currentHeight: number;
  /** Callback when a preset is selected */
  onSelect: (width: number, height: number) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Dropdown component for selecting character dimension presets
 * Now a simple wrapper around DimensionPresetSelector
 */
export function SizePresetDropdown({
  currentWidth,
  currentHeight,
  onSelect,
  className = "",
}: SizePresetDropdownProps) {
  return (
    <DimensionPresetSelector
      currentWidth={currentWidth}
      currentHeight={currentHeight}
      onSelect={onSelect}
      className={className}
    />
  );
}
