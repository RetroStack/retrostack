"use client";

import { useState, useMemo, useCallback } from "react";
import { KNOWN_MAKERS, getSystemsForMaker } from "@/lib/character-editor";

export interface MakerSystemSelectProps {
  /** Currently selected maker */
  maker: string;
  /** Currently selected system */
  system: string;
  /** Callback when maker changes */
  onMakerChange: (maker: string) => void;
  /** Callback when system changes */
  onSystemChange: (system: string) => void;
  /** Whether the selects are disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Paired dropdown selects for maker and system
 * Supports both known makers/systems and custom values
 */
export function MakerSystemSelect({
  maker,
  system,
  onMakerChange,
  onSystemChange,
  disabled = false,
  className = "",
}: MakerSystemSelectProps) {
  const [showCustomMaker, setShowCustomMaker] = useState(false);
  const [showCustomSystem, setShowCustomSystem] = useState(false);
  const [customMakerInput, setCustomMakerInput] = useState("");
  const [customSystemInput, setCustomSystemInput] = useState("");

  // Get all known makers
  const allMakers = useMemo(() => KNOWN_MAKERS.map((m) => m.maker), []);

  // Get systems for the selected maker
  const availableSystems = useMemo(() => {
    if (!maker) return [];
    return getSystemsForMaker(maker);
  }, [maker]);

  // Check if current maker is custom (not in known list)
  const isCustomMaker = maker && !allMakers.includes(maker);

  // Check if current system is custom (not in available systems for this maker)
  const isCustomSystem = system && !availableSystems.includes(system);

  // Handle maker select change
  const handleMakerSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (value === "__custom__") {
        setShowCustomMaker(true);
        setCustomMakerInput("");
      } else {
        onMakerChange(value);
        // Reset system when maker changes
        onSystemChange("");
        setShowCustomMaker(false);
      }
    },
    [onMakerChange, onSystemChange]
  );

  // Handle custom maker submit
  const handleCustomMakerSubmit = useCallback(() => {
    if (customMakerInput.trim()) {
      onMakerChange(customMakerInput.trim());
      onSystemChange("");
      setShowCustomMaker(false);
      setCustomMakerInput("");
    }
  }, [customMakerInput, onMakerChange, onSystemChange]);

  // Handle custom maker cancel
  const handleCustomMakerCancel = useCallback(() => {
    setShowCustomMaker(false);
    setCustomMakerInput("");
  }, []);

  // Handle system select change
  const handleSystemSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (value === "__custom__") {
        setShowCustomSystem(true);
        setCustomSystemInput("");
      } else {
        onSystemChange(value);
        setShowCustomSystem(false);
      }
    },
    [onSystemChange]
  );

  // Handle custom system submit
  const handleCustomSystemSubmit = useCallback(() => {
    if (customSystemInput.trim()) {
      onSystemChange(customSystemInput.trim());
      setShowCustomSystem(false);
      setCustomSystemInput("");
    }
  }, [customSystemInput, onSystemChange]);

  // Handle custom system cancel
  const handleCustomSystemCancel = useCallback(() => {
    setShowCustomSystem(false);
    setCustomSystemInput("");
  }, []);

  // Handle key press for custom inputs
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent, submitFn: () => void) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitFn();
      } else if (e.key === "Escape") {
        e.preventDefault();
        if (showCustomMaker) handleCustomMakerCancel();
        if (showCustomSystem) handleCustomSystemCancel();
      }
    },
    [showCustomMaker, showCustomSystem, handleCustomMakerCancel, handleCustomSystemCancel]
  );

  const selectClasses = `
    w-full px-3 py-2 bg-retro-navy/50 border border-retro-grid/50 rounded-lg
    text-sm text-gray-200 focus:outline-none focus:border-retro-cyan/50
    transition-colors disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const inputClasses = `
    flex-1 px-3 py-2 bg-retro-navy/50 border border-retro-grid/50 rounded-lg
    text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-retro-cyan/50
    transition-colors
  `;

  const buttonClasses = `
    px-3 py-2 text-sm rounded-lg transition-colors
  `;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Maker field */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Maker
        </label>

        {showCustomMaker ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={customMakerInput}
              onChange={(e) => setCustomMakerInput(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, handleCustomMakerSubmit)}
              placeholder="Enter maker name..."
              className={inputClasses}
              autoFocus
              disabled={disabled}
            />
            <button
              onClick={handleCustomMakerSubmit}
              disabled={disabled || !customMakerInput.trim()}
              className={`${buttonClasses} bg-retro-cyan/20 text-retro-cyan hover:bg-retro-cyan/30 disabled:opacity-50`}
            >
              Add
            </button>
            <button
              onClick={handleCustomMakerCancel}
              disabled={disabled}
              className={`${buttonClasses} bg-retro-grid/20 text-gray-400 hover:bg-retro-grid/30`}
            >
              Cancel
            </button>
          </div>
        ) : (
          <select
            value={isCustomMaker ? "" : maker}
            onChange={handleMakerSelectChange}
            disabled={disabled}
            className={selectClasses}
          >
            <option value="">Select maker...</option>
            {allMakers.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
            <option value="__custom__">Other (custom)...</option>
            {isCustomMaker && (
              <option value={maker} disabled>
                {maker} (custom)
              </option>
            )}
          </select>
        )}

        {isCustomMaker && !showCustomMaker && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Custom: <span className="text-retro-cyan">{maker}</span>
            </span>
            <button
              onClick={() => {
                onMakerChange("");
                onSystemChange("");
              }}
              className="text-xs text-gray-500 hover:text-retro-pink"
              disabled={disabled}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* System field */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          System
        </label>

        {showCustomSystem ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={customSystemInput}
              onChange={(e) => setCustomSystemInput(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, handleCustomSystemSubmit)}
              placeholder="Enter system name..."
              className={inputClasses}
              autoFocus
              disabled={disabled}
            />
            <button
              onClick={handleCustomSystemSubmit}
              disabled={disabled || !customSystemInput.trim()}
              className={`${buttonClasses} bg-retro-cyan/20 text-retro-cyan hover:bg-retro-cyan/30 disabled:opacity-50`}
            >
              Add
            </button>
            <button
              onClick={handleCustomSystemCancel}
              disabled={disabled}
              className={`${buttonClasses} bg-retro-grid/20 text-gray-400 hover:bg-retro-grid/30`}
            >
              Cancel
            </button>
          </div>
        ) : (
          <select
            value={isCustomSystem ? "" : system}
            onChange={handleSystemSelectChange}
            disabled={disabled || !maker}
            className={selectClasses}
          >
            <option value="">
              {maker ? "Select system..." : "Select a maker first..."}
            </option>
            {availableSystems.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            {maker && <option value="__custom__">Other (custom)...</option>}
            {isCustomSystem && (
              <option value={system} disabled>
                {system} (custom)
              </option>
            )}
          </select>
        )}

        {isCustomSystem && !showCustomSystem && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Custom: <span className="text-retro-cyan">{system}</span>
            </span>
            <button
              onClick={() => onSystemChange("")}
              className="text-xs text-gray-500 hover:text-retro-pink"
              disabled={disabled}
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Compact version for use in filters
 */
export function MakerSystemSelectCompact({
  maker,
  system,
  onMakerChange,
  onSystemChange,
  disabled = false,
  className = "",
}: MakerSystemSelectProps) {
  const allMakers = useMemo(() => KNOWN_MAKERS.map((m) => m.maker), []);
  const availableSystems = useMemo(() => {
    if (!maker) return [];
    return getSystemsForMaker(maker);
  }, [maker]);

  const selectClasses = `
    px-2 py-1.5 bg-retro-navy/50 border border-retro-grid/50 rounded
    text-xs text-gray-200 focus:outline-none focus:border-retro-cyan/50
    transition-colors disabled:opacity-50
  `;

  return (
    <div className={`flex gap-2 ${className}`}>
      <select
        value={maker}
        onChange={(e) => {
          onMakerChange(e.target.value);
          if (e.target.value !== maker) onSystemChange("");
        }}
        disabled={disabled}
        className={selectClasses}
      >
        <option value="">All makers</option>
        {allMakers.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <select
        value={system}
        onChange={(e) => onSystemChange(e.target.value)}
        disabled={disabled || !maker}
        className={selectClasses}
      >
        <option value="">{maker ? "All systems" : "Select maker..."}</option>
        {availableSystems.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
