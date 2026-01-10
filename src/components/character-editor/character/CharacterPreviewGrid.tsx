"use client";

import { CharacterDisplay } from "./CharacterDisplay";
import { Character, CharacterSetConfig } from "@/lib/character-editor/types";

export interface CharacterPreviewGridProps {
  /** Array of characters to display */
  characters: Character[];
  /** Character set configuration */
  config: CharacterSetConfig;
  /** Maximum number of characters to show */
  maxCharacters?: number;
  /** Foreground color */
  foregroundColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Scale factor for small character display */
  smallScale?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Simplified grid for displaying character previews (non-interactive)
 */
export function CharacterPreviewGrid({
  characters,
  config,
  maxCharacters = 16,
  foregroundColor = "#ffffff",
  backgroundColor = "#000000",
  smallScale = 1,
  className = "",
}: CharacterPreviewGridProps) {
  const displayChars = characters.slice(0, maxCharacters);
  const remainingCount = characters.length - maxCharacters;

  // Calculate columns to show roughly 4 rows
  const columns = Math.ceil(Math.sqrt(maxCharacters));
  const charWidth = config.width * smallScale;

  return (
    <div className={`relative ${className}`}>
      <div
        className="grid gap-0.5"
        style={{
          gridTemplateColumns: `repeat(${columns}, ${charWidth}px)`,
        }}
      >
        {displayChars.map((character, index) => (
          <CharacterDisplay
            key={index}
            character={character}
            mode="small"
            smallScale={smallScale}
            foregroundColor={foregroundColor}
            backgroundColor={backgroundColor}
            interactive={false}
          />
        ))}
      </div>

      {/* Show remaining count */}
      {remainingCount > 0 && (
        <div className="absolute bottom-0 right-0 bg-retro-navy/90 text-[10px] text-gray-400 px-1 rounded">
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
