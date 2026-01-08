/**
 * Character ROM Editor - Manufacturers and Systems Constants
 *
 * Central data source for all hardware manufacturers, systems, and their specifications.
 * Based on historical character generator ROM data from early 8-bit computers.
 *
 * All other data structures are derived from the unified SYSTEMS and ROM_CHIPS arrays.
 */

/**
 * Character ROM specifications for a system
 * Uses glyph dimensions (actual drawn pixels), not cell dimensions
 */
export interface CharacterRomSpec {
  /** Character width in pixels (glyph size) */
  width: number;
  /** Character height in pixels (glyph size) */
  height: number;
  /** Default number of characters in the ROM (per bank if multi-bank) */
  characterCount: number;
}

/**
 * Complete system information including optional hardware specifications.
 * This is the central data structure - extend it to add new system capabilities.
 */
export interface SystemInfo {
  /** System name (e.g., "C64", "ZX Spectrum") */
  system: string;
  /** Hardware manufacturer (e.g., "Commodore", "Sinclair") */
  manufacturer: string;
  /** Year the system was released */
  year?: number;
  /** Character ROM specifications (if the system has a character ROM) */
  characterRom?: CharacterRomSpec;
  /** ROM chip IDs used by this system (references ROM_CHIPS) */
  romChipIds?: string[];
  /** Notes about this system's character ROM implementation */
  notes?: string;
}

/**
 * Character ROM IC specifications
 */
export interface RomChipInfo {
  /** Unique identifier */
  id: string;
  /** Part number (e.g., "2513", "901225-01") */
  partNumber: string;
  /** Chip manufacturer */
  manufacturer: string;
  /** ROM type (e.g., "Mask ROM", "EPROM") */
  type: string;
  /** Glyph dimensions */
  glyph: {
    width: number;
    height: number;
  };
  /** Number of glyphs stored */
  glyphCount: number;
  /** Systems that use this ROM chip (references SYSTEMS) */
  usedIn: string[];
  /** Additional notes about this chip */
  notes?: string;
}

/**
 * Central data source for all systems and their specifications.
 * Based on historical character generator ROM data from late 1970s through mid-1980s.
 *
 * Systems with `characterRom` defined are shown in ROM preset dropdowns.
 * Character dimensions use glyph size (actual drawn pixels), not cell size.
 * Character counts use per-bank values for multi-bank systems.
 *
 * To add a new system:
 * 1. Add an entry to this array with the system name and manufacturer
 * 2. If it has a character ROM, add the `characterRom` spec with glyph dimensions
 * 3. Reference the ROM chip ID(s) used by the system
 * 4. All derived constants and dropdowns will update automatically
 */
export const SYSTEMS: SystemInfo[] = [
  // =========================================================================
  // Acorn
  // =========================================================================
  {
    system: "Acorn Atom",
    manufacturer: "Acorn",
    year: 1980,
    characterRom: { width: 5, height: 7, characterCount: 64 },
    romChipIds: ["mc6847"],
    notes: "64 ASCII characters from MC6847 internal ROM.",
  },
  {
    system: "BBC Micro",
    manufacturer: "Acorn",
    year: 1981,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["saa5050"],
    notes: "Modes 0-6 from OS ROM; Mode 7 Teletext uses SAA5050.",
  },

  // =========================================================================
  // Amstrad
  // =========================================================================
  {
    system: "Amstrad CPC 464",
    manufacturer: "Amstrad",
    year: 1984,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    notes: "Font stored in firmware ROM, software-rendered to screen RAM.",
  },

  // =========================================================================
  // Apple
  // =========================================================================
  {
    system: "Apple II",
    manufacturer: "Apple",
    year: 1977,
    characterRom: { width: 5, height: 7, characterCount: 64 },
    romChipIds: ["signetics-2513", "gi-ro-3-2513"],
    notes: "Uppercase letters, numbers, and symbols only.",
  },

  // =========================================================================
  // ASCII/Microsoft (MSX)
  // =========================================================================
  {
    system: "MSX",
    manufacturer: "ASCII/Microsoft",
    year: 1983,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["tms9918"],
    notes: "Font in Main-ROM copied to VRAM. Regional variants available.",
  },

  // =========================================================================
  // Atari
  // =========================================================================
  {
    system: "Atari 400",
    manufacturer: "Atari",
    year: 1979,
    characterRom: { width: 8, height: 8, characterCount: 128 },
    romChipIds: ["atari-os-rom"],
    notes: "Font stored within OS ROM. Allows redirection to RAM.",
  },
  {
    system: "Atari 800",
    manufacturer: "Atari",
    year: 1979,
    characterRom: { width: 8, height: 8, characterCount: 128 },
    romChipIds: ["atari-os-rom"],
    notes: "Identical font storage to Atari 400.",
  },

  // =========================================================================
  // Coleco
  // =========================================================================
  {
    system: "ColecoVision",
    manufacturer: "Coleco",
    year: 1982,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["colecovision-bios", "tms9918"],
    notes: "Font stored in 8KB BIOS ROM, uses TMS9928A VDP.",
  },

  // =========================================================================
  // Commodore
  // =========================================================================
  {
    system: "VIC-20",
    manufacturer: "Commodore",
    year: 1980,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["mos-901460-03"],
    notes: "Two character sets: Uppercase/Graphics and Upper/Lowercase.",
  },
  {
    system: "C64",
    manufacturer: "Commodore",
    year: 1982,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["mos-901225-01"],
    notes: "Two character sets: Uppercase/Graphics and Upper/Lowercase (PETSCII).",
  },
  {
    system: "PET 8032",
    manufacturer: "Commodore",
    year: 1980,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["mos-901447-10"],
    notes: "Business and Graphics character sets.",
  },

  // =========================================================================
  // Dragon Data
  // =========================================================================
  {
    system: "Dragon 32",
    manufacturer: "Dragon Data",
    year: 1982,
    characterRom: { width: 5, height: 7, characterCount: 64 },
    romChipIds: ["mc6847"],
    notes: "Similar to TRS-80 CoCo, uses MC6847 VDG.",
  },

  // =========================================================================
  // Mattel
  // =========================================================================
  {
    system: "Intellivision",
    manufacturer: "Mattel",
    year: 1979,
    characterRom: { width: 8, height: 8, characterCount: 213 },
    romChipIds: ["intellivision-grom"],
    notes: "GROM contains 213 predefined 8x8 images including alphanumerics.",
  },

  // =========================================================================
  // NEC
  // =========================================================================
  {
    system: "NEC PC-6001",
    manufacturer: "NEC",
    year: 1981,
    characterRom: { width: 5, height: 7, characterCount: 64 },
    romChipIds: ["mc6847"],
    notes: "Uses MC6847 VDG internal character set.",
  },

  // =========================================================================
  // Philips
  // =========================================================================
  {
    system: "Philips P2000",
    manufacturer: "Philips",
    year: 1980,
    characterRom: { width: 5, height: 9, characterCount: 96 },
    romChipIds: ["saa5050"],
    notes: "Teletext character set with block graphics.",
  },

  // =========================================================================
  // Sega
  // =========================================================================
  {
    system: "Sega SG-1000",
    manufacturer: "Sega",
    year: 1983,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["tms9918"],
    notes: "No built-in font; patterns loaded from cartridge into VDP RAM.",
  },
  {
    system: "Sega SC-3000",
    manufacturer: "Sega",
    year: 1983,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["tms9918"],
    notes: "Font provided by BASIC cartridge, includes katakana.",
  },

  // =========================================================================
  // Sinclair
  // =========================================================================
  {
    system: "ZX Spectrum",
    manufacturer: "Sinclair",
    year: 1982,
    characterRom: { width: 8, height: 8, characterCount: 96 },
    romChipIds: ["sinclair-spectrum-rom"],
    notes: "Printable ASCII (32-127). Font embedded in 16KB system ROM.",
  },

  // =========================================================================
  // Tandy
  // =========================================================================
  {
    system: "TRS-80 Model I",
    manufacturer: "Tandy",
    year: 1977,
    characterRom: { width: 5, height: 8, characterCount: 128 },
    romChipIds: ["mcm6673"],
    notes: "Uppercase only; lowercase via hardware modification.",
  },
  {
    system: "TRS-80 CoCo",
    manufacturer: "Tandy",
    year: 1980,
    characterRom: { width: 5, height: 7, characterCount: 64 },
    romChipIds: ["mc6847"],
    notes: "MC6847 VDG. Lowercase rendered as inverse uppercase.",
  },

  // =========================================================================
  // Texas Instruments
  // =========================================================================
  {
    system: "TI-99/4A",
    manufacturer: "Texas Instruments",
    year: 1981,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["tms9918"],
    notes: "User-definable patterns stored in VDP RAM, loaded from GROM.",
  },
];

/**
 * Character ROM IC chips used in early 8-bit computers and game consoles.
 * Each chip may be used in multiple systems.
 */
export const ROM_CHIPS: RomChipInfo[] = [
  // =========================================================================
  // Atari (embedded ROM)
  // =========================================================================
  {
    id: "atari-os-rom",
    partNumber: "Atari OS ROM",
    manufacturer: "Atari",
    type: "System ROM (embedded font)",
    glyph: { width: 8, height: 8 },
    glyphCount: 128,
    usedIn: ["Atari 400", "Atari 800"],
    notes: "Font in OS ROM; allows software redirection to RAM.",
  },

  // =========================================================================
  // Coleco
  // =========================================================================
  {
    id: "colecovision-bios",
    partNumber: "ColecoVision BIOS",
    manufacturer: "Coleco",
    type: "System BIOS (8KB)",
    glyph: { width: 8, height: 8 },
    glyphCount: 256,
    usedIn: ["ColecoVision"],
    notes: "Contains startup code, bitmap fonts, and utility routines.",
  },

  // =========================================================================
  // General Instrument
  // =========================================================================
  {
    id: "gi-ro-3-2513",
    partNumber: "RO-3-2513",
    manufacturer: "General Instrument",
    type: "Mask ROM",
    glyph: { width: 5, height: 7 },
    glyphCount: 64,
    usedIn: ["Apple II"],
    notes: "Pin-compatible with Signetics 2513, used in Apple II clones.",
  },
  {
    id: "intellivision-grom",
    partNumber: "GROM",
    manufacturer: "General Instrument",
    type: "Graphics ROM (part of STIC)",
    glyph: { width: 8, height: 8 },
    glyphCount: 213,
    usedIn: ["Intellivision"],
    notes: "Contains 213 predefined 8x8 images including alphanumerics.",
  },

  // =========================================================================
  // MOS Technology
  // =========================================================================
  {
    id: "mos-901225-01",
    partNumber: "901225-01",
    manufacturer: "MOS Technology",
    type: "Mask ROM (2332-type)",
    glyph: { width: 8, height: 8 },
    glyphCount: 256,
    usedIn: ["C64"],
    notes: "Commonly replaced via EPROM adapters for custom fonts.",
  },
  {
    id: "mos-901447-10",
    partNumber: "901447-10",
    manufacturer: "MOS Technology",
    type: "Mask ROM (2316-type)",
    glyph: { width: 8, height: 8 },
    glyphCount: 256,
    usedIn: ["PET 8032"],
    notes: "Reversed characters generated by hardware logic.",
  },
  {
    id: "mos-901460-03",
    partNumber: "901460-03",
    manufacturer: "MOS Technology",
    type: "Mask ROM (2332-type)",
    glyph: { width: 8, height: 8 },
    glyphCount: 256,
    usedIn: ["VIC-20"],
    notes: "4K×8 mask ROM; byte-wide organization.",
  },

  // =========================================================================
  // Motorola
  // =========================================================================
  {
    id: "mc6847",
    partNumber: "MC6847",
    manufacturer: "Motorola",
    type: "Video Display Generator (VDG)",
    glyph: { width: 5, height: 7 },
    glyphCount: 64,
    usedIn: ["TRS-80 CoCo", "Dragon 32", "Acorn Atom", "NEC PC-6001"],
    notes: "All-in-one VDG with internal 64-character ROM.",
  },
  {
    id: "mc6847t1",
    partNumber: "MC6847T1",
    manufacturer: "Motorola",
    type: "Video Display Generator (enhanced)",
    glyph: { width: 5, height: 7 },
    glyphCount: 96,
    usedIn: [],
    notes: "Enhanced version with 96 characters including lowercase.",
  },
  {
    id: "mcm6673",
    partNumber: "MCM6673",
    manufacturer: "Motorola",
    type: "Mask ROM (custom)",
    glyph: { width: 5, height: 8 },
    glyphCount: 128,
    usedIn: ["TRS-80 Model I"],
    notes: "Custom for Radio Shack. Outputs 5 bits per row.",
  },
  {
    id: "mcm6674",
    partNumber: "MCM6674",
    manufacturer: "Motorola",
    type: "Mask ROM",
    glyph: { width: 5, height: 8 },
    glyphCount: 128,
    usedIn: [],
    notes: "General-purpose character generator for terminals.",
  },

  // =========================================================================
  // Mullard/Philips
  // =========================================================================
  {
    id: "saa5050",
    partNumber: "SAA5050",
    manufacturer: "Mullard/Philips",
    type: "Teletext Character Generator",
    glyph: { width: 5, height: 9 },
    glyphCount: 96,
    usedIn: ["BBC Micro", "Philips P2000"],
    notes: "Teletext IC. Internal 5x9 font interpolated to 10x18.",
  },

  // =========================================================================
  // Signetics
  // =========================================================================
  {
    id: "signetics-2513",
    partNumber: "2513",
    manufacturer: "Signetics",
    type: "Mask ROM",
    glyph: { width: 5, height: 7 },
    glyphCount: 64,
    usedIn: ["Apple II"],
    notes: "One of the earliest character generator ROMs.",
  },

  // =========================================================================
  // Sinclair (embedded ROM)
  // =========================================================================
  {
    id: "sinclair-spectrum-rom",
    partNumber: "Spectrum ROM",
    manufacturer: "Sinclair",
    type: "System ROM (embedded font)",
    glyph: { width: 8, height: 8 },
    glyphCount: 96,
    usedIn: ["ZX Spectrum"],
    notes: "Font at end of 16KB ROM; 768 bytes for custom fonts.",
  },

  // =========================================================================
  // Texas Instruments
  // =========================================================================
  {
    id: "tms9918",
    partNumber: "TMS9918A",
    manufacturer: "Texas Instruments",
    type: "Video Display Processor (VDP)",
    glyph: { width: 8, height: 8 },
    glyphCount: 256,
    usedIn: ["TI-99/4A", "ColecoVision", "MSX", "Sega SG-1000", "Sega SC-3000"],
    notes: "No internal font; patterns stored in 16KB VRAM.",
  },
];

// ============================================================================
// Derived types (for backwards compatibility with existing components)
// ============================================================================

/**
 * Manufacturer and associated systems
 */
export interface ManufacturerSystems {
  /** Hardware manufacturer name */
  manufacturer: string;
  /** List of systems from this manufacturer */
  systems: string[];
}

/**
 * System-specific dimension preset (flattened for dropdown compatibility)
 */
export interface SystemDimensionPreset {
  /** System name */
  system: string;
  /** Hardware manufacturer */
  manufacturer: string;
  /** Character width in pixels */
  width: number;
  /** Character height in pixels */
  height: number;
}

/**
 * System-specific character count preset (flattened for dropdown compatibility)
 */
export interface SystemCharacterCountPreset {
  /** System name */
  system: string;
  /** Hardware manufacturer */
  manufacturer: string;
  /** Number of characters */
  count: number;
}

// ============================================================================
// Derived constants (computed from SYSTEMS)
// ============================================================================

/**
 * Known manufacturers and their systems (derived from SYSTEMS)
 */
export const KNOWN_MANUFACTURERS: ManufacturerSystems[] = (() => {
  const grouped = new Map<string, string[]>();
  for (const sys of SYSTEMS) {
    if (!grouped.has(sys.manufacturer)) {
      grouped.set(sys.manufacturer, []);
    }
    grouped.get(sys.manufacturer)!.push(sys.system);
  }
  return Array.from(grouped.entries()).map(([manufacturer, systems]) => ({
    manufacturer,
    systems,
  }));
})();

/**
 * Systems with character ROM specs (derived from SYSTEMS)
 */
const SYSTEMS_WITH_CHARACTER_ROM = SYSTEMS.filter(
  (sys): sys is SystemInfo & { characterRom: CharacterRomSpec } =>
    sys.characterRom !== undefined
);

/**
 * System dimension presets for dropdowns (derived from SYSTEMS with characterRom)
 */
export const SYSTEM_PRESETS: SystemDimensionPreset[] = SYSTEMS_WITH_CHARACTER_ROM.map(
  (sys) => ({
    system: sys.system,
    manufacturer: sys.manufacturer,
    width: sys.characterRom.width,
    height: sys.characterRom.height,
  })
);

/**
 * System character count presets for dropdowns (derived from SYSTEMS with characterRom)
 */
export const SYSTEM_CHARACTER_COUNT_PRESETS: SystemCharacterCountPreset[] =
  SYSTEMS_WITH_CHARACTER_ROM.map((sys) => ({
    system: sys.system,
    manufacturer: sys.manufacturer,
    count: sys.characterRom.characterCount,
  }));

// ============================================================================
// Standard format presets (not system-specific, for "Standard Formats" sections)
// ============================================================================

/**
 * Dimension presets based on common character ROM formats
 */
export interface DimensionPreset {
  /** Preset name */
  name: string;
  /** Character width in pixels */
  width: number;
  /** Character height in pixels */
  height: number;
  /** Systems that commonly use this format */
  systems: string[];
}

/**
 * Helper to get systems matching specific character ROM dimensions
 */
function getSystemsWithDimensions(width: number, height: number): string[] {
  return SYSTEMS_WITH_CHARACTER_ROM
    .filter((s) => s.characterRom.width === width && s.characterRom.height === height)
    .map((s) => s.system);
}

/**
 * Helper to get systems matching a specific character count
 */
function getSystemsWithCharacterCount(count: number): string[] {
  return SYSTEMS_WITH_CHARACTER_ROM
    .filter((s) => s.characterRom.characterCount === count)
    .map((s) => s.system);
}

/**
 * Standard dimension presets (format-based, shown in "Other Sizes" dropdown section)
 */
export const DIMENSION_PRESETS: DimensionPreset[] = [
  {
    name: "8x8 (Standard)",
    width: 8,
    height: 8,
    systems: getSystemsWithDimensions(8, 8),
  },
  {
    name: "5x7 (MC6847/2513)",
    width: 5,
    height: 7,
    systems: getSystemsWithDimensions(5, 7),
  },
  {
    name: "5x8 (TRS-80)",
    width: 5,
    height: 8,
    systems: getSystemsWithDimensions(5, 8),
  },
  {
    name: "5x9 (Teletext)",
    width: 5,
    height: 9,
    systems: getSystemsWithDimensions(5, 9),
  },
  {
    name: "8x16 (Extended)",
    width: 8,
    height: 16,
    systems: [],
  },
  {
    name: "8x14 (VGA Text)",
    width: 8,
    height: 14,
    systems: [],
  },
  {
    name: "6x8 (Custom)",
    width: 6,
    height: 8,
    systems: [],
  },
  {
    name: "16x16 (Icons)",
    width: 16,
    height: 16,
    systems: [],
  },
];

/**
 * Character count preset based on common ROM sizes
 */
export interface CharacterCountPreset {
  /** Preset name */
  name: string;
  /** Number of characters */
  count: number;
  /** Systems that commonly use this count */
  systems: string[];
}

/**
 * Standard character count presets (format-based, shown in "Other Counts" dropdown section)
 */
export const CHARACTER_COUNT_PRESETS: CharacterCountPreset[] = [
  {
    name: "64 (MC6847)",
    count: 64,
    systems: getSystemsWithCharacterCount(64),
  },
  {
    name: "96 (Teletext)",
    count: 96,
    systems: getSystemsWithCharacterCount(96),
  },
  {
    name: "128 (Atari)",
    count: 128,
    systems: getSystemsWithCharacterCount(128),
  },
  {
    name: "213 (Intellivision)",
    count: 213,
    systems: getSystemsWithCharacterCount(213),
  },
  {
    name: "256 (Standard)",
    count: 256,
    systems: getSystemsWithCharacterCount(256),
  },
  {
    name: "512 (Extended)",
    count: 512,
    systems: [],
  },
];

// ============================================================================
// Helper functions
// ============================================================================

/**
 * Get all unique manufacturer names
 */
export function getAllManufacturers(): string[] {
  return KNOWN_MANUFACTURERS.map((m) => m.manufacturer);
}

/**
 * Get systems for a specific manufacturer
 */
export function getSystemsForManufacturer(manufacturer: string): string[] {
  const found = KNOWN_MANUFACTURERS.find(
    (m) => m.manufacturer.toLowerCase() === manufacturer.toLowerCase()
  );
  return found?.systems || [];
}

/**
 * Get all unique systems across all manufacturers
 */
export function getAllSystems(): string[] {
  return SYSTEMS.map((s) => s.system).sort();
}

/**
 * Check if a manufacturer exists in the known list
 */
export function isKnownManufacturer(manufacturer: string): boolean {
  return KNOWN_MANUFACTURERS.some(
    (m) => m.manufacturer.toLowerCase() === manufacturer.toLowerCase()
  );
}

/**
 * Check if a system exists for a specific manufacturer
 */
export function isKnownSystem(manufacturer: string, system: string): boolean {
  const systems = getSystemsForManufacturer(manufacturer);
  return systems.some((s) => s.toLowerCase() === system.toLowerCase());
}

/**
 * Get dimension presets for a specific system
 */
export function getPresetsForSystem(system: string): DimensionPreset[] {
  return DIMENSION_PRESETS.filter((p) =>
    p.systems.some((s) => s.toLowerCase().includes(system.toLowerCase()))
  );
}

/**
 * Find a preset by dimensions
 */
export function findPresetByDimensions(
  width: number,
  height: number
): DimensionPreset | undefined {
  return DIMENSION_PRESETS.find((p) => p.width === width && p.height === height);
}

/**
 * Get system dimension presets grouped by manufacturer
 */
export function getSystemPresetsByManufacturer(): Record<string, SystemDimensionPreset[]> {
  const grouped: Record<string, SystemDimensionPreset[]> = {};
  for (const preset of SYSTEM_PRESETS) {
    if (!grouped[preset.manufacturer]) {
      grouped[preset.manufacturer] = [];
    }
    grouped[preset.manufacturer].push(preset);
  }
  return grouped;
}

/**
 * Get system character count presets grouped by manufacturer
 */
export function getSystemCharacterCountPresetsByManufacturer(): Record<string, SystemCharacterCountPreset[]> {
  const grouped: Record<string, SystemCharacterCountPreset[]> = {};
  for (const preset of SYSTEM_CHARACTER_COUNT_PRESETS) {
    if (!grouped[preset.manufacturer]) {
      grouped[preset.manufacturer] = [];
    }
    grouped[preset.manufacturer].push(preset);
  }
  return grouped;
}

/**
 * Get full system info by system name
 */
export function getSystemInfo(system: string): SystemInfo | undefined {
  return SYSTEMS.find((s) => s.system.toLowerCase() === system.toLowerCase());
}

/**
 * Get all systems that have character ROM specifications defined
 */
export function getSystemsWithRomPresets(): SystemInfo[] {
  return SYSTEMS_WITH_CHARACTER_ROM;
}

// ============================================================================
// ROM Chip Helper Types and Functions
// ============================================================================

/**
 * ROM chip dimension preset (for dropdown compatibility)
 */
export interface RomChipDimensionPreset {
  /** ROM chip ID */
  id: string;
  /** Part number */
  partNumber: string;
  /** Chip manufacturer */
  manufacturer: string;
  /** Character width in pixels */
  width: number;
  /** Character height in pixels */
  height: number;
  /** Systems that use this chip */
  usedIn: string[];
}

/**
 * ROM chip character count preset (for dropdown compatibility)
 */
export interface RomChipCharacterCountPreset {
  /** ROM chip ID */
  id: string;
  /** Part number */
  partNumber: string;
  /** Chip manufacturer */
  manufacturer: string;
  /** Number of glyphs */
  count: number;
  /** Systems that use this chip */
  usedIn: string[];
}

/**
 * ROM chip dimension presets for dropdowns (derived from ROM_CHIPS)
 */
export const ROM_CHIP_DIMENSION_PRESETS: RomChipDimensionPreset[] = ROM_CHIPS.map(
  (chip) => ({
    id: chip.id,
    partNumber: chip.partNumber,
    manufacturer: chip.manufacturer,
    width: chip.glyph.width,
    height: chip.glyph.height,
    usedIn: chip.usedIn,
  })
);

/**
 * ROM chip character count presets for dropdowns (derived from ROM_CHIPS)
 */
export const ROM_CHIP_CHARACTER_COUNT_PRESETS: RomChipCharacterCountPreset[] = ROM_CHIPS.map(
  (chip) => ({
    id: chip.id,
    partNumber: chip.partNumber,
    manufacturer: chip.manufacturer,
    count: chip.glyphCount,
    usedIn: chip.usedIn,
  })
);

/**
 * Get ROM chip dimension presets grouped by manufacturer
 */
export function getRomChipPresetsByManufacturer(): Record<string, RomChipDimensionPreset[]> {
  const grouped: Record<string, RomChipDimensionPreset[]> = {};
  for (const preset of ROM_CHIP_DIMENSION_PRESETS) {
    if (!grouped[preset.manufacturer]) {
      grouped[preset.manufacturer] = [];
    }
    grouped[preset.manufacturer].push(preset);
  }
  return grouped;
}

/**
 * Get ROM chip character count presets grouped by manufacturer
 */
export function getRomChipCharacterCountPresetsByManufacturer(): Record<string, RomChipCharacterCountPreset[]> {
  const grouped: Record<string, RomChipCharacterCountPreset[]> = {};
  for (const preset of ROM_CHIP_CHARACTER_COUNT_PRESETS) {
    if (!grouped[preset.manufacturer]) {
      grouped[preset.manufacturer] = [];
    }
    grouped[preset.manufacturer].push(preset);
  }
  return grouped;
}

/**
 * Get ROM chip info by ID
 */
export function getRomChipById(id: string): RomChipInfo | undefined {
  return ROM_CHIPS.find((chip) => chip.id === id);
}

/**
 * Get all ROM chips used by a specific system
 */
export function getRomChipsForSystem(system: string): RomChipInfo[] {
  return ROM_CHIPS.filter((chip) =>
    chip.usedIn.some((s) => s.toLowerCase() === system.toLowerCase())
  );
}

/**
 * Get all unique ROM chip manufacturers
 */
export function getAllRomChipManufacturers(): string[] {
  const manufacturers = new Set<string>();
  for (const chip of ROM_CHIPS) {
    manufacturers.add(chip.manufacturer);
  }
  return Array.from(manufacturers);
}
