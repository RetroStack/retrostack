/**
 * Character Grid Item Component
 *
 * Individual character cell for interactive grids with touch support.
 * Features:
 * - Click to select with shift/meta key modifiers
 * - Long press for selection mode on touch devices
 * - Right-click context menu support
 * - Visual selection states (primary and batch)
 * - Drag-to-select integration
 *
 * @module components/character-editor/character/CharacterGridItem
 */
"use client";

import { useCallback } from "react";
import { CharacterDisplay } from "./CharacterDisplay";
import { Character } from "@/lib/character-editor/types";
import { useLongPress } from "@/hooks/useLongPress";

export interface CharacterGridItemProps {
  /** The character to display */
  character: Character;
  /** Index of this character in the grid */
  index: number;
  /** Currently selected character index */
  selectedIndex?: number;
  /** Set of batch-selected character indices */
  batchSelection?: Set<number>;
  /** Callback when the character is selected */
  onSelect?: (index: number, shiftKey: boolean, metaOrCtrlKey?: boolean) => void;
  /** Callback for right-click context menu */
  onContextMenu?: (x: number, y: number, index: number) => void;
  /** Callback when long press is detected */
  onLongPress?: (index: number) => void;
  /** Whether selection mode is active */
  isSelectionMode?: boolean;
  /** Scale factor for small character display */
  smallScale: number;
  /** Foreground color */
  foregroundColor: string;
  /** Background color */
  backgroundColor: string;
  /** Whether to show character indices */
  showIndices: boolean;
}

/**
 * Individual character item with long-press support
 */
export function CharacterGridItem({
  character,
  index,
  selectedIndex,
  batchSelection,
  onSelect,
  onContextMenu,
  onLongPress,
  isSelectionMode,
  smallScale,
  foregroundColor,
  backgroundColor,
  showIndices,
}: CharacterGridItemProps) {
  const isSelected = selectedIndex === index || batchSelection?.has(index);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Prevent click if this was a long press
      onSelect?.(index, e.shiftKey, e.metaKey || e.ctrlKey);
    },
    [index, onSelect]
  );

  const handleLongPress = useCallback(() => {
    onLongPress?.(index);
  }, [index, onLongPress]);

  const longPressHandlers = useLongPress({
    onLongPress: handleLongPress,
    disabled: !onLongPress,
  });

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (onContextMenu) {
        e.preventDefault();
        // Select the character on right-click if not already selected
        if (selectedIndex !== index && !batchSelection?.has(index)) {
          onSelect?.(index, false, false);
        }
        onContextMenu(e.clientX, e.clientY, index);
      }
    },
    [index, selectedIndex, batchSelection, onSelect, onContextMenu]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect?.(index, e.shiftKey, e.metaKey || e.ctrlKey);
      }
    },
    [index, onSelect]
  );

  // Merge context menu handlers - our custom handler should take precedence
  const mergedContextMenu = useCallback(
    (e: React.MouseEvent) => {
      // First, handle long press context menu prevention
      longPressHandlers.onContextMenu(e as React.MouseEvent & React.TouchEvent);
      // Then handle our custom context menu if not prevented
      if (!e.defaultPrevented) {
        handleContextMenu(e);
      }
    },
    [longPressHandlers, handleContextMenu]
  );

  return (
    <div
      onClick={handleClick}
      onContextMenu={mergedContextMenu}
      onKeyDown={handleKeyDown}
      onMouseDown={longPressHandlers.onMouseDown}
      onMouseUp={longPressHandlers.onMouseUp}
      onMouseLeave={longPressHandlers.onMouseLeave}
      onTouchStart={longPressHandlers.onTouchStart}
      onTouchEnd={longPressHandlers.onTouchEnd}
      onTouchMove={longPressHandlers.onTouchMove}
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      data-grid-index={index}
      className="focus:outline-none focus-visible:ring-1 focus-visible:ring-retro-cyan rounded relative touch-manipulation"
      style={{ touchAction: "manipulation" }}
    >
      <CharacterDisplay
        character={character}
        mode="small"
        smallScale={smallScale}
        selected={selectedIndex === index}
        batchSelected={batchSelection?.has(index) && selectedIndex !== index}
        foregroundColor={foregroundColor}
        backgroundColor={backgroundColor}
        interactive={false}
        index={index}
        showIndex={showIndices}
      />
      {/* Checkmark overlay for selection mode */}
      {isSelectionMode && isSelected && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-retro-cyan rounded-bl flex items-center justify-center">
          <svg className="w-2 h-2 text-retro-dark" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
