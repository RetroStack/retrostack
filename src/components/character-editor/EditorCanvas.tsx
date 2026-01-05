"use client";

import { useMemo, useCallback, useRef, useState } from "react";
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
  /** Minimum zoom level */
  minZoom?: number;
  /** Maximum zoom level */
  maxZoom?: number;
  /** Callback when zoom changes (for scroll wheel zoom) */
  onZoomChange?: (zoom: number) => void;
  /** Callback when hovering over a pixel (returns coordinates) */
  onPixelHover?: (row: number, col: number) => void;
  /** Callback when mouse leaves the canvas */
  onPixelLeave?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Main editing canvas for character pixels
 * Simplified version - header/footer moved to EditorHeader/EditorFooter
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
  minZoom = 8,
  maxZoom = 40,
  onZoomChange,
  onPixelHover,
  onPixelLeave,
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
    (row: number, col: number, isRightClick?: boolean) => {
      if (!isDragging) {
        if (isRightClick) {
          // Right-click: paint background (turn pixel off)
          onPixelSet?.(row, col, false);
          setDragValue(false);
        } else {
          // Left-click: toggle pixel
          onPixelToggle?.(row, col);
          // Set drag value based on the new state (opposite of current)
          const currentValue = character?.pixels[row]?.[col] ?? false;
          setDragValue(!currentValue);
        }
        setIsDragging(true);
      }
    },
    [isDragging, onPixelToggle, onPixelSet, character]
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

  // Handle scroll wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      // Only zoom if Ctrl/Cmd is held
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (onZoomChange) {
          const delta = e.deltaY > 0 ? -4 : 4;
          const newZoom = Math.min(maxZoom, Math.max(minZoom, zoom + delta));
          if (newZoom !== zoom) {
            onZoomChange(newZoom);
          }
        }
      }
    },
    [zoom, minZoom, maxZoom, onZoomChange]
  );

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
      className={`flex items-center justify-center h-full overflow-hidden bg-black/20 ${className}`}
      tabIndex={0}
      onWheel={handleWheel}
    >
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
          onPixelHover={onPixelHover}
          onPixelLeave={onPixelLeave}
          interactive={true}
          mixedPixels={mixedPixels}
        />
      </div>
    </div>
  );
}
