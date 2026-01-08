/**
 * Character ROM Editor - Default Character Sets
 *
 * Built-in character sets for classic retro systems.
 * These are authentic character ROM data from various vintage computers.
 * Data is stored in JSON and imported here with type definitions.
 */

import { SerializedCharacterSet } from "./types";
import { binaryToBase64 } from "./binary";
import charsetData from "./builtinCharsets.json";

/**
 * Source character set data format with full metadata
 */
export interface ChargenSourceData {
  /** Unique identifier for the character set (used for database tracking) */
  id: string;
  /** Display name for the character set */
  name: string;
  /** Description of the character set */
  description: string;
  /** Source URL or attribution */
  source: string;
  /** Character width in pixels */
  width: number;
  /** Character height in pixels */
  height: number;
  /** Number of characters in the set */
  length: number;
  /** Hardware manufacturer (e.g., "Apple", "Commodore") */
  manufacturer: string;
  /** System name (e.g., "Apple II", "C64") */
  system: string;
  /** ROM chip identifier (e.g., "901225-01", "2513") */
  chip: string;
  /** Locale/language of the character set (e.g., "English", "German", "Japanese") */
  locale: string;
  /** Bit direction: "ltr" = MSB is leftmost pixel, "rtl" = LSB is leftmost pixel */
  bitDirection: "ltr" | "rtl";
  /** Padding direction: "left" = padding bits at start, "right" = padding bits at end (default: "right") */
  bitPadding?: "left" | "right";
  /** Raw character data - array of byte arrays per character */
  data: number[][];
}

/**
 * All built-in character sets loaded from JSON
 */
const builtinCharsets: ChargenSourceData[] = charsetData as ChargenSourceData[];

/**
 * Convert source chargen data to Uint8Array binary format
 * Each inner array in data represents one character's row bytes
 */
function chargenDataToBinary(data: number[][]): Uint8Array {
  // Calculate total bytes needed
  const totalBytes = data.reduce((sum, char) => sum + char.length, 0);
  const bytes = new Uint8Array(totalBytes);

  let offset = 0;
  for (const charData of data) {
    for (const byte of charData) {
      bytes[offset++] = byte;
    }
  }

  return bytes;
}

/**
 * Create a SerializedCharacterSet from source chargen data
 * Uses all metadata directly from the source data object including its id
 */
function createCharacterSetFromSource(
  source: ChargenSourceData
): SerializedCharacterSet {
  const now = Date.now();

  return {
    metadata: {
      id: source.id,
      name: source.name,
      description: source.description || `${source.system} character set`,
      source: source.source || "RetroStack",
      manufacturer: source.manufacturer,
      system: source.system,
      chip: source.chip,
      locale: source.locale,
      createdAt: now,
      updatedAt: now,
      isBuiltIn: true,
    },
    config: {
      width: source.width,
      height: source.height,
      padding: source.bitPadding ?? "right",
      bitDirection: source.bitDirection,
    },
    binaryData: binaryToBase64(chargenDataToBinary(source.data)),
  };
}

/**
 * Get all default character sets
 */
export function getDefaultCharacterSets(): SerializedCharacterSet[] {
  return builtinCharsets.map((source) => createCharacterSetFromSource(source));
}

/**
 * Get all built-in character set IDs
 */
export function getBuiltInIds(): string[] {
  return builtinCharsets.map((source) => source.id);
}

/**
 * Get a specific built-in character set by ID
 * Returns null if not found
 */
export function getBuiltInCharacterSetById(id: string): SerializedCharacterSet | null {
  const source = builtinCharsets.find((s) => s.id === id);
  if (!source) return null;
  return createCharacterSetFromSource(source);
}

/**
 * Check if a character set is a built-in default
 */
export function isBuiltInCharacterSet(id: string): boolean {
  return builtinCharsets.some((source) => source.id === id);
}
