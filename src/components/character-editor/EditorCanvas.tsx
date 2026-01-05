"use client";

import { useMemo, useCallback, useRef, useState, useEffect } from "react";
import { CharacterDisplay } from "./CharacterDisplay";
import { Character, CharacterSetConfig } from "@/lib/character-editor";

export interface EditorCanvasProps {
  /** Character being edited */
  character: Character | null;
  /** Character set configuration */
  config: CharacterSetConfig;
  /** Callback when a pixel is toggled */
  onPixelToggle?: (row: number, col: number) => void;
  /** Callback when a pixel is set (during drag) */
  onPixelSet?: (row: number, col: number, value: boolean) => void;
  /** Callback when drag ends */
  onDragEnd?: () => void;
  /** Get pixel state for batch editing */
  getPixelState?: (row: number, col: number) => "same-on" | "same-off" | "mixed";
  /** Whether batch editing mode is active */
  batchMode?: boolean;
  /** Foreground color */
  foregroundColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Grid line color */
  gridColor?: string;
  /** Grid line thickness */
  gridThickness?: number;
  /** Zoom level (scale factor) */
  zoom?: number;
  /** Callback when zoom changes */
  onZoomChange?: (zoom: number) => void;
  /** Character index being edited */
  characterIndex?: number;
  /** Total number of characters */
  totalCharacters?: number;
  /** Additional CSS classes */
  className?: string;
}

const MIN_ZOOM = 8;
const MAX_ZOOM = 40;
const ZOOM_STEP = 4;

/**
 * Main editing canvas for character pixels
 */
export function EditorCanvas({
  character,
  config,
  onPixelToggle,
  onPixelSet,
  onDragEnd,
  getPixelState,
  batchMode = false,
  foregroundColor = "#ffffff",
  backgroundColor = "#000000",
  gridColor = "#333333",
  gridThickness = 1,
  zoom = 20,
  onZoomChange,
  characterIndex,
  totalCharacters,
  className = "",
}: EditorCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState<boolean | null>(null);

  // Calculate mixed pixels for batch editing display
  const mixedPixels = useMemo(() => {
    if (!batchMode || !getPixelState || !character) return undefined;

    const mixed = new Set<string>();
    for (let row = 0; row < config.height; row++) {
      for (let col = 0; col < config.width; col++) {
        if (getPixelState(row, col) === "mixed") {
          mixed.add(`${row},${col}`);
        }
      }
    }
    return mixed.size > 0 ? mixed : undefined;
  }, [batchMode, getPixelState, character, config.height, config.width]);

  const handlePixelClick = useCallback(
    (row: number, col: number) => {
      if (!isDragging) {
        onPixelToggle?.(row, col);

        // Set drag value based on the new state (opposite of current)
        const currentValue = character?.pixels[row]?.[col] ?? false;
        setDragValue(!currentValue);
        setIsDragging(true);
      }
    },
    [isDragging, onPixelToggle, character]
  );

  const handlePixelDrag = useCallback(
    (row: number, col: number) => {
      if (isDragging && dragValue !== null && onPixelSet) {
        onPixelSet(row, col, dragValue);
      }
    },
    [isDragging, dragValue, onPixelSet]
  );

  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDragValue(null);
      onDragEnd?.();
    }
  }, [isDragging, onDragEnd]);

  // Handle zoom controls
  const zoomIn = useCallback(() => {
    if (onZoomChange && zoom < MAX_ZOOM) {
      onZoomChange(Math.min(zoom + ZOOM_STEP, MAX_ZOOM));
    }
  }, [zoom, onZoomChange]);

  const zoomOut = useCallback(() => {
    if (onZoomChange && zoom > MIN_ZOOM) {
      onZoomChange(Math.max(zoom - ZOOM_STEP, MIN_ZOOM));
    }
  }, [zoom, onZoomChange]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if focused on editor
      if (!containerRef.current?.contains(document.activeElement)) return;

      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        zoomIn();
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        zoomOut();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomIn, zoomOut]);

  if (!character) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center text-gray-500">
          <svg
            className="w-16 h-16 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z"
            />
          </svg>
          <p>No character selected</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`flex flex-col h-full ${className}`}
      tabIndex={0}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-retro-grid/30">
        <div className="text-sm text-gray-400">
          {characterIndex !== undefined && totalCharacters !== undefined ? (
            <span>
              Character <span className="text-retro-cyan">{characterIndex}</span>{" "}
              of {totalCharacters}
            </span>
          ) : (
            <span>Editor</span>
          )}
          {batchMode && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-retro-pink/20 text-retro-pink rounded">
              Batch
            </span>
          )}
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="Zoom out (-)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-xs text-gray-500 w-12 text-center">{zoom}x</span>
          <button
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="Zoom in (+)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-black/20">
        <div
          className="inline-block"
          onMouseLeave={handleDragEnd}
          onMouseUp={handleDragEnd}
        >
          <CharacterDisplay
            character={character}
            mode="large"
            scale={zoom}
            foregroundColor={foregroundColor}
            backgroundColor={backgroundColor}
            gridColor={gridColor}
            gridThickness={gridThickness}
            onPixelClick={handlePixelClick}
            onPixelDrag={handlePixelDrag}
            onDragEnd={handleDragEnd}
            interactive={true}
            mixedPixels={mixedPixels}
          />
        </div>
      </div>

      {/* Footer with size info */}
      <div className="px-4 py-2 border-t border-retro-grid/30 text-xs text-gray-500">
        {config.width}x{config.height} pixels
      </div>
    </div>
  );
}
