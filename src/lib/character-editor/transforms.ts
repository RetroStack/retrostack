/**
 * Character ROM Editor - Transform Operations
 *
 * Provides pixel manipulation operations:
 * - Rotate left/right
 * - Shift up/down/left/right with wrap
 * - Resize with anchor point
 * - Invert, flip, mirror
 */

import { Character, AnchorPoint, createEmptyCharacter } from "./types";

/**
 * Rotate character 90 degrees
 * Note: For non-square characters, maintains original dimensions by fitting rotated content
 */
export function rotateCharacter(
  character: Character,
  direction: "left" | "right"
): Character {
  const height = character.pixels.length;
  const width = character.pixels[0]?.length || 0;

  const newPixels: boolean[][] = [];

  for (let row = 0; row < height; row++) {
    const newRow: boolean[] = [];
    for (let col = 0; col < width; col++) {
      let sourceRow: number;
      let sourceCol: number;

      if (direction === "right") {
        // Clockwise rotation
        sourceRow = width - 1 - col;
        sourceCol = row;
      } else {
        // Counter-clockwise rotation
        sourceRow = col;
        sourceCol = height - 1 - row;
      }

      // Handle dimension mismatch for non-square characters
      if (
        sourceRow >= 0 &&
        sourceRow < height &&
        sourceCol >= 0 &&
        sourceCol < width
      ) {
        newRow.push(character.pixels[sourceRow]?.[sourceCol] || false);
      } else {
        newRow.push(false);
      }
    }
    newPixels.push(newRow);
  }

  return { pixels: newPixels };
}

/**
 * Shift character pixels in a direction
 */
export function shiftCharacter(
  character: Character,
  direction: "up" | "down" | "left" | "right",
  wrap: boolean = true
): Character {
  const height = character.pixels.length;
  const width = character.pixels[0]?.length || 0;
  const newPixels: boolean[][] = [];

  for (let row = 0; row < height; row++) {
    const newRow: boolean[] = [];
    for (let col = 0; col < width; col++) {
      let sourceRow = row;
      let sourceCol = col;

      switch (direction) {
        case "up":
          sourceRow = row + 1;
          if (sourceRow >= height) {
            sourceRow = wrap ? 0 : height - 1;
            if (!wrap) {
              newRow.push(false);
              continue;
            }
          }
          break;
        case "down":
          sourceRow = row - 1;
          if (sourceRow < 0) {
            sourceRow = wrap ? height - 1 : 0;
            if (!wrap) {
              newRow.push(false);
              continue;
            }
          }
          break;
        case "left":
          sourceCol = col + 1;
          if (sourceCol >= width) {
            sourceCol = wrap ? 0 : width - 1;
            if (!wrap) {
              newRow.push(false);
              continue;
            }
          }
          break;
        case "right":
          sourceCol = col - 1;
          if (sourceCol < 0) {
            sourceCol = wrap ? width - 1 : 0;
            if (!wrap) {
              newRow.push(false);
              continue;
            }
          }
          break;
      }

      newRow.push(character.pixels[sourceRow]?.[sourceCol] || false);
    }
    newPixels.push(newRow);
  }

  return { pixels: newPixels };
}

/**
 * Resize character maintaining content relative to anchor point
 */
export function resizeCharacter(
  character: Character,
  newWidth: number,
  newHeight: number,
  anchor: AnchorPoint
): Character {
  const oldHeight = character.pixels.length;
  const oldWidth = character.pixels[0]?.length || 0;

  // Calculate offsets based on anchor
  let offsetX = 0;
  let offsetY = 0;

  switch (anchor) {
    case "tl":
      offsetX = 0;
      offsetY = 0;
      break;
    case "tr":
      offsetX = newWidth - oldWidth;
      offsetY = 0;
      break;
    case "bl":
      offsetX = 0;
      offsetY = newHeight - oldHeight;
      break;
    case "br":
      offsetX = newWidth - oldWidth;
      offsetY = newHeight - oldHeight;
      break;
  }

  const newPixels: boolean[][] = [];

  for (let row = 0; row < newHeight; row++) {
    const newRow: boolean[] = [];
    for (let col = 0; col < newWidth; col++) {
      const oldRow = row - offsetY;
      const oldCol = col - offsetX;

      if (
        oldRow >= 0 &&
        oldRow < oldHeight &&
        oldCol >= 0 &&
        oldCol < oldWidth
      ) {
        newRow.push(character.pixels[oldRow][oldCol]);
      } else {
        newRow.push(false);
      }
    }
    newPixels.push(newRow);
  }

  return { pixels: newPixels };
}

/**
 * Invert all pixels in character
 */
export function invertCharacter(character: Character): Character {
  return {
    pixels: character.pixels.map((row) => row.map((pixel) => !pixel)),
  };
}

/**
 * Flip character horizontally (mirror)
 */
export function flipHorizontal(character: Character): Character {
  return {
    pixels: character.pixels.map((row) => [...row].reverse()),
  };
}

/**
 * Flip character vertically
 */
export function flipVertical(character: Character): Character {
  return {
    pixels: [...character.pixels].reverse().map((row) => [...row]),
  };
}

/**
 * Clear all pixels in character
 */
export function clearCharacter(width: number, height: number): Character {
  return createEmptyCharacter(width, height);
}

/**
 * Fill all pixels in character
 */
export function fillCharacter(width: number, height: number): Character {
  const pixels: boolean[][] = [];
  for (let row = 0; row < height; row++) {
    pixels.push(new Array(width).fill(true));
  }
  return { pixels };
}

/**
 * Toggle a single pixel
 */
export function togglePixel(
  character: Character,
  row: number,
  col: number
): Character {
  const newPixels = character.pixels.map((r, ri) =>
    ri === row ? r.map((p, ci) => (ci === col ? !p : p)) : [...r]
  );
  return { pixels: newPixels };
}

/**
 * Set a single pixel to a specific value
 */
export function setPixel(
  character: Character,
  row: number,
  col: number,
  value: boolean
): Character {
  const newPixels = character.pixels.map((r, ri) =>
    ri === row ? r.map((p, ci) => (ci === col ? value : p)) : [...r]
  );
  return { pixels: newPixels };
}

/**
 * Apply a transform to multiple characters
 */
export function batchTransform(
  characters: Character[],
  indices: Set<number>,
  transform: (char: Character) => Character
): Character[] {
  return characters.map((char, index) =>
    indices.has(index) ? transform(char) : char
  );
}

/**
 * Check if a pixel position differs across multiple characters
 * Returns: 'same-on' | 'same-off' | 'mixed'
 */
export function getPixelState(
  characters: Character[],
  indices: Set<number>,
  row: number,
  col: number
): "same-on" | "same-off" | "mixed" {
  const selected = Array.from(indices).map((i) => characters[i]);
  if (selected.length === 0) return "same-off";

  const firstValue = selected[0]?.pixels[row]?.[col] || false;

  for (let i = 1; i < selected.length; i++) {
    const value = selected[i]?.pixels[row]?.[col] || false;
    if (value !== firstValue) {
      return "mixed";
    }
  }

  return firstValue ? "same-on" : "same-off";
}

/**
 * Toggle a pixel across multiple characters
 */
export function batchTogglePixel(
  characters: Character[],
  indices: Set<number>,
  row: number,
  col: number
): Character[] {
  const state = getPixelState(characters, indices, row, col);
  const newValue = state !== "same-on"; // If mixed or off, turn on; if on, turn off

  return characters.map((char, index) => {
    if (!indices.has(index)) return char;
    return setPixel(char, row, col, newValue);
  });
}
