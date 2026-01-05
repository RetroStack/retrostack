"use client";

import { useState, useRef, useEffect } from "react";
import {
  CHARACTER_COUNT_PRESETS,
  getSystemCharacterCountPresetsByManufacturer,
} from "@/lib/character-editor";

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
 * Shows quick presets and a dropdown with system-organized options
 */
export function CharacterCountPresetDropdown({
  currentCount,
  onSelect,
  className = "",
}: CharacterCountPresetDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Common quick presets (shown as buttons)
  const quickPresets = [
    { label: "64", count: 64 },
    { label: "128", count: 128 },
    { label: "256", count: 256 },
    { label: "512", count: 512 },
  ];

  // Group system presets by manufacturer
  const presetsByManufacturer = getSystemCharacterCountPresetsByManufacturer();

  const isCurrentPreset = (count: number) => currentCount === count;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Quick preset buttons */}
      <div className="flex flex-wrap gap-2 mb-2">
        {quickPresets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onSelect(preset.count)}
            className={`
              px-2 py-1 text-xs rounded border transition-colors
              ${
                isCurrentPreset(preset.count)
                  ? "border-retro-cyan bg-retro-cyan/10 text-retro-cyan"
                  : "border-retro-grid/50 text-gray-400 hover:border-retro-grid"
              }
            `}
          >
            {preset.label}
          </button>
        ))}

        {/* Dropdown toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-2 py-1 text-xs rounded border border-retro-grid/50 text-gray-400 hover:border-retro-grid flex items-center gap-1"
        >
          More
          <svg
            className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-10 left-0 top-full mt-1 w-64 max-h-80 overflow-y-auto bg-retro-navy border border-retro-grid/50 rounded-lg shadow-xl">
          {/* All character count presets */}
          <div className="p-2 border-b border-retro-grid/30">
            <div className="text-[10px] text-gray-500 uppercase mb-1">
              Standard Counts
            </div>
            <div className="flex flex-wrap gap-1">
              {CHARACTER_COUNT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    onSelect(preset.count);
                    setIsOpen(false);
                  }}
                  className={`
                    px-2 py-1 text-xs rounded transition-colors
                    ${
                      isCurrentPreset(preset.count)
                        ? "bg-retro-cyan/20 text-retro-cyan"
                        : "text-gray-400 hover:bg-retro-grid/20"
                    }
                  `}
                  title={preset.systems.join(", ")}
                >
                  {preset.count}
                </button>
              ))}
            </div>
          </div>

          {/* System-organized presets */}
          {Object.entries(presetsByManufacturer)
            .filter(([, presets]) => presets.length > 0)
            .map(([manufacturer, presets]) => (
              <div
                key={manufacturer}
                className="p-2 border-b border-retro-grid/30 last:border-0"
              >
                <div className="text-[10px] text-gray-500 uppercase mb-1">
                  {manufacturer}
                </div>
                <div className="flex flex-wrap gap-1">
                  {presets.map((preset) => (
                    <button
                      key={`${preset.system}-${preset.count}`}
                      onClick={() => {
                        onSelect(preset.count);
                        setIsOpen(false);
                      }}
                      className={`
                        px-2 py-1 text-xs rounded transition-colors
                        ${
                          isCurrentPreset(preset.count)
                            ? "bg-retro-cyan/20 text-retro-cyan"
                            : "text-gray-400 hover:bg-retro-grid/20"
                        }
                      `}
                      title={`${preset.count} characters`}
                    >
                      {preset.system}
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
