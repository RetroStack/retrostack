/**
 * Font Import Utilities
 *
 * Functions for importing character sets from TTF/OTF/WOFF font files
 * using opentype.js for font parsing
 *
 * Note: Requires opentype.js to be installed: npm install opentype.js
 */

import { Character } from "./types";

// Type definitions for opentype.js (optional dependency)
interface OpenTypeFont {
  names: {
    fontFamily?: { en?: string };
    fullName?: { en?: string };
  };
  unitsPerEm: number;
  ascender: number;
  descender: number;
  charToGlyph(char: string): OpenTypeGlyph;
}

interface OpenTypeGlyph {
  index: number;
  advanceWidth: number;
  getPath(x: number, y: number, fontSize: number): OpenTypePath;
}

interface OpenTypePath {
  fill: string;
  draw(ctx: CanvasRenderingContext2D): void;
}

/**
 * Options for importing from a font file
 */
export interface FontImportOptions {
  /** Character width in pixels */
  charWidth: number;
  /** Character height in pixels */
  charHeight: number;
  /** Start character code (e.g., 32 for ASCII space) */
  startCode: number;
  /** End character code (e.g., 126 for ASCII tilde) */
  endCode: number;
  /** Font size in points for rendering */
  fontSize: number;
  /** Threshold for black/white conversion (0-255) */
  threshold: number;
  /** Whether to center glyphs in their cells */
  centerGlyphs: boolean;
  /** Baseline offset (0 = auto, positive = move up) */
  baselineOffset: number;
}

/**
 * Default font import options
 */
export function getDefaultFontImportOptions(): FontImportOptions {
  return {
    charWidth: 8,
    charHeight: 8,
    startCode: 32, // ASCII space
    endCode: 126, // ASCII tilde (printable ASCII range)
    fontSize: 8,
    threshold: 128,
    centerGlyphs: true,
    baselineOffset: 0,
  };
}

/**
 * Common character ranges for import
 */
export const CHARACTER_RANGES = [
  { name: "Printable ASCII", startCode: 32, endCode: 126, count: 95 },
  { name: "Extended ASCII", startCode: 32, endCode: 255, count: 224 },
  { name: "Uppercase Only", startCode: 65, endCode: 90, count: 26 },
  { name: "Lowercase Only", startCode: 97, endCode: 122, count: 26 },
  { name: "Digits Only", startCode: 48, endCode: 57, count: 10 },
  { name: "Full 256 (with blanks)", startCode: 0, endCode: 255, count: 256 },
];

/**
 * Result of parsing a font
 */
export interface FontParseResult {
  /** Parsed characters */
  characters: Character[];
  /** Font family name */
  fontFamily: string;
  /** Number of successfully imported glyphs */
  importedCount: number;
  /** Number of missing glyphs (replaced with blank) */
  missingCount: number;
}

/**
 * Check if opentype.js is available
 */
export function isOpentypeAvailable(): boolean {
  try {
    // Check if opentype is available (would be imported dynamically)
    return typeof window !== "undefined" && "opentype" in window;
  } catch {
    return false;
  }
}

/**
 * Load a font file and return the opentype font object
 */
export async function loadFontFile(file: File): Promise<OpenTypeFont> {
  // Dynamic import of opentype.js with error handling
  let opentype: { parse: (buffer: ArrayBuffer) => OpenTypeFont };
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    opentype = await import("opentype.js" as any);
  } catch {
    throw new Error(
      "Font import requires the opentype.js library. Please install it with: npm install opentype.js"
    );
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const font = opentype.parse(arrayBuffer);
        resolve(font);
      } catch (error) {
        reject(new Error(`Failed to parse font: ${error}`));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read font file"));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Render a single glyph to a character
 */
function renderGlyphToCharacter(
  font: OpenTypeFont,
  charCode: number,
  options: FontImportOptions
): Character {
  const { charWidth, charHeight, fontSize, threshold, centerGlyphs, baselineOffset } = options;

  // Create a canvas for rendering
  const canvas = document.createElement("canvas");
  canvas.width = charWidth;
  canvas.height = charHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    // Return empty character if canvas fails
    return createEmptyCharacter(charWidth, charHeight);
  }

  // Clear canvas with white
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, charWidth, charHeight);

  // Get the glyph
  const glyph = font.charToGlyph(String.fromCharCode(charCode));

  if (!glyph || glyph.index === 0) {
    // Glyph not found, return empty character
    return createEmptyCharacter(charWidth, charHeight);
  }

  // Calculate metrics
  const scale = fontSize / font.unitsPerEm;
  const glyphWidth = glyph.advanceWidth * scale;
  const glyphHeight = (font.ascender - font.descender) * scale;

  // Calculate position
  let x = 0;
  let y = charHeight - (font.descender * scale * -1) + baselineOffset;

  if (centerGlyphs) {
    // Center horizontally
    x = (charWidth - glyphWidth) / 2;
    // Adjust vertical centering
    const verticalOffset = (charHeight - glyphHeight) / 2;
    y = charHeight - (font.descender * scale * -1) - verticalOffset + baselineOffset;
  }

  // Draw the glyph
  ctx.fillStyle = "black";
  const path = glyph.getPath(x, y, fontSize);
  path.fill = "black";
  path.draw(ctx);

  // Convert to pixel data
  const imageData = ctx.getImageData(0, 0, charWidth, charHeight);
  const pixels: boolean[][] = [];

  for (let py = 0; py < charHeight; py++) {
    const row: boolean[] = [];
    for (let px = 0; px < charWidth; px++) {
      const index = (py * charWidth + px) * 4;
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      // Use perceived brightness
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      row.push(brightness < threshold);
    }
    pixels.push(row);
  }

  return { pixels };
}

/**
 * Create an empty character with all pixels off
 */
function createEmptyCharacter(width: number, height: number): Character {
  const pixels: boolean[][] = [];
  for (let y = 0; y < height; y++) {
    pixels.push(new Array(width).fill(false));
  }
  return { pixels };
}

/**
 * Parse a font file into characters
 */
export async function parseFontToCharacters(
  file: File,
  options: FontImportOptions
): Promise<FontParseResult> {
  const font = await loadFontFile(file);

  const fontFamily = font.names?.fontFamily?.en || font.names?.fullName?.en || "Unknown Font";

  const characters: Character[] = [];
  let importedCount = 0;
  let missingCount = 0;

  for (let code = options.startCode; code <= options.endCode; code++) {
    const char = renderGlyphToCharacter(font, code, options);
    characters.push(char);

    // Check if glyph was found (has any pixels set)
    const hasPixels = char.pixels.some((row) => row.some((p) => p));
    if (hasPixels) {
      importedCount++;
    } else if (code >= 33) {
      // Only count as missing if it's a printable character (not space/control)
      missingCount++;
    }
  }

  return {
    characters,
    fontFamily,
    importedCount,
    missingCount,
  };
}

/**
 * Check if a file is a valid font file
 */
export function isValidFontFile(file: File): boolean {
  const validTypes = [
    "font/ttf",
    "font/otf",
    "font/woff",
    "font/woff2",
    "application/x-font-ttf",
    "application/x-font-otf",
    "application/font-woff",
    "application/font-woff2",
  ];

  // Check MIME type
  if (validTypes.includes(file.type)) return true;

  // Check extension as fallback
  const ext = file.name.toLowerCase().split(".").pop();
  return ["ttf", "otf", "woff", "woff2"].includes(ext || "");
}

/**
 * Get supported font file extensions
 */
export function getSupportedFontExtensions(): string {
  return ".ttf, .otf, .woff, .woff2";
}

/**
 * Get a preview of what characters will be imported
 */
export function getCharacterRangePreview(
  startCode: number,
  endCode: number
): string[] {
  const preview: string[] = [];
  const maxPreview = 20;

  for (let code = startCode; code <= endCode && preview.length < maxPreview; code++) {
    if (code >= 32 && code <= 126) {
      preview.push(String.fromCharCode(code));
    } else if (code < 32) {
      preview.push("·"); // Control character placeholder
    } else {
      preview.push(String.fromCharCode(code));
    }
  }

  if (endCode - startCode >= maxPreview) {
    preview.push("...");
  }

  return preview;
}
