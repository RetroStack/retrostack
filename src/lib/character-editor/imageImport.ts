/**
 * Image Import Utilities
 *
 * Functions for importing character sets from PNG/image files
 */

import { Character } from "./types";

/**
 * Options for importing from an image
 */
export interface ImageImportOptions {
  /** Character width in pixels */
  charWidth: number;
  /** Character height in pixels */
  charHeight: number;
  /** Grid offset X (starting position) */
  offsetX: number;
  /** Grid offset Y (starting position) */
  offsetY: number;
  /** Horizontal gap between characters in pixels */
  gapX: number;
  /** Vertical gap between characters in pixels */
  gapY: number;
  /** Force a specific number of columns (0 = auto-detect) */
  forceColumns: number;
  /** Force a specific number of rows (0 = auto-detect) */
  forceRows: number;
  /** Threshold for black/white conversion (0-255) */
  threshold: number;
  /** Whether to invert colors (treat dark as on) */
  invert: boolean;
  /** Maximum number of characters to import */
  maxCharacters?: number;
}

/**
 * Default import options
 */
export function getDefaultImageImportOptions(): ImageImportOptions {
  return {
    charWidth: 8,
    charHeight: 8,
    offsetX: 0,
    offsetY: 0,
    gapX: 0,
    gapY: 0,
    forceColumns: 0,
    forceRows: 0,
    threshold: 128,
    invert: false,
    maxCharacters: 256,
  };
}

/**
 * Result of parsing an image
 */
export interface ImageParseResult {
  /** Parsed characters */
  characters: Character[];
  /** Number of columns in the grid */
  columns: number;
  /** Number of rows in the grid */
  rows: number;
  /** Image width */
  imageWidth: number;
  /** Image height */
  imageHeight: number;
}

/**
 * Load an image file and return its ImageData
 */
export async function loadImageData(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Create canvas and draw image
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to create canvas context"));
        return;
      }

      // Draw with white background (for transparent images)
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Get brightness of a pixel (0-255)
 */
function getPixelBrightness(
  imageData: ImageData,
  x: number,
  y: number
): number {
  const index = (y * imageData.width + x) * 4;
  const r = imageData.data[index];
  const g = imageData.data[index + 1];
  const b = imageData.data[index + 2];
  const a = imageData.data[index + 3];

  // If fully transparent, treat as white (background)
  if (a === 0) return 255;

  // Use perceived brightness formula
  return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}

/**
 * Extract a single character from an image
 */
function extractCharacter(
  imageData: ImageData,
  startX: number,
  startY: number,
  charWidth: number,
  charHeight: number,
  threshold: number,
  invert: boolean
): Character {
  const pixels: boolean[][] = [];

  for (let y = 0; y < charHeight; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < charWidth; x++) {
      const imgX = startX + x;
      const imgY = startY + y;

      // Check bounds
      if (
        imgX < 0 ||
        imgX >= imageData.width ||
        imgY < 0 ||
        imgY >= imageData.height
      ) {
        row.push(false);
        continue;
      }

      const brightness = getPixelBrightness(imageData, imgX, imgY);
      // Dark pixels (below threshold) are "on" by default
      let isOn = brightness < threshold;
      if (invert) isOn = !isOn;
      row.push(isOn);
    }
    pixels.push(row);
  }

  return { pixels };
}

/**
 * Parse an image into characters
 */
export function parseImageToCharacters(
  imageData: ImageData,
  options: ImageImportOptions
): ImageParseResult {
  const {
    charWidth,
    charHeight,
    offsetX,
    offsetY,
    gapX,
    gapY,
    forceColumns,
    forceRows,
    threshold,
    invert,
    maxCharacters = 256,
  } = options;

  // Calculate grid dimensions
  const availableWidth = imageData.width - offsetX;
  const availableHeight = imageData.height - offsetY;

  // Cell size includes character + gap
  const cellWidth = charWidth + gapX;
  const cellHeight = charHeight + gapY;

  // Use forced dimensions if provided, otherwise auto-detect
  const columns =
    forceColumns > 0 ? forceColumns : Math.floor(availableWidth / cellWidth);
  const rows =
    forceRows > 0 ? forceRows : Math.floor(availableHeight / cellHeight);

  const characters: Character[] = [];

  // Extract characters row by row, left to right
  for (let row = 0; row < rows && characters.length < maxCharacters; row++) {
    for (
      let col = 0;
      col < columns && characters.length < maxCharacters;
      col++
    ) {
      const startX = offsetX + col * cellWidth;
      const startY = offsetY + row * cellHeight;

      const char = extractCharacter(
        imageData,
        startX,
        startY,
        charWidth,
        charHeight,
        threshold,
        invert
      );

      characters.push(char);
    }
  }

  return {
    characters,
    columns,
    rows,
    imageWidth: imageData.width,
    imageHeight: imageData.height,
  };
}

/**
 * Auto-detect character dimensions from an image
 * Looks for common grid patterns based on image dimensions
 */
export function detectCharacterDimensions(
  imageWidth: number,
  imageHeight: number
): { width: number; height: number; columns: number; rows: number }[] {
  const suggestions: {
    width: number;
    height: number;
    columns: number;
    rows: number;
  }[] = [];

  // Common character sizes
  const commonSizes = [
    [8, 8],
    [8, 16],
    [6, 8],
    [8, 10],
    [8, 12],
    [16, 16],
  ];

  for (const [w, h] of commonSizes) {
    const cols = Math.floor(imageWidth / w);
    const rows = Math.floor(imageHeight / h);

    if (cols > 0 && rows > 0) {
      const totalChars = cols * rows;
      // Prefer sizes that result in common character counts
      if (
        totalChars === 128 ||
        totalChars === 256 ||
        totalChars === 96 ||
        totalChars === 64 ||
        totalChars === 16
      ) {
        suggestions.unshift({ width: w, height: h, columns: cols, rows });
      } else if (totalChars >= 16 && totalChars <= 512) {
        suggestions.push({ width: w, height: h, columns: cols, rows });
      }
    }
  }

  // If no good matches, just provide 8x8 as default
  if (suggestions.length === 0) {
    const cols = Math.floor(imageWidth / 8);
    const rows = Math.floor(imageHeight / 8);
    suggestions.push({ width: 8, height: 8, columns: cols, rows });
  }

  return suggestions;
}

/**
 * Create a preview image showing the grid overlay
 */
export function createGridOverlayImage(
  imageData: ImageData,
  options: ImageImportOptions
): ImageData {
  const { charWidth, charHeight, offsetX, offsetY } = options;

  // Create a copy of the image data
  const result = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );

  // Draw grid lines (semi-transparent cyan)
  const gridColor = { r: 0, g: 255, b: 255, a: 128 };

  // Draw vertical lines
  for (let x = offsetX; x < imageData.width; x += charWidth) {
    for (let y = 0; y < imageData.height; y++) {
      const index = (y * imageData.width + x) * 4;
      result.data[index] = gridColor.r;
      result.data[index + 1] = gridColor.g;
      result.data[index + 2] = gridColor.b;
      result.data[index + 3] = gridColor.a;
    }
  }

  // Draw horizontal lines
  for (let y = offsetY; y < imageData.height; y += charHeight) {
    for (let x = 0; x < imageData.width; x++) {
      const index = (y * imageData.width + x) * 4;
      result.data[index] = gridColor.r;
      result.data[index + 1] = gridColor.g;
      result.data[index + 2] = gridColor.b;
      result.data[index + 3] = gridColor.a;
    }
  }

  return result;
}

/**
 * Check if a file is a valid image file
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
  return validTypes.includes(file.type);
}

/**
 * Get supported image file extensions
 */
export function getSupportedImageExtensions(): string {
  return ".png, .jpg, .jpeg, .gif, .webp";
}
