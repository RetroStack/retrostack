"use client";

import { useCallback, useState } from "react";
import { InteractiveCharacterGrid } from "./CharacterGrid";
import { CharacterSetOverview } from "./CharacterSetOverview";
import { Character, CharacterSetConfig } from "@/lib/character-editor";

export interface EditorSidebarProps {
  /** Array of characters */
  characters: Character[];
  /** Character set configuration */
  config: CharacterSetConfig;
  /** Currently selected character index */
  selectedIndex: number;
  /** Batch selected character indices */
  batchSelection: Set<number>;
  /** Callback when selection changes */
  onSelect: (index: number, shiftKey: boolean) => void;
  /** Callback to add a new character */
  onAddCharacter?: () => void;
  /** Callback to delete selected character(s) */
  onDeleteSelected?: () => void;
  /** Whether to show add button */
  showAddButton?: boolean;
  /** Foreground color */
  foregroundColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Sidebar component for character selection in the editor
 */
export function EditorSidebar({
  characters,
  config,
  selectedIndex,
  batchSelection,
  onSelect,
  onAddCharacter,
  onDeleteSelected,
  showAddButton = true,
  foregroundColor = "#ffffff",
  backgroundColor = "#000000",
  className = "",
}: EditorSidebarProps) {
  const totalSelected = batchSelection.size + 1;
  const hasMultipleSelected = totalSelected > 1;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const charCount = characters.length;
      if (charCount === 0) return;

      switch (e.key) {
        case "ArrowUp":
        case "ArrowLeft": {
          e.preventDefault();
          const newIndex = selectedIndex > 0 ? selectedIndex - 1 : charCount - 1;
          onSelect(newIndex, e.shiftKey);
          break;
        }
        case "ArrowDown":
        case "ArrowRight": {
          e.preventDefault();
          const newIndex = selectedIndex < charCount - 1 ? selectedIndex + 1 : 0;
          onSelect(newIndex, e.shiftKey);
          break;
        }
        case "Delete":
        case "Backspace": {
          e.preventDefault();
          onDeleteSelected?.();
          break;
        }
        case "a":
        case "A": {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            // Select all - handled by parent
          }
          break;
        }
      }
    },
    [characters.length, selectedIndex, onSelect, onDeleteSelected]
  );

  return (
    <div
      className={`flex flex-col h-full ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-retro-grid/30">
        <div className="text-sm font-medium text-gray-300">
          Characters
          <span className="ml-2 text-xs text-gray-500">
            ({characters.length})
          </span>
        </div>
      </div>

      {/* Character set overview - collapsible */}
      <div className="border-b border-retro-grid/30">
        <CharacterSetOverview
          characters={characters}
          config={config}
          selectedIndex={selectedIndex}
          onSelect={(index) => onSelect(index, false)}
          foregroundColor={foregroundColor}
          backgroundColor={backgroundColor}
          maxWidth={200}
          pixelScale={1}
          collapsible
          defaultCollapsed={false}
        />
      </div>

      {/* Selection info */}
      {hasMultipleSelected && (
        <div className="px-3 py-2 bg-retro-pink/10 border-b border-retro-grid/30">
          <span className="text-xs text-retro-pink">
            {totalSelected} characters selected
          </span>
        </div>
      )}

      {/* Character grid - larger tiles, no indices */}
      <div className="flex-1 overflow-hidden">
        <InteractiveCharacterGrid
          characters={characters}
          config={config}
          selectedIndex={selectedIndex}
          batchSelection={batchSelection}
          onSelect={onSelect}
          showAddButton={showAddButton && !!onAddCharacter}
          onAdd={onAddCharacter}
          foregroundColor={foregroundColor}
          backgroundColor={backgroundColor}
          showIndices={false}
          smallScale={4}
          minColumns={3}
          maxColumns={8}
          gap={6}
          className="h-full"
        />
      </div>

      {/* Footer with actions */}
      <div className="p-3 border-t border-retro-grid/30">
        <div className="text-[10px] text-gray-500 space-y-1">
          <div>Click to select • Shift+click to multi-select</div>
          <div>Arrow keys to navigate • Del to delete</div>
        </div>
      </div>
    </div>
  );
}
