"use client";

import { useRef, useState, useEffect, useCallback, type ReactNode } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";

const BUTTON_WIDTH = 48; // Approximate width of a preset button
const DROPDOWN_BUTTON_WIDTH = 56; // Width of "More" button
const GAP = 8; // Gap between buttons

/**
 * Base preset interface that all presets must extend
 */
export interface BasePreset {
  label: string;
  priority: number;
  examples: string[];
}

export interface AdaptivePresetSelectorProps<T extends BasePreset> {
  /** Array of presets to display */
  presets: T[];
  /** Function to check if a preset is currently selected */
  isSelected: (preset: T) => boolean;
  /** Callback when a preset is selected */
  onSelect: (preset: T) => void;
  /** Function to get the tooltip text for a preset */
  getTooltip?: (preset: T) => string | undefined;
  /** Label for the overflow section in the dropdown (e.g., "Other Sizes") */
  overflowSectionLabel?: string;
  /** Additional sections to render in the dropdown after the overflow section */
  renderDropdownSections?: (closeDropdown: () => void) => ReactNode;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * Generic adaptive preset selector component.
 * Shows presets as buttons, with overflow items in a dropdown.
 * Automatically adjusts visible count based on container width.
 *
 * Features:
 * - ResizeObserver for adaptive button count
 * - Priority-based visibility (highest priority presets shown first)
 * - Dropdown for overflow presets
 * - Support for custom dropdown sections via render prop
 */
export function AdaptivePresetSelector<T extends BasePreset>({
  presets,
  isSelected,
  onSelect,
  getTooltip,
  overflowSectionLabel = "Other Options",
  renderDropdownSections,
  disabled = false,
  className = "",
}: AdaptivePresetSelectorProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(presets.length);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useOutsideClick<HTMLDivElement>(
    () => setIsDropdownOpen(false),
    isDropdownOpen
  );

  // Sort presets by priority (highest first) for determining which to show
  const sortedByPriority = [...presets].sort((a, b) => b.priority - a.priority);

  // Calculate how many presets can fit
  const calculateVisibleCount = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    // Always reserve space for the dropdown button
    const availableWidth = containerWidth - DROPDOWN_BUTTON_WIDTH - GAP;
    const maxVisible = Math.floor((availableWidth + GAP) / (BUTTON_WIDTH + GAP));

    // At minimum show 2 presets
    setVisibleCount(Math.max(2, Math.min(maxVisible, presets.length)));
  }, [presets.length]);

  useEffect(() => {
    calculateVisibleCount();

    const observer = new ResizeObserver(() => {
      calculateVisibleCount();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [calculateVisibleCount]);

  const handleSelect = useCallback(
    (preset: T) => {
      onSelect(preset);
      setIsDropdownOpen(false);
    },
    [onSelect]
  );

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  // Determine which presets are visible vs in dropdown based on priority
  const visiblePresets: T[] = [];
  const overflowPresets: T[] = [];

  // Get the top N presets by priority to show
  const topPriorityLabels = new Set(
    sortedByPriority.slice(0, visibleCount).map((p) => p.label)
  );

  // Maintain original order but split into visible vs overflow
  for (const preset of presets) {
    if (topPriorityLabels.has(preset.label)) {
      visiblePresets.push(preset);
    } else {
      overflowPresets.push(preset);
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex flex-wrap gap-2">
        {/* Visible preset buttons */}
        {visiblePresets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => handleSelect(preset)}
            disabled={disabled}
            title={getTooltip?.(preset)}
            className={`
              px-3 py-1 text-xs rounded border transition-colors
              ${
                isSelected(preset)
                  ? "border-retro-pink bg-retro-pink/10 text-retro-pink"
                  : "border-retro-grid/50 text-gray-400 hover:border-retro-grid"
              }
              disabled:opacity-50
            `}
          >
            {preset.label}
          </button>
        ))}

        {/* Dropdown toggle - always shown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={disabled}
            className="px-3 py-1 text-xs rounded text-retro-cyan bg-gradient-to-b from-gray-600/50 to-gray-700/50 border border-retro-cyan/50 border-t-retro-cyan/70 hover:from-gray-500/50 hover:to-gray-600/50 hover:border-retro-cyan active:from-gray-700/50 active:to-gray-800/50 shadow-md shadow-black/30 active:shadow-sm flex items-center gap-1 transition-all disabled:opacity-50"
          >
            More
            <svg
              className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown panel */}
          {isDropdownOpen && (
            <div className="absolute z-50 left-0 top-full mt-1 w-72 max-h-96 overflow-y-auto bg-retro-navy border border-retro-grid/50 rounded-lg shadow-xl">
              {/* Overflow presets section */}
              {overflowPresets.length > 0 && (
                <div className="p-2 border-b border-retro-grid/30">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">
                    {overflowSectionLabel}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {overflowPresets.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => handleSelect(preset)}
                        disabled={disabled}
                        title={getTooltip?.(preset)}
                        className={`
                          px-2 py-1 text-xs rounded transition-colors
                          ${
                            isSelected(preset)
                              ? "bg-retro-pink/20 text-retro-pink"
                              : "text-gray-400 hover:bg-retro-grid/20"
                          }
                          disabled:opacity-50
                        `}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom dropdown sections */}
              {renderDropdownSections?.(closeDropdown)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Shared Dropdown Section Components
// ============================================================================

export interface PresetDropdownSectionProps {
  /** Section title (e.g., "Systems", "Character ROM ICs") */
  title: string;
  /** Whether to show a top border */
  showDivider?: boolean;
}

/**
 * Header component for a dropdown section
 */
export function PresetDropdownSectionHeader({
  title,
  showDivider = false,
}: PresetDropdownSectionProps) {
  return (
    <>
      {showDivider && <div className="border-t border-retro-grid/30" />}
      <div className="px-2 pt-2 pb-1">
        <div className="text-[10px] text-retro-cyan uppercase font-medium">
          {title}
        </div>
      </div>
    </>
  );
}

export interface PresetDropdownGroupProps {
  /** Group label (e.g., manufacturer name) */
  label: string;
  /** Children (buttons) */
  children: ReactNode;
}

/**
 * Group component within a dropdown section (e.g., for organizing by manufacturer)
 */
export function PresetDropdownGroup({ label, children }: PresetDropdownGroupProps) {
  return (
    <div className="px-2 pb-2">
      <div className="w-full text-left px-2 py-1 text-xs font-medium text-retro-cyan bg-retro-cyan/10 rounded mb-1">
        {label}
      </div>
      <div className="ml-3 flex flex-wrap gap-1">{children}</div>
    </div>
  );
}

export interface PresetDropdownButtonProps {
  /** Button label */
  label: string;
  /** Whether the button is selected */
  isSelected: boolean;
  /** Click handler */
  onClick: () => void;
  /** Tooltip text */
  title?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
}

/**
 * Button component for items in dropdown sections
 */
export function PresetDropdownButton({
  label,
  isSelected,
  onClick,
  title,
  disabled = false,
}: PresetDropdownButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        px-2 py-0.5 text-xs rounded transition-all
        ${
          isSelected
            ? "bg-retro-amber/40 text-retro-amber ring-1 ring-retro-amber"
            : "bg-retro-amber/15 text-retro-amber hover:bg-retro-amber/30 hover:text-white"
        }
        disabled:opacity-50
      `}
    >
      {label}
    </button>
  );
}
