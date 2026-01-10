/**
 * Character ROM Editor - Manufacturers and Systems Constants
 *
 * Central data source for all hardware manufacturers, systems, and their specifications.
 * Based on historical character generator ROM data from early 8-bit computers (1977-1991).
 *
 * All other data structures are derived from the unified MANUFACTURERS, SYSTEMS, and ROM_CHIPS arrays.
 */

// ============================================================================
// Manufacturer Types
// ============================================================================

/**
 * Hardware manufacturer information
 */
export interface ManufacturerInfo {
  /** Unique identifier (lowercase, hyphenated) */
  id: string;
  /** Full company name */
  name: string;
  /** Country of origin */
  country: string;
  /** Year the company was founded */
  founded?: number;
  /** Founder(s) of the company */
  founders?: string[];
  /** Company headquarters location */
  headquarters?: string;
  /** Main product lines */
  productLines?: string[];
  /** Additional notes about the company */
  notes?: string;
  /** Fun historical facts about the company */
  funFacts?: string[];
}

// ============================================================================
// System Types
// ============================================================================

/**
 * CPU specifications
 */
export interface CpuSpec {
  /** CPU chip name (e.g., "Zilog Z80A", "MOS 6502") */
  chip: string;
  /** Clock speed in MHz */
  speed: number;
  /** Effective speed if different from clock (due to contention, etc.) */
  effectiveSpeed?: number;
  /** CPU bit width (8 or 16) */
  bits?: number;
  /** Notes about the CPU */
  notes?: string;
}

/**
 * Memory specifications
 */
export interface MemorySpec {
  /** ROM size in KB */
  romKb?: number;
  /** ROM contents description */
  romContents?: string;
  /** RAM size in KB */
  ramKb?: number;
  /** RAM type (static, dynamic) */
  ramType?: string;
  /** Maximum expandable RAM in KB */
  expandableKb?: number;
  /** Whether RAM is bank-switched */
  bankSwitched?: boolean;
  /** Video RAM size in KB (if separate) */
  vramKb?: number;
}

/**
 * Text mode specification
 */
export interface TextModeSpec {
  /** Mode identifier (e.g., "mode0", "screen1") */
  id?: string;
  /** Number of columns */
  columns: number;
  /** Number of rows */
  rows: number;
  /** Number of colors available */
  colors?: number;
  /** Mode type (e.g., "teletext") */
  type?: string;
  /** Additional notes */
  notes?: string;
}

/**
 * Graphics mode specification
 */
export interface GraphicsModeSpec {
  /** Mode identifier */
  id?: string;
  /** Horizontal resolution in pixels */
  width: number;
  /** Vertical resolution in pixels */
  height: number;
  /** Number of colors */
  colors: number;
  /** Additional notes */
  notes?: string;
}

/**
 * Sprite capabilities
 */
export interface SpriteSpec {
  /** Number of hardware sprites */
  count: number;
  /** Available sprite sizes (e.g., ["8×8", "16×16"]) */
  sizes?: string[];
  /** Maximum sprites per scanline */
  maxPerLine?: number;
  /** Available sprite modes */
  modes?: string[];
  /** Additional notes */
  notes?: string;
}

/**
 * Display/video specifications
 */
export interface DisplaySpec {
  /** Output type (e.g., "rf_modulator", "composite", "rgb") */
  type?: string;
  /** Available text modes */
  textModes?: TextModeSpec[];
  /** Available graphics modes */
  graphicsModes?: GraphicsModeSpec[];
  /** Total colors in palette */
  paletteColors?: number;
  /** Simultaneous colors on screen */
  simultaneousColors?: number;
  /** Sprite capabilities */
  sprites?: SpriteSpec;
  /** Additional notes about display system */
  notes?: string;
}

/**
 * Character cell and glyph dimensions
 */
export interface CharacterDimensions {
  /** Cell dimensions (including spacing) */
  cell?: { width: number; height: number };
  /** Glyph dimensions (actual drawn pixels) */
  glyph: { width: number; height: number };
  /** Notes about character dimensions */
  notes?: string;
}

/**
 * Character set information
 */
export interface CharacterSetSpec {
  /** Number of glyphs in the set */
  glyphs: number;
  /** Number of character sets available */
  sets?: number;
  /** Whether uppercase is supported */
  uppercase?: boolean;
  /** Whether lowercase is supported */
  lowercase?: boolean;
  /** Whether inverse video is available */
  inverseVideo?: boolean;
  /** Total displayable characters (including inverse, etc.) */
  totalDisplayable?: number;
  /** Character encoding (e.g., "ASCII", "PETSCII") */
  encoding?: string;
  /** Whether user-defined graphics are supported */
  udg?: boolean;
  /** Method for UDG */
  udgMethod?: string;
  /** Regional/language variants available */
  variants?: string[];
  /** Additional notes */
  notes?: string;
}

/**
 * Character generator/ROM location info
 */
export interface CharacterGeneratorSpec {
  /** Location type (e.g., "system_rom", "dedicated_chip", "vram") */
  location: string;
  /** Memory address (hex) */
  address?: string;
  /** Size in bytes */
  sizeBytes?: number;
  /** Whether customizable via RAM */
  customizable?: boolean;
  /** Method for customization */
  customMethod?: string;
  /** Rendering method (e.g., "hardware", "software_to_bitmap") */
  rendering?: string;
  /** Additional notes */
  notes?: string;
}

/**
 * Video hardware specifications
 */
export interface VideoHardwareSpec {
  /** Main video chip(s) */
  chips?: string[];
  /** CRTC chip (if separate) */
  crtc?: string;
  /** VDP/VDG chip */
  vdp?: string;
  /** ULA chip */
  ula?: string;
  /** Additional notes */
  notes?: string;
}

/**
 * Price/MSRP information
 */
export interface PriceSpec {
  /** Base price */
  price?: number;
  /** Kit price (if available) */
  kit?: number;
  /** Assembled price (if different from kit) */
  assembled?: number;
  /** Currency code (e.g., "USD", "GBP") */
  currency: string;
  /** Price variants (e.g., different RAM configs) */
  variants?: Record<string, number>;
}

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
  /** Manufacturer ID (references MANUFACTURERS) */
  manufacturerId?: string;
  /** Alternate names for this system */
  alternateNames?: string[];
  /** Year the system was released */
  year?: number;
  /** Year production ended */
  endYear?: number;
  /** Original retail price */
  msrp?: PriceSpec;
  /** Units sold (if known) */
  unitsSold?: string;
  /** Form factor (e.g., "desktop", "portable", "console") */
  formFactor?: string;
  /** CPU specifications */
  cpu?: CpuSpec;
  /** Memory specifications */
  memory?: MemorySpec;
  /** Display/video capabilities */
  display?: DisplaySpec;
  /** Character dimensions (cell and glyph) */
  characterDimensions?: CharacterDimensions;
  /** Character set information */
  characterSets?: CharacterSetSpec;
  /** Character generator/ROM information */
  characterGenerator?: CharacterGeneratorSpec;
  /** Video hardware details */
  videoHardware?: VideoHardwareSpec;
  /** Character ROM specifications (if the system has a character ROM) - simplified for presets */
  characterRom?: CharacterRomSpec;
  /** ROM chip IDs used by this system (references ROM_CHIPS) */
  romChipIds?: string[];
  /** Storage type (e.g., "cassette", "floppy") */
  storage?: string;
  /** Notes about this system's character ROM implementation */
  notes?: string;
  /** Fun historical facts about the system */
  funFacts?: string[];
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
  /** ROM type (e.g., "Mask ROM", "EPROM", "VDG", "VDP") */
  type: string;
  /** Year the chip was introduced */
  year?: number;
  /** Chip capacity */
  capacity?: {
    bits?: number;
    bytes?: number;
    kb?: number;
  };
  /** Memory organization format (e.g., "64×8×5", "4K×8") */
  organization?: string;
  /** Glyph dimensions */
  glyph: {
    width: number;
    height: number;
  };
  /** Number of glyphs stored */
  glyphCount: number;
  /** Number of character sets stored */
  characterSetsStored?: number;
  /** Output format (e.g., "5-bit parallel", "8-bit parallel") */
  output?: string;
  /** Whether the chip has internal font ROM */
  internalFont?: boolean;
  /** Systems that use this ROM chip (references SYSTEMS) */
  usedIn: string[];
  /** Known variants of this chip */
  variants?: Record<string, string>;
  /** Successor chips */
  successors?: string[];
  /** Additional notes about this chip */
  notes?: string;
  /** Fun historical facts about the chip */
  funFacts?: string[];
}

/**
 * Hardware manufacturers data with comprehensive company information.
 */
export const MANUFACTURERS: ManufacturerInfo[] = [
  {
    id: "acorn",
    name: "Acorn Computers Ltd",
    country: "UK",
    founded: 1978,
    founders: ["Hermann Hauser", "Chris Curry"],
    headquarters: "Cambridge, England",
    productLines: ["Atom", "BBC Micro", "Electron", "Archimedes"],
    notes: "Later became ARM Holdings",
    funFacts: [
      "Acorn's ARM processor, developed for the Archimedes in 1985, now powers billions of devices including most smartphones",
      "Won the BBC Computer Literacy Project contract in 1981, beating Sinclair, which led to the iconic BBC Micro",
      "The company name 'Acorn' was chosen to appear before 'Apple' in phone directories",
    ],
  },
  {
    id: "amstrad",
    name: "Amstrad plc",
    country: "UK",
    founded: 1968,
    founders: ["Alan Sugar"],
    headquarters: "Brentwood, Essex",
    productLines: ["CPC series", "PCW", "PC compatibles"],
    funFacts: [
      "The name 'Amstrad' is a portmanteau of 'Alan Michael Sugar Trading'",
      "Acquired Sinclair Research in 1986 for £5 million, continuing the ZX Spectrum line",
      "The CPC was designed to be an all-in-one system with built-in monitor to avoid TV tuner compatibility issues",
    ],
  },
  {
    id: "apple",
    name: "Apple Computer Inc",
    country: "USA",
    founded: 1976,
    founders: ["Steve Jobs", "Steve Wozniak", "Ronald Wayne"],
    headquarters: "Cupertino, California",
    productLines: ["Apple II series", "Apple III", "Macintosh"],
    funFacts: [
      "The Apple II was one of the first mass-produced personal computers with color graphics",
      "Ronald Wayne sold his 10% stake in Apple for $800 in 1976; it would be worth over $300 billion today",
      "Steve Wozniak hand-built every Apple I circuit board, producing about 200 units",
    ],
  },
  {
    id: "ascii-microsoft",
    name: "MSX Consortium",
    country: "Japan/International",
    founded: 1983,
    founders: ["ASCII Corporation", "Microsoft"],
    productLines: ["MSX", "MSX2", "MSX2+", "MSX turboR"],
    notes: "Standard adopted by Sony, Panasonic, Philips, and others",
    funFacts: [
      "MSX stood for 'Machines with Software eXchangeability' according to official sources",
      "Popular games like Metal Gear and Bomberman originated on MSX systems",
      "Over 20 different manufacturers produced MSX-compatible computers",
    ],
  },
  {
    id: "atari",
    name: "Atari Inc / Atari Corporation",
    country: "USA",
    founded: 1972,
    founders: ["Nolan Bushnell", "Ted Dabney"],
    headquarters: "Sunnyvale, California",
    productLines: ["400/800", "XL series", "XE series", "ST"],
    funFacts: [
      "The name 'Atari' comes from a Japanese Go term meaning 'you are about to be engulfed'",
      "Steve Jobs worked at Atari before co-founding Apple, working on the game Breakout",
      "The Atari 2600 sold over 30 million units and popularized home video gaming",
    ],
  },
  {
    id: "coleco",
    name: "Coleco Industries",
    country: "USA",
    founded: 1932,
    headquarters: "West Hartford, Connecticut",
    productLines: ["ColecoVision", "Adam"],
    funFacts: [
      "The name 'Coleco' is short for 'Connecticut Leather Company' - they originally made leather goods",
      "ColecoVision was the first console to feature a licensed arcade port (Donkey Kong)",
      "Coleco later found success with Cabbage Patch Kids dolls in the 1980s",
    ],
  },
  {
    id: "commodore",
    name: "Commodore International",
    country: "USA",
    founded: 1954,
    founders: ["Jack Tramiel"],
    headquarters: "West Chester, Pennsylvania",
    productLines: ["PET", "VIC-20", "C64", "C128", "Plus/4", "Amiga"],
    notes: "Acquired MOS Technology in 1976",
    funFacts: [
      "Jack Tramiel's motto was 'Computers for the masses, not the classes'",
      "The Commodore 64 is the best-selling single computer model of all time with 17+ million units",
      "Commodore started as a typewriter repair company in the 1950s",
    ],
  },
  {
    id: "dragon-data",
    name: "Dragon Data Ltd",
    country: "UK (Wales)",
    founded: 1982,
    headquarters: "Port Talbot, Wales",
    productLines: ["Dragon 32", "Dragon 64"],
    funFacts: [
      "Dragon Data was the only home computer manufacturer based in Wales",
      "The Dragon 32/64 was partially compatible with the TRS-80 Color Computer due to similar hardware",
      "The Welsh Development Agency provided significant funding for Dragon Data",
    ],
  },
  {
    id: "mattel",
    name: "Mattel Electronics",
    country: "USA",
    founded: 1945,
    headquarters: "El Segundo, California",
    productLines: ["Intellivision", "Aquarius"],
    funFacts: [
      "Mattel is best known for Barbie and Hot Wheels, but their Intellivision was a major Atari 2600 competitor",
      "The Intellivision was the first 16-bit video game console",
      "Mattel's game division lost over $300 million before being closed in 1984",
    ],
  },
  {
    id: "nec",
    name: "NEC Corporation",
    country: "Japan",
    founded: 1899,
    headquarters: "Tokyo, Japan",
    productLines: ["PC-6001", "PC-8001", "PC-8801", "PC-9801"],
    funFacts: [
      "The PC-98 series dominated the Japanese PC market for over a decade with 90%+ market share",
      "NEC stands for 'Nippon Electric Company' and was founded as a telephone equipment manufacturer",
      "The TurboGrafx-16/PC Engine was jointly developed by NEC and Hudson Soft",
    ],
  },
  {
    id: "oric",
    name: "Oric Products International Ltd",
    country: "UK",
    founded: 1981,
    headquarters: "St Ives, Cambridgeshire",
    productLines: ["Oric-1", "Oric Atmos"],
    notes: "Originally Tangerine Computer Systems",
    funFacts: [
      "The Oric-1 was particularly popular in France where it outsold the ZX Spectrum",
      "Oric was spun off from Tangerine Computer Systems, which also made the Microtan 65",
      "The company name 'Oric' was intended to suggest 'Original' and 'Organic'",
    ],
  },
  {
    id: "philips",
    name: "Philips",
    country: "Netherlands",
    founded: 1891,
    headquarters: "Amsterdam, Netherlands",
    productLines: ["P2000", "MSX computers", "Videopac"],
    funFacts: [
      "Philips co-invented the CD format with Sony in 1982",
      "The Philips Videopac was sold as the Magnavox Odyssey² in North America",
      "Philips started as a light bulb manufacturer in Eindhoven in 1891",
    ],
  },
  {
    id: "sega",
    name: "Sega Enterprises",
    country: "Japan",
    founded: 1960,
    headquarters: "Tokyo, Japan",
    productLines: ["SG-1000", "SC-3000", "Master System", "Genesis/Mega Drive"],
    funFacts: [
      "The name 'SEGA' is a portmanteau of 'SErvice GAmes', an American company that made coin-operated machines",
      "The Mega Drive/Genesis was released in Japan on the same day as the Super Famicom was announced",
      "Sega started by making coin-operated amusement machines for American military bases in Japan",
    ],
  },
  {
    id: "sharp",
    name: "Sharp Corporation",
    country: "Japan",
    founded: 1912,
    headquarters: "Osaka, Japan",
    productLines: ["MZ series", "X1", "X68000"],
    funFacts: [
      "The company was named 'Sharp' after the Ever-Sharp mechanical pencil invented by founder Tokuji Hayakawa",
      "The X68000 was a popular platform for arcade game development and ports in Japan",
      "Sharp pioneered the 'clean computer' design philosophy with the MZ series, booting from tape/disk with no built-in BASIC",
    ],
  },
  {
    id: "sinclair",
    name: "Sinclair Research Ltd",
    country: "UK",
    founded: 1961,
    founders: ["Clive Sinclair"],
    headquarters: "Cambridge, England",
    productLines: ["ZX80", "ZX81", "ZX Spectrum", "QL"],
    funFacts: [
      "Clive Sinclair was knighted in 1983 for services to British industry",
      "The ZX Spectrum launched a generation of British game developers, many of whom founded major studios",
      "Sinclair also invented the C5 electric vehicle, which was a commercial failure but ahead of its time",
    ],
  },
  {
    id: "tandy",
    name: "Tandy Corporation / Radio Shack",
    country: "USA",
    founded: 1963,
    headquarters: "Fort Worth, Texas",
    productLines: ["TRS-80 Model I/III/4", "Color Computer", "Model 100"],
    funFacts: [
      "The TRS-80 Model I was nicknamed 'Trash-80' by enthusiasts, despite being a bestseller",
      "Radio Shack stores gave Tandy unparalleled retail distribution for personal computers",
      "The Model 100 was one of the first laptop computers and was popular with journalists",
    ],
  },
  {
    id: "texas-instruments",
    name: "Texas Instruments",
    country: "USA",
    founded: 1951,
    headquarters: "Dallas, Texas",
    productLines: ["TI-99/4", "TI-99/4A"],
    funFacts: [
      "TI invented the integrated circuit (microchip) in 1958, along with Fairchild Semiconductor",
      "The TI-99/4A was the first home computer with a 16-bit processor",
      "TI lost an estimated $500 million in the home computer price war before exiting in 1983",
    ],
  },
];

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
    manufacturerId: "acorn",
    year: 1980,
    endYear: 1983,
    msrp: { kit: 120, assembled: 170, currency: "GBP" },
    cpu: { chip: "MOS 6502", speed: 1 },
    memory: { romKb: 10, romContents: "Atom BASIC, Assembler", ramKb: 2, expandableKb: 12 },
    display: {
      type: "composite",
      textModes: [{ columns: 32, rows: 16 }],
      graphicsModes: [
        { width: 256, height: 192, colors: 2 },
        { width: 128, height: 192, colors: 4 },
      ],
    },
    characterDimensions: { cell: { width: 8, height: 12 }, glyph: { width: 5, height: 7 } },
    characterSets: { glyphs: 64, uppercase: true, lowercase: false, notes: "Same character set as MC6847" },
    characterGenerator: { location: "vdg_internal_rom", notes: "Uses Motorola MC6847 VDG with internal 64-character ROM" },
    videoHardware: { vdp: "MC6847" },
    characterRom: { width: 5, height: 7, characterCount: 64 },
    romChipIds: ["mc6847"],
    notes: "64 ASCII characters from MC6847 internal ROM.",
    funFacts: [
      "The Atom was Acorn's first mass-produced computer, available as a kit or assembled",
      "It was designed by Sophie Wilson (then Roger Wilson), who later co-designed the ARM processor",
    ],
  },
  {
    system: "BBC Micro Model B",
    manufacturer: "Acorn",
    manufacturerId: "acorn",
    alternateNames: ["BBC Model B", "Beeb"],
    year: 1981,
    endYear: 1986,
    msrp: { price: 399, currency: "GBP" },
    cpu: { chip: "MOS 6502A", speed: 2 },
    memory: { romKb: 32, romContents: "OS, BBC BASIC", ramKb: 32 },
    display: {
      type: "rgb_composite_rf",
      textModes: [
        { id: "mode0", columns: 80, rows: 32, colors: 2 },
        { id: "mode1", columns: 40, rows: 32, colors: 4 },
        { id: "mode2", columns: 20, rows: 32, colors: 16 },
        { id: "mode3", columns: 80, rows: 25, colors: 2, notes: "Gap between rows" },
        { id: "mode6", columns: 40, rows: 25, colors: 2 },
        { id: "mode7", columns: 40, rows: 25, colors: 16, type: "teletext" },
      ],
      graphicsModes: [
        { id: "mode4", width: 320, height: 256, colors: 2 },
        { id: "mode5", width: 160, height: 256, colors: 4 },
      ],
    },
    characterDimensions: { glyph: { width: 8, height: 8 }, notes: "Mode 7 uses 10×18 interpolated from 5×9" },
    characterSets: { glyphs: 224, uppercase: true, lowercase: true, udg: true, udgMethod: "VDU 23 command" },
    characterGenerator: { location: "os_rom", sizeBytes: 2048, rendering: "software_to_bitmap", notes: "Mode 7 uses SAA5050 teletext chip" },
    videoHardware: { crtc: "MC6845", chips: ["SAA5050", "Video ULA"], notes: "Dual video system: bitmap modes via Video ULA, teletext via SAA5050" },
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["saa5050"],
    notes: "224 chars in OS ROM (modes 0-6). Mode 7 Teletext uses SAA5050.",
    funFacts: [
      "The BBC Micro was part of the BBC Computer Literacy Project, reaching millions of British schoolchildren",
      "The iconic 'Welcome' message and owl logo were created by Bob Mayfield",
      "Mode 7 used a Teletext chip to display graphics, saving RAM for user programs",
    ],
  },
  {
    system: "Acorn Electron",
    manufacturer: "Acorn",
    manufacturerId: "acorn",
    year: 1983,
    msrp: { price: 199, currency: "GBP" },
    cpu: { chip: "MOS 6502A", speed: 2, effectiveSpeed: 1, notes: "Slow due to ULA contention" },
    memory: { romKb: 32, ramKb: 32 },
    display: { notes: "Similar to BBC Micro but NO Mode 7 teletext" },
    characterGenerator: { location: "os_rom", notes: "No SAA5050 teletext chip; all modes software-rendered" },
    videoHardware: { ula: "custom (combines functions)", notes: "No separate CRTC or teletext chip" },
    characterRom: { width: 8, height: 8, characterCount: 256 },
    notes: "Budget BBC Micro. No Mode 7 teletext (no SAA5050 chip).",
    funFacts: [
      "The Electron was nicknamed 'the poor man's BBC Micro' due to its lower price",
      "Production delays caused Acorn to miss the 1983 Christmas market, hurting sales",
    ],
  },
  {
    system: "BBC Master 128",
    manufacturer: "Acorn",
    manufacturerId: "acorn",
    year: 1986,
    cpu: { chip: "65C02", speed: 2 },
    memory: { romKb: 128, ramKb: 128 },
    display: { notes: "Same as BBC Model B" },
    characterGenerator: { location: "os_rom", notes: "Same as BBC Model B" },
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["saa5050"],
    notes: "Enhanced BBC Micro. 65C02 CPU, 128KB RAM. Same video as Model B.",
    funFacts: [
      "The Master was the last machine in the BBC Micro series before Acorn switched to ARM-based Archimedes",
      "It remained in UK schools well into the 1990s due to its educational software library",
    ],
  },

  // =========================================================================
  // Amstrad
  // =========================================================================
  {
    system: "Amstrad CPC 464",
    manufacturer: "Amstrad",
    manufacturerId: "amstrad",
    year: 1984,
    endYear: 1990,
    msrp: { variants: { greenScreen: 249, color: 359 }, currency: "GBP" },
    cpu: { chip: "Zilog Z80A", speed: 4, effectiveSpeed: 3.3, notes: "Contention with video" },
    memory: { romKb: 32, romContents: "BASIC, AMSDOS", ramKb: 64 },
    storage: "integrated_cassette",
    display: {
      type: "rgb_dedicated_monitor",
      textModes: [
        { id: "mode2", columns: 80, rows: 25, colors: 2 },
        { id: "mode1", columns: 40, rows: 25, colors: 4 },
        { id: "mode0", columns: 20, rows: 25, colors: 16 },
      ],
      graphicsModes: [
        { id: "mode2", width: 640, height: 200, colors: 2 },
        { id: "mode1", width: 320, height: 200, colors: 4 },
        { id: "mode0", width: 160, height: 200, colors: 16 },
      ],
      paletteColors: 27,
      simultaneousColors: 16,
    },
    characterDimensions: { glyph: { width: 8, height: 8 } },
    characterSets: { glyphs: 256, uppercase: true, lowercase: true, notes: "Includes block graphics, accented characters" },
    characterGenerator: { location: "lower_rom", rendering: "software_to_bitmap", notes: "No hardware text mode; characters drawn pixel-by-pixel to screen RAM" },
    videoHardware: { crtc: "MC6845", chips: ["Gate Array 40007/40008/40010"], notes: "Gate Array handles color palette, video mode selection, interrupts, memory banking" },
    characterRom: { width: 8, height: 8, characterCount: 256 },
    notes: "Integrated cassette. Font in ROM, software-rendered. No hardware text mode.",
    funFacts: [
      "The CPC 464 was the first computer to include a monitor in its standard package",
      "It used proprietary 3-inch floppy disks that were more expensive than standard formats",
      "Roland was the CPC's mascot, appearing in many Amstrad-published games",
    ],
  },
  {
    system: "Amstrad CPC 664",
    manufacturer: "Amstrad",
    manufacturerId: "amstrad",
    year: 1985,
    endYear: 1985,
    msrp: { variants: { greenScreen: 339, color: 449 }, currency: "GBP" },
    cpu: { chip: "Zilog Z80A", speed: 4 },
    memory: { ramKb: 64 },
    storage: "3_inch_floppy",
    display: { notes: "Same as CPC 464" },
    characterGenerator: { location: "lower_rom", notes: "Same as CPC 464" },
    videoHardware: { chips: ["Gate Array 40008"] },
    characterRom: { width: 8, height: 8, characterCount: 256 },
    notes: "3-inch floppy drive. Same video system as CPC 464.",
    funFacts: [
      "The CPC 664 was on the market for less than a year before being replaced by the 6128",
      "It is now one of the rarer CPC models due to its short production run",
    ],
  },
  {
    system: "Amstrad CPC 6128",
    manufacturer: "Amstrad",
    manufacturerId: "amstrad",
    year: 1985,
    endYear: 1990,
    msrp: { variants: { greenScreen: 299, color: 399 }, currency: "GBP" },
    cpu: { chip: "Zilog Z80A", speed: 4 },
    memory: { romKb: 48, romContents: "BASIC, AMSDOS, CP/M+", ramKb: 128, bankSwitched: true },
    storage: "3_inch_floppy",
    display: { notes: "Same as CPC 464" },
    characterGenerator: { location: "lower_rom", notes: "Same as CPC 464" },
    videoHardware: { chips: ["Gate Array 40010"] },
    characterRom: { width: 8, height: 8, characterCount: 256 },
    notes: "128KB RAM, 3-inch floppy. CP/M Plus compatible. Same video as CPC 464.",
    funFacts: [
      "The 6128 could run CP/M Plus, making it viable for business use",
      "It was the most popular CPC model for serious computing applications",
    ],
  },
  {
    system: "Amstrad CPC Plus",
    manufacturer: "Amstrad",
    manufacturerId: "amstrad",
    alternateNames: ["464 Plus", "6128 Plus"],
    year: 1990,
    endYear: 1992,
    display: {
      paletteColors: 4096,
      sprites: { count: 16, sizes: ["16×16"] },
      notes: "Hardware scrolling",
    },
    videoHardware: { chips: ["ASIC"], notes: "Enhanced ASIC replaces Gate Array with additional features" },
    characterRom: { width: 8, height: 8, characterCount: 256 },
    notes: "Enhanced ASIC. 4096-color palette, hardware sprites/scrolling.",
    funFacts: [
      "The Plus range was Amstrad's attempt to compete with 16-bit computers using enhanced 8-bit hardware",
      "It was launched alongside the GX4000 game console which was a commercial failure",
    ],
  },

  // =========================================================================
  // Apple
  // =========================================================================
  {
    system: "Apple II",
    manufacturer: "Apple",
    manufacturerId: "apple",
    year: 1977,
    endYear: 1979,
    msrp: { variants: { "4k": 1298, "48k": 2638 }, currency: "USD" },
    cpu: { chip: "MOS 6502", speed: 1.023 },
    memory: { romKb: 12, romContents: "Integer BASIC, Monitor", ramKb: 4, expandableKb: 48 },
    display: {
      type: "composite_ntsc",
      textModes: [{ columns: 40, rows: 24 }],
      graphicsModes: [
        { id: "lo-res", width: 40, height: 48, colors: 16 },
        { id: "hi-res", width: 280, height: 192, colors: 6 },
      ],
    },
    characterDimensions: { cell: { width: 7, height: 8 }, glyph: { width: 5, height: 7 } },
    characterSets: { glyphs: 64, uppercase: true, lowercase: false, notes: "Normal/inverse/flashing modes" },
    characterGenerator: { location: "dedicated_chip", notes: "Signetics 2513 or GI RO-3-2513 character generator ROM" },
    characterRom: { width: 5, height: 7, characterCount: 64 },
    romChipIds: ["signetics-2513", "gi-ro-3-2513"],
    notes: "Uppercase only. Integer BASIC. Normal/inverse/flashing modes.",
    funFacts: [
      "The Apple II was one of the first mass-produced personal computers with color graphics",
      "VisiCalc, the first spreadsheet program, was developed for the Apple II and drove business adoption",
      "Steve Wozniak designed the Apple II to use fewer chips than competitors, reducing cost",
    ],
  },
  {
    system: "Apple II Plus",
    manufacturer: "Apple",
    manufacturerId: "apple",
    year: 1979,
    endYear: 1982,
    msrp: { variants: { "48k": 1195 }, currency: "USD" },
    cpu: { chip: "MOS 6502", speed: 1.023 },
    memory: { romKb: 12, romContents: "Applesoft BASIC", ramKb: 48 },
    display: { notes: "Same as Apple II" },
    characterSets: { glyphs: 64, uppercase: true, lowercase: false },
    characterGenerator: { location: "dedicated_chip", notes: "Early: Signetics 2513. Late (Rev 7+): 2316B ROM" },
    characterRom: { width: 5, height: 7, characterCount: 64 },
    romChipIds: ["signetics-2513"],
    notes: "Applesoft BASIC in ROM. Same character set as Apple II.",
    funFacts: [
      "The Plus introduced Applesoft BASIC, a floating-point BASIC licensed from Microsoft",
      "It was the first Apple II model widely adopted in schools",
    ],
  },
  {
    system: "Apple IIe",
    manufacturer: "Apple",
    manufacturerId: "apple",
    year: 1983,
    endYear: 1993,
    msrp: { price: 1395, currency: "USD" },
    cpu: { chip: "MOS 6502", speed: 1.023 },
    memory: { romKb: 16, ramKb: 64, expandableKb: 128 },
    display: {
      textModes: [
        { columns: 40, rows: 24 },
        { columns: 80, rows: 24, notes: "With 80-column card" },
      ],
    },
    characterSets: { glyphs: 96, sets: 2, uppercase: true, lowercase: true, notes: "Alternate set has MouseText or international characters" },
    characterGenerator: { location: "dedicated_chip", notes: "2732 EPROM, dual character sets switchable" },
    characterRom: { width: 8, height: 8, characterCount: 96 },
    notes: "Full ASCII with lowercase. Optional 80-column card. MouseText available.",
    funFacts: [
      "The IIe was the longest-produced Apple II model, manufactured from 1983 to 1993",
      "It introduced MouseText, allowing pseudo-graphics for the mouse-driven desktop",
      "The 'e' in IIe stood for 'enhanced'",
    ],
  },
  {
    system: "Apple IIc",
    manufacturer: "Apple",
    manufacturerId: "apple",
    year: 1984,
    endYear: 1988,
    formFactor: "portable",
    msrp: { price: 1295, currency: "USD" },
    cpu: { chip: "65C02", speed: 1.023 },
    memory: { romKb: 16, ramKb: 128 },
    display: {
      textModes: [
        { columns: 40, rows: 24 },
        { columns: 80, rows: 24, notes: "Standard" },
      ],
    },
    characterSets: { glyphs: 256, notes: "Full character set with MouseText" },
    characterGenerator: { location: "dedicated_chip" },
    characterRom: { width: 8, height: 8, characterCount: 256 },
    notes: "Portable. 80-column standard. Full charset with MouseText.",
    funFacts: [
      "The IIc was Apple's first portable computer and was unveiled at an Apple event called 'Apple II Forever'",
      "The 'c' stood for 'compact', though it still weighed about 7.5 pounds",
    ],
  },
  {
    system: "Apple IIGS",
    manufacturer: "Apple",
    manufacturerId: "apple",
    year: 1986,
    endYear: 1992,
    cpu: { chip: "65C816", speed: 2.8, bits: 16 },
    memory: { romKb: 256, ramKb: 256, expandableKb: 8192 },
    display: {
      textModes: [
        { columns: 40, rows: 24 },
        { columns: 80, rows: 24 },
      ],
      graphicsModes: [
        { width: 320, height: 200, colors: 256 },
        { width: 640, height: 200, colors: 16 },
      ],
    },
    characterSets: { glyphs: 256, notes: "Multiple fonts in ROM, proportional fonts supported" },
    characterRom: { width: 8, height: 8, characterCount: 256 },
    notes: "65C816 CPU. 320×200 (256 colors) or 640×200 (16 colors).",
    funFacts: [
      "The GS stood for 'Graphics and Sound', highlighting its advanced multimedia capabilities",
      "It used the 65C816 CPU, the same processor later used in the Super Nintendo",
      "Steve Wozniak personally designed the Ensoniq sound chip",
    ],
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
    notes: "Font in Main-ROM copied to VRAM. Regional variants (Japanese, Arabic, etc.).",
    funFacts: [
      "MSX was huge in Japan, Brazil, and the Netherlands but never caught on in the US or UK",
      "Metal Gear by Hideo Kojima was originally developed for the MSX2",
      "Over 5 million MSX computers were sold worldwide",
    ],
  },
  {
    system: "MSX2",
    manufacturer: "ASCII/Microsoft",
    year: 1985,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    notes: "Yamaha V9938 VDP. 512×212 (16 colors) or 256×212 (256 colors).",
    funFacts: [
      "The MSX2 used the Yamaha V9938 VDP which could display 256 colors from a palette of 512",
      "It was the primary development platform for early Konami games like Castlevania and Gradius",
    ],
  },
  {
    system: "MSX2+",
    manufacturer: "ASCII/Microsoft",
    year: 1988,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    notes: "Yamaha V9958 VDP. 19268-color palette. Japan-only release.",
    funFacts: [
      "The MSX2+ was only officially released in Japan",
      "Its V9958 VDP added horizontal scrolling and an expanded color palette",
    ],
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
    notes: "ANTIC/GTIA display. 128 chars + inverse. Font in OS ROM, RAM redirect.",
    funFacts: [
      "The 400 was nicknamed the 'childproof' model due to its membrane keyboard",
      "It was designed with an FCC-compliant metal case to reduce radio interference",
    ],
  },
  {
    system: "Atari 800",
    manufacturer: "Atari",
    year: 1979,
    characterRom: { width: 8, height: 8, characterCount: 128 },
    romChipIds: ["atari-os-rom"],
    notes: "Expandable to 48KB. Same video as Atari 400.",
    funFacts: [
      "The Atari 800's custom chips (ANTIC, GTIA, POKEY) were years ahead of competitors",
      "It had four joystick ports, the most of any home computer of its era",
    ],
  },
  {
    system: "Atari 800XL",
    manufacturer: "Atari",
    year: 1983,
    characterRom: { width: 8, height: 8, characterCount: 128 },
    romChipIds: ["atari-os-rom"],
    notes: "64KB standard. Built-in BASIC. OS Rev 2. GTIA modes standard.",
    funFacts: [
      "The 800XL was the best-selling Atari 8-bit computer model",
      "It was designed under Jack Tramiel's 'cost-reduction' leadership after he joined Atari in 1984",
    ],
  },
  {
    system: "Atari 65XE",
    manufacturer: "Atari",
    year: 1985,
    characterRom: { width: 8, height: 8, characterCount: 128 },
    romChipIds: ["atari-os-rom"],
    notes: "Functionally equivalent to 800XL. Also sold as 800XE in Europe.",
    funFacts: [
      "The XE series featured a sleek gray design matching the Atari ST computers",
    ],
  },
  {
    system: "Atari 130XE",
    manufacturer: "Atari",
    year: 1985,
    characterRom: { width: 8, height: 8, characterCount: 128 },
    romChipIds: ["atari-os-rom"],
    notes: "128KB bank-switched RAM. OS Rev 3. Same video as XL series.",
    funFacts: [
      "The 130XE's expanded memory could be used for RAM disks or program storage",
    ],
  },
  {
    system: "Atari XEGS",
    manufacturer: "Atari",
    year: 1987,
    characterRom: { width: 8, height: 8, characterCount: 128 },
    romChipIds: ["atari-os-rom"],
    notes: "Game console variant of 65XE. Detachable keyboard optional.",
    funFacts: [
      "The XEGS was Atari's attempt to market their 8-bit computer as a game console",
      "It came bundled with a light gun and the game Bug Hunt",
    ],
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
    notes: "Game console. Font in 8KB BIOS ROM. TMS9928A VDP.",
    funFacts: [
      "ColecoVision sold over 6 million units and had the most accurate arcade ports of its time",
      "It came bundled with Donkey Kong, which helped drive initial sales",
    ],
  },
  {
    system: "Coleco Adam",
    manufacturer: "Coleco",
    year: 1983,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["tms9918"],
    notes: "ColecoVision-compatible computer. Digital data pack drives.",
    funFacts: [
      "The Adam used digital data pack tape drives that were faster than standard cassettes",
      "A design flaw caused the power supply to erase data packs when the computer was turned on",
    ],
  },

  // =========================================================================
  // Commodore
  // =========================================================================
  {
    system: "Commodore PET 2001",
    manufacturer: "Commodore",
    manufacturerId: "commodore",
    year: 1977,
    msrp: { price: 795, currency: "USD" },
    cpu: { chip: "MOS 6502", speed: 1 },
    memory: { romKb: 14, romContents: "BASIC 1.0", ramKb: 4, expandableKb: 32 },
    display: {
      type: "integrated_crt",
      textModes: [{ columns: 40, rows: 25 }],
      simultaneousColors: 1,
      notes: "9-inch CRT, no graphics mode",
    },
    characterDimensions: { glyph: { width: 8, height: 8 } },
    characterSets: { glyphs: 256, uppercase: true, lowercase: true, encoding: "PETSCII", notes: "First PETSCII character set" },
    characterGenerator: { location: "dedicated_chip", sizeBytes: 2048, notes: "MOS 6540-011" },
    characterRom: { width: 8, height: 8, characterCount: 256 },
    notes: "First Commodore computer. 9-inch CRT. PETSCII encoding. MOS 6540-011.",
    funFacts: [
      "The PET was the first all-in-one personal computer (keyboard, monitor, and tape drive integrated)",
      "PET stood for 'Personal Electronic Transactor' but was chosen partly because of the Pet Rock craze",
      "The chiclet keyboard of the original PET 2001 was widely criticized",
    ],
  },
  {
    system: "VIC-20",
    manufacturer: "Commodore",
    manufacturerId: "commodore",
    alternateNames: ["VC-20 (Germany)", "VIC-1001 (Japan)"],
    year: 1980,
    endYear: 1985,
    msrp: { price: 299.95, currency: "USD" },
    cpu: { chip: "MOS 6502", speed: 1.02, notes: "PAL: 1.10 MHz" },
    memory: { romKb: 20, romContents: "BASIC 2.0, KERNAL, Character ROM", ramKb: 5, ramType: "static", expandableKb: 32 },
    display: {
      type: "rf_modulator_composite",
      textModes: [{ columns: 22, rows: 23 }],
      graphicsModes: [{ width: 176, height: 184, colors: 2, notes: "Via character redefinition" }],
      simultaneousColors: 16,
    },
    characterDimensions: { cell: { width: 8, height: 16 }, glyph: { width: 8, height: 8 }, notes: "Double-height standard" },
    characterSets: { glyphs: 256, sets: 2, uppercase: true, lowercase: true, encoding: "PETSCII", notes: "Set 1: uppercase/graphics, Set 2: uppercase/lowercase" },
    characterGenerator: { location: "dedicated_chip", address: "8000-8FFF", customizable: true, customMethod: "Copy to RAM, point VIC register" },
    videoHardware: { chips: ["MOS 6560 (NTSC)", "MOS 6561 (PAL)"], notes: "VIC-I chip handles video and sound" },
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["mos-901460-03"],
    notes: "Two charsets: Upper/Graphics and Upper/Lowercase. VIC-I chip.",
    funFacts: [
      "The VIC-20 was the first computer to sell one million units",
      "William Shatner appeared in VIC-20 TV commercials",
      "VIC stood for 'Video Interface Chip', the system's custom graphics chip",
    ],
  },
  {
    system: "PET 8032",
    manufacturer: "Commodore",
    manufacturerId: "commodore",
    year: 1980,
    display: { textModes: [{ columns: 80, rows: 25 }] },
    characterSets: { glyphs: 256, encoding: "PETSCII", notes: "Business and Graphics charsets" },
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["mos-901447-10"],
    notes: "Business line. 80-column display. Business and Graphics charsets.",
    funFacts: [
      "The PET 8032 was used extensively in schools and small businesses",
      "Its 80-column display made it suitable for word processing and accounting",
    ],
  },
  {
    system: "C64",
    manufacturer: "Commodore",
    manufacturerId: "commodore",
    alternateNames: ["Commodore 64", "CBM 64", "Breadbin"],
    year: 1982,
    endYear: 1994,
    unitsSold: "17+ million",
    msrp: { price: 595, currency: "USD" },
    cpu: { chip: "MOS 6510", speed: 1.023, notes: "PAL: 0.985 MHz" },
    memory: { romKb: 20, romContents: "BASIC (8KB), KERNAL (8KB), Character ROM (4KB)", ramKb: 64 },
    display: {
      type: "composite_rf",
      textModes: [{ columns: 40, rows: 25 }],
      graphicsModes: [
        { id: "hires", width: 320, height: 200, colors: 2, notes: "Per 8×8 cell" },
        { id: "multicolor", width: 160, height: 200, colors: 4, notes: "Per 4×8 cell" },
      ],
      sprites: { count: 8, sizes: ["24×21"], modes: ["hires", "multicolor"] },
      simultaneousColors: 16,
    },
    characterDimensions: { glyph: { width: 8, height: 8 } },
    characterSets: { glyphs: 256, sets: 2, uppercase: true, lowercase: true, encoding: "PETSCII", udg: true, udgMethod: "Copy charset to RAM, set VIC-II register $D018", notes: "Set 1: uppercase/graphics at $D000, Set 2: uppercase/lowercase at $D800" },
    characterGenerator: { location: "dedicated_chip", address: "D000-DFFF (under I/O)", sizeBytes: 4096, notes: "Character ROM under I/O space; must be banked in to read" },
    videoHardware: { chips: ["MOS 6567 (NTSC)", "MOS 6569 (PAL)"], notes: "VIC-II: sprites, raster interrupts, smooth scrolling" },
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["mos-901225-01"],
    notes: "Best-selling 8-bit computer. VIC-II chip. Two PETSCII charsets.",
    funFacts: [
      "The C64 holds the Guinness World Record for best-selling single computer model at 17+ million units",
      "The SID sound chip was designed by Bob Yannes, who later founded Ensoniq",
      "The 'breadbin' nickname came from the original case design's shape",
    ],
  },
  {
    system: "Commodore Plus/4",
    manufacturer: "Commodore",
    manufacturerId: "commodore",
    year: 1984,
    endYear: 1985,
    msrp: { price: 299, currency: "USD" },
    cpu: { chip: "MOS 7501/8501", speed: 1.76 },
    memory: { romKb: 64, romContents: "BASIC 3.5, built-in software", ramKb: 64 },
    display: {
      textModes: [{ columns: 40, rows: 25 }],
      graphicsModes: [
        { width: 320, height: 200, colors: 2 },
        { width: 160, height: 200, colors: 4 },
      ],
      simultaneousColors: 128,
      notes: "TED chip provides 121 colors",
    },
    characterSets: { glyphs: 256, encoding: "PETSCII", notes: "Similar to C64" },
    videoHardware: { chips: ["MOS 7360/8360 (TED)"], notes: "TED combines video, sound, and system functions; no sprites" },
    characterRom: { width: 8, height: 8, characterCount: 256 },
    notes: "TED chip (121 colors). No sprites. Built-in software suite.",
    funFacts: [
      "The Plus/4 came with four built-in applications: word processor, spreadsheet, database, and graphing",
      "It was not compatible with C64 software, limiting its appeal despite superior BASIC",
    ],
  },
  {
    system: "Commodore 128",
    manufacturer: "Commodore",
    manufacturerId: "commodore",
    year: 1985,
    endYear: 1989,
    msrp: { price: 299, currency: "USD" },
    cpu: { chip: "MOS 8502 + Zilog Z80", speed: 2, notes: "8502 for C128/C64 mode, Z80 for CP/M" },
    memory: { romKb: 72, ramKb: 128 },
    display: {
      textModes: [
        { columns: 40, rows: 25, notes: "VIC-II" },
        { columns: 80, rows: 25, notes: "VDC" },
      ],
      graphicsModes: [{ width: 640, height: 200, colors: 16, notes: "VDC 80-column chip" }],
      notes: "Dual display: VIC-II (40-col) + VDC (80-col RGBI)",
    },
    characterSets: { glyphs: 512, notes: "VDC patterns copied from VIC-II ROM to VDC RAM at boot" },
    videoHardware: { chips: ["VIC-II (8564/8566)", "VDC (MOS 8563)"], notes: "VDC has no character ROM; patterns loaded from VIC-II character ROM" },
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["mos-901225-01"],
    notes: "Dual CPU (8502+Z80). VIC-II (40-col) + VDC (80-col). C64 compatible.",
    funFacts: [
      "The C128 had three operating modes: C128 native, C64 compatible, and CP/M",
      "Bil Herd led the design team and created the machine in under a year",
    ],
  },
  {
    system: "Commodore 64C",
    manufacturer: "Commodore",
    manufacturerId: "commodore",
    year: 1986,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["mos-901225-01"],
    notes: "Restyled C64. HMOS chips (8580 SID, 8562/8565 VIC-II).",
    funFacts: [
      "The 64C was a cost-reduced C64 in a new case matching the C128's styling",
      "It used the improved 8580 SID chip which had slightly different sound characteristics",
    ],
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
    notes: "Welsh computer. MC6847 VDG. Partially CoCo compatible.",
    funFacts: [
      "The Dragon 32 was the first home computer manufactured in Wales",
      "It was partially compatible with TRS-80 Color Computer software due to similar hardware",
    ],
  },
  {
    system: "Dragon 64",
    manufacturer: "Dragon Data",
    year: 1983,
    characterRom: { width: 5, height: 7, characterCount: 64 },
    romChipIds: ["mc6847"],
    notes: "64KB RAM. Same video system as Dragon 32.",
    funFacts: [
      "The Dragon 64 added RS-232 serial port and more RAM over the Dragon 32",
    ],
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
    notes: "Game console. GROM (213 cards) + GRAM (64 user-definable).",
    funFacts: [
      "Intellivision's advertising directly attacked Atari 2600's graphics quality",
      "It featured synthesized speech via the Intellivoice add-on, a first for home consoles",
    ],
  },
  {
    system: "Mattel Aquarius",
    manufacturer: "Mattel",
    year: 1983,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    notes: "Short-lived computer. Microsoft BASIC. Limited graphics.",
    funFacts: [
      "Mattel's own marketing team internally called the Aquarius 'the system for the 1970s'",
      "It was discontinued just 4 months after its US release due to poor reception",
    ],
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
    notes: "Uses MC6847 VDG. NEC Trek in USA.",
    funFacts: [
      "The PC-6001 was sold as 'NEC Trek' in North America",
      "It was one of the first Japanese home computers to gain popularity outside Japan",
    ],
  },
  {
    system: "NEC PC-8001",
    manufacturer: "NEC",
    year: 1979,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    notes: "Early Japanese PC. 80-column. JIS charset with Katakana. μPD3301 CRTC.",
    funFacts: [
      "The PC-8001 was one of Japan's first commercially successful personal computers",
      "Microsoft Japan was founded partly to provide BASIC for NEC computers",
    ],
  },

  // =========================================================================
  // Oric
  // =========================================================================
  {
    system: "Oric-1",
    manufacturer: "Oric",
    year: 1983,
    characterRom: { width: 6, height: 8, characterCount: 96 },
    notes: "6502-based. 240×200 graphics. Custom ULA. No hardware text mode.",
    funFacts: [
      "The Oric-1 was particularly popular in France where it outsold many UK competitors",
      "Its unique attribute-based color system was similar to the ZX Spectrum but with different limitations",
    ],
  },
  {
    system: "Oric Atmos",
    manufacturer: "Oric",
    year: 1984,
    characterRom: { width: 6, height: 8, characterCount: 96 },
    notes: "Improved keyboard and ROM (BASIC 1.1). Same video as Oric-1.",
    funFacts: [
      "The Atmos fixed the Oric-1's widely criticized keyboard with a proper mechanical one",
    ],
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
    funFacts: [
      "The P2000 used the same Teletext chip as the BBC Micro for its display",
      "It was popular in Dutch schools and offices",
    ],
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
    notes: "Japan-only console. No built-in font; patterns from cartridge.",
    funFacts: [
      "The SG-1000 was released on the same day as the Nintendo Famicom in Japan",
      "It was Sega's first home console and laid the groundwork for the Master System",
    ],
  },
  {
    system: "Sega SC-3000",
    manufacturer: "Sega",
    year: 1983,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["tms9918"],
    notes: "Computer version of SG-1000. Font from BASIC cartridge.",
    funFacts: [
      "The SC-3000 was a home computer version of the SG-1000 with a keyboard",
      "It was one of the few Sega products designed primarily for the home computer market",
    ],
  },
  {
    system: "Sega Master System",
    manufacturer: "Sega",
    year: 1985,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    notes: "Enhanced TMS9918-derived VDP (315-5124). 64-color palette.",
    funFacts: [
      "The Master System was more popular than the NES in Europe and Brazil",
      "It remained in production in Brazil until 2021, making it one of the longest-produced consoles",
    ],
  },

  // =========================================================================
  // Sinclair
  // =========================================================================
  {
    system: "Sinclair ZX80",
    manufacturer: "Sinclair",
    manufacturerId: "sinclair",
    year: 1980,
    endYear: 1981,
    msrp: { kit: 79.95, assembled: 99.95, currency: "GBP" },
    cpu: { chip: "Zilog Z80A", speed: 3.25 },
    memory: { romKb: 4, romContents: "Integer BASIC", ramKb: 1, ramType: "static", expandableKb: 16 },
    display: {
      type: "rf_modulator",
      textModes: [{ columns: 32, rows: 24 }],
      notes: "Display blanks while program runs (no NMI generator)",
    },
    characterDimensions: { cell: { width: 8, height: 8 }, glyph: { width: 7, height: 6 }, notes: "1 pixel horizontal spacing" },
    characterSets: { glyphs: 64, inverseVideo: true, totalDisplayable: 128, uppercase: true, lowercase: false, encoding: "non-ASCII (Sinclair-specific)" },
    characterGenerator: { location: "system_rom", address: "0E00-0FFF", sizeBytes: 512, notes: "Font embedded in 4KB ROM" },
    videoHardware: { notes: "Z80 generates video sync pulses directly; no dedicated video chip" },
    characterRom: { width: 7, height: 6, characterCount: 64 },
    notes: "First Sinclair computer. 64 chars with inverse. Font in 4KB ROM.",
    funFacts: [
      "The ZX80 was the first computer available in the UK for under £100",
      "Its display would blank during program execution because the CPU was used to generate video",
    ],
  },
  {
    system: "Sinclair ZX81",
    manufacturer: "Sinclair",
    manufacturerId: "sinclair",
    alternateNames: ["Timex Sinclair 1000 (USA)", "TS1500"],
    year: 1981,
    endYear: 1984,
    msrp: { kit: 49.95, assembled: 69.95, currency: "GBP" },
    cpu: { chip: "Zilog Z80A", speed: 3.25 },
    memory: { romKb: 8, romContents: "Floating-point BASIC", ramKb: 1, ramType: "static", expandableKb: 64 },
    display: {
      type: "rf_modulator",
      textModes: [{ columns: 32, rows: 24 }],
      notes: "NMI generator allows display during program execution (SLOW mode)",
    },
    characterDimensions: { cell: { width: 8, height: 8 }, glyph: { width: 6, height: 6 }, notes: "2 pixel horizontal/vertical spacing" },
    characterSets: { glyphs: 64, inverseVideo: true, totalDisplayable: 128, uppercase: true, lowercase: false, encoding: "non-ASCII (Sinclair-specific, different from ZX80)" },
    characterGenerator: { location: "system_rom", address: "1E00-1FFF", sizeBytes: 512, notes: "Cannot easily use RAM for custom characters" },
    videoHardware: { ula: "Ferranti ULA", notes: "NMI generator in ULA allows SLOW mode display" },
    characterRom: { width: 6, height: 6, characterCount: 64 },
    notes: "64 chars with inverse (128 displayable). Timex Sinclair 1000 in USA.",
    funFacts: [
      "The ZX81 sold over 1.5 million units worldwide and launched many programming careers",
      "It used a Ferranti ULA that combined many discrete components into one chip",
      "The 16K RAM pack was notorious for causing crashes if bumped",
    ],
  },
  {
    system: "ZX Spectrum",
    manufacturer: "Sinclair",
    manufacturerId: "sinclair",
    alternateNames: ["ZX Spectrum 48K", "Timex Sinclair 2068 (USA variant)"],
    year: 1982,
    endYear: 1992,
    msrp: { variants: { "16k": 125, "48k": 175 }, currency: "GBP" },
    cpu: { chip: "Zilog Z80A", speed: 3.5 },
    memory: { romKb: 16, romContents: "48 BASIC", ramKb: 48 },
    display: {
      type: "rf_modulator_composite",
      textModes: [{ columns: 32, rows: 24, notes: "Software-rendered" }],
      graphicsModes: [{ width: 256, height: 192, colors: 15 }],
      simultaneousColors: 15,
      notes: "Attribute-based color (8×8 cells), separate border color",
    },
    characterDimensions: { glyph: { width: 8, height: 8 } },
    characterSets: { glyphs: 96, uppercase: true, lowercase: true, udg: true, udgMethod: "21 User Defined Graphics (A-U)", notes: "ASCII 32-127" },
    characterGenerator: { location: "system_rom", address: "3D00-3FFF", sizeBytes: 768, rendering: "software", notes: "No hardware text mode; font copied to RAM for printing" },
    videoHardware: { ula: "Ferranti ULA", notes: "Bitmap-only display; text rendered in software" },
    characterRom: { width: 8, height: 8, characterCount: 96 },
    romChipIds: ["sinclair-spectrum-rom"],
    notes: "96 ASCII chars + 21 UDG. Font in 16KB ROM. Bitmap display.",
    funFacts: [
      "The Spectrum is credited with launching the UK video game industry",
      "Over 24,000 software titles were released for the Spectrum",
      "Its distinctive rubber keys were called 'dead flesh' by users",
    ],
  },
  {
    system: "ZX Spectrum 128",
    manufacturer: "Sinclair",
    manufacturerId: "sinclair",
    year: 1986,
    cpu: { chip: "Zilog Z80A", speed: 3.5469 },
    memory: { romKb: 32, ramKb: 128, bankSwitched: true },
    display: { notes: "Same as 48K Spectrum" },
    characterSets: { glyphs: 96, notes: "Same as 48K but with additional fonts in extended ROM" },
    characterRom: { width: 8, height: 8, characterCount: 96 },
    romChipIds: ["sinclair-spectrum-rom"],
    notes: "128KB RAM, AY-3-8912 sound chip. Same display system as 48K.",
    funFacts: [
      "The 128K was developed in collaboration with Investrónica in Spain",
      "It added the AY-3-8912 sound chip, bringing 3-channel music to the Spectrum",
    ],
  },
  {
    system: "ZX Spectrum +2",
    manufacturer: "Sinclair",
    manufacturerId: "sinclair",
    alternateNames: ["Amstrad ZX Spectrum +2"],
    year: 1986,
    characterRom: { width: 8, height: 8, characterCount: 96 },
    notes: "Amstrad-manufactured after Sinclair acquisition. Integrated tape deck. Same video as Spectrum.",
    funFacts: [
      "The +2 was the first Spectrum manufactured by Amstrad after they acquired Sinclair in 1986",
    ],
  },
  {
    system: "ZX Spectrum +3",
    manufacturer: "Sinclair",
    manufacturerId: "sinclair",
    year: 1987,
    characterRom: { width: 8, height: 8, characterCount: 96 },
    notes: "3-inch floppy drive, CP/M compatible. Same video as Spectrum.",
    funFacts: [
      "The +3 was the last official ZX Spectrum model and could run CP/M",
    ],
  },

  // =========================================================================
  // Tandy - Model I/III/4 Line
  // =========================================================================
  {
    system: "TRS-80 Model I",
    manufacturer: "Tandy",
    year: 1977,
    characterRom: { width: 5, height: 7, characterCount: 128 },
    romChipIds: ["mcm6673"],
    notes: "Uppercase only stock; lowercase requires hardware mod (160 chars with mod).",
    funFacts: [
      "The TRS-80 Model I was one of the first mass-market home computers (along with Apple II and PET)",
      "It was nicknamed 'Trash-80' by enthusiasts, though it sold over 200,000 units",
    ],
  },
  {
    system: "TRS-80 Model III",
    manufacturer: "Tandy",
    year: 1980,
    characterRom: { width: 5, height: 8, characterCount: 192 },
    notes: "All-in-one with standard lowercase. 64 upper + 32 lower + 64 graphics + 32 special.",
    funFacts: [
      "The Model III was an FCC-compliant redesign after the Model I was found to cause radio interference",
    ],
  },
  {
    system: "TRS-80 Model 4",
    manufacturer: "Tandy",
    year: 1983,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    notes: "Native 80×24 mode. 96 text + 64 graphics + 96 special. Supports reverse video.",
    funFacts: [
      "The Model 4 was the last in the Model I/III line and could run CP/M",
    ],
  },
  {
    system: "TRS-80 Model 4P",
    manufacturer: "Tandy",
    year: 1983,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    notes: "Portable Model 4. 9-inch display. No BASIC in ROM (loaded from disk).",
    funFacts: [
      "The Model 4P was a portable version weighing about 26 pounds",
    ],
  },
  {
    system: "TRS-80 Model 4D",
    manufacturer: "Tandy",
    year: 1985,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    notes: "Last TRS-80 branded computer. Gate array version with green phosphor.",
    funFacts: [
      "The Model 4D was the final computer to carry the TRS-80 name",
    ],
  },

  // =========================================================================
  // Tandy - Model II Business Line
  // =========================================================================
  {
    system: "TRS-80 Model II",
    manufacturer: "Tandy",
    year: 1979,
    characterRom: { width: 8, height: 10, characterCount: 128 },
    notes: "Business line with 8-inch floppies. 64 upper + 32 lower + 32 line-drawing graphics.",
    funFacts: [
      "The Model II was designed for business use and used 8-inch floppy disks",
    ],
  },
  {
    system: "TRS-80 Model 12",
    manufacturer: "Tandy",
    year: 1982,
    characterRom: { width: 8, height: 10, characterCount: 128 },
    notes: "Improved Model II. Single-board design, green phosphor, double-sided drives.",
    funFacts: [
      "The Model 12 was an improved Model II with a single-board design",
    ],
  },
  {
    system: "TRS-80 Model 16",
    manufacturer: "Tandy",
    year: 1982,
    characterRom: { width: 8, height: 10, characterCount: 128 },
    notes: "Dual Z80/MC68000 processor. Runs TRSDOS-16 and TRS-XENIX.",
    funFacts: [
      "The Model 16 was a dual-processor system that could run XENIX, Microsoft's version of Unix",
    ],
  },
  {
    system: "TRS-80 Model 16B",
    manufacturer: "Tandy",
    year: 1983,
    characterRom: { width: 8, height: 10, characterCount: 128 },
    notes: "Refined Model 16. Top-selling Unix computer in 1984.",
    funFacts: [
      "The Model 16B was the top-selling Unix computer in 1984",
    ],
  },
  {
    system: "Tandy 6000",
    manufacturer: "Tandy",
    year: 1984,
    characterRom: { width: 8, height: 10, characterCount: 128 },
    notes: "Final Model II evolution. MC68000 at 8 MHz, up to 1 MB RAM.",
    funFacts: [
      "The Tandy 6000 was the final evolution of the Model II business line",
    ],
  },

  // =========================================================================
  // Tandy - Color Computer Line
  // =========================================================================
  {
    system: "TRS-80 Color Computer",
    manufacturer: "Tandy",
    year: 1980,
    characterRom: { width: 5, height: 7, characterCount: 64 },
    romChipIds: ["mc6847"],
    notes: "CoCo 1. MC6847 VDG. Lowercase displayed as inverse uppercase.",
    funFacts: [
      "The Color Computer was affectionately known as the 'CoCo' by enthusiasts",
      "It was designed to compete with the Apple II and Commodore computers at a lower price",
    ],
  },
  {
    system: "TRS-80 Color Computer 2",
    manufacturer: "Tandy",
    year: 1983,
    characterRom: { width: 5, height: 7, characterCount: 64 },
    romChipIds: ["mc6847"],
    notes: "Early: MC6847 (64 chars). Late: MC6847T1 (96 chars with lowercase).",
    funFacts: [
      "Later CoCo 2 models used the MC6847T1 which added true lowercase letters",
    ],
  },
  {
    system: "Tandy Color Computer 3",
    manufacturer: "Tandy",
    year: 1986,
    characterRom: { width: 8, height: 8, characterCount: 256 },
    romChipIds: ["gime"],
    notes: "GIME chip. 40/80 column modes, 64-color palette, software-definable fonts.",
    funFacts: [
      "The CoCo 3 featured the GIME chip which dramatically improved graphics capabilities",
      "It was the only CoCo model with 80-column text mode",
    ],
  },

  // =========================================================================
  // Tandy - Pocket/Portable Line
  // =========================================================================
  {
    system: "TRS-80 MC-10",
    manufacturer: "Tandy",
    year: 1983,
    characterRom: { width: 5, height: 7, characterCount: 64 },
    romChipIds: ["mc6847"],
    notes: "Entry-level. MC6847 VDG. Not compatible with CoCo.",
    funFacts: [
      "The MC-10 was Tandy's entry-level computer, competing with the Timex Sinclair 1000",
    ],
  },
  {
    system: "TRS-80 Model 100",
    manufacturer: "Tandy",
    year: 1983,
    characterRom: { width: 5, height: 7, characterCount: 256 },
    notes: "Early laptop. 40×8 LCD display. Intel 80C85 CPU. ROM reportedly co-written by Bill Gates.",
    funFacts: [
      "The Model 100's ROM was reportedly the last code Bill Gates personally wrote for Microsoft",
      "It was extremely popular with journalists due to its portability and built-in modem",
    ],
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
    funFacts: [
      "The TI-99/4A was the first home computer with a 16-bit processor",
      "TI lost money on every unit sold during the price war with Commodore",
    ],
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
    year: 1979,
    capacity: { bytes: 1024 },
    organization: "128×8×8",
    glyph: { width: 8, height: 8 },
    glyphCount: 128,
    internalFont: true,
    usedIn: [
      "Atari 400",
      "Atari 800",
      "Atari 800XL",
      "Atari 65XE",
      "Atari 130XE",
      "Atari XEGS",
    ],
    notes: "Font in OS ROM at $E000-$E3FF; allows software redirection to RAM via CHBAS ($2F4).",
    funFacts: [
      "The Atari font was designed to be clean and readable on low-resolution displays",
    ],
  },

  // =========================================================================
  // Coleco
  // =========================================================================
  {
    id: "colecovision-bios",
    partNumber: "ColecoVision BIOS",
    manufacturer: "Coleco",
    type: "System BIOS (8KB)",
    year: 1982,
    capacity: { kb: 8 },
    glyph: { width: 8, height: 8 },
    glyphCount: 256,
    usedIn: ["ColecoVision"],
    notes: "Contains startup code, bitmap fonts, and utility routines.",
    funFacts: [
      "The BIOS contained one of the earliest arcade-quality font sets for home consoles",
    ],
  },

  // =========================================================================
  // General Instrument
  // =========================================================================
  {
    id: "gi-ro-3-2513",
    partNumber: "RO-3-2513",
    manufacturer: "General Instrument",
    type: "Mask ROM",
    capacity: { bits: 2560 },
    organization: "64×8×5",
    output: "5-bit parallel",
    glyph: { width: 5, height: 7 },
    glyphCount: 64,
    usedIn: ["Apple II"],
    notes: "Pin-compatible with Signetics 2513, used in Apple II clones.",
    funFacts: [
      "GI made popular second-source versions of the Signetics 2513",
    ],
  },
  {
    id: "intellivision-grom",
    partNumber: "GROM",
    manufacturer: "General Instrument",
    type: "Graphics ROM (part of STIC)",
    year: 1979,
    capacity: { kb: 2 },
    glyph: { width: 8, height: 8 },
    glyphCount: 213,
    usedIn: ["Intellivision"],
    notes: "213 predefined 8×8 graphics cards including alphanumerics. Part of STIC (AY-3-8900).",
    funFacts: [
      "The GROM used a unique 'card' concept where each character was treated as a graphic tile",
    ],
  },

  // =========================================================================
  // MOS Technology
  // =========================================================================
  {
    id: "mos-901225-01",
    partNumber: "901225-01",
    manufacturer: "MOS Technology",
    type: "Mask ROM (2332-type)",
    year: 1982,
    capacity: { kb: 4, bytes: 4096 },
    organization: "4K×8",
    glyph: { width: 8, height: 8 },
    glyphCount: 256,
    characterSetsStored: 2,
    usedIn: ["C64", "Commodore 64C", "Commodore 128"],
    notes: "Two PETSCII charsets (uppercase/graphics, uppercase/lowercase). Commonly replaced via EPROM adapters.",
    funFacts: [
      "This is one of the most replaced ROMs in retro computing, often swapped for custom character sets",
    ],
  },
  {
    id: "mos-901447-10",
    partNumber: "901447-10",
    manufacturer: "MOS Technology",
    type: "Mask ROM (2316-type)",
    capacity: { kb: 2, bytes: 2048 },
    glyph: { width: 8, height: 8 },
    glyphCount: 256,
    usedIn: ["PET 8032"],
    notes: "Reversed characters generated by hardware logic.",
    funFacts: [
      "The PET business machines used this ROM for professional-looking 80-column displays",
    ],
  },
  {
    id: "mos-901460-03",
    partNumber: "901460-03",
    manufacturer: "MOS Technology",
    type: "Mask ROM (2332-type)",
    year: 1980,
    capacity: { kb: 4, bytes: 4096 },
    organization: "4K×8",
    glyph: { width: 8, height: 8 },
    glyphCount: 256,
    characterSetsStored: 2,
    usedIn: ["VIC-20"],
    notes: "4K×8 mask ROM; byte-wide organization. Two charsets switchable.",
    funFacts: [
      "The VIC-20 character ROM featured both PETSCII graphic characters and standard text",
    ],
  },

  // =========================================================================
  // Motorola
  // =========================================================================
  {
    id: "mc6847",
    partNumber: "MC6847",
    manufacturer: "Motorola",
    type: "Video Display Generator (VDG)",
    year: 1978,
    organization: "64×7×5",
    glyph: { width: 5, height: 7 },
    glyphCount: 64,
    internalFont: true,
    usedIn: [
      "TRS-80 Color Computer",
      "TRS-80 Color Computer 2",
      "TRS-80 MC-10",
      "Dragon 32",
      "Dragon 64",
      "Acorn Atom",
      "NEC PC-6001",
    ],
    variants: {
      MC6847: "Original, uppercase only",
      MC6847Y: "Interlaced video",
      MC6847T1: "96 characters with lowercase",
    },
    notes: "All-in-one VDG with internal 64-character ROM. 256×192 resolution, 9 colors, text mode 32×16.",
    funFacts: [
      "The MC6847 was one of the most popular video display chips of the early 1980s",
      "Its internal font was uppercase-only, a deliberate cost-saving measure",
    ],
  },
  {
    id: "mc6847t1",
    partNumber: "MC6847T1",
    manufacturer: "Motorola",
    type: "Video Display Generator (enhanced)",
    organization: "96×7×5",
    glyph: { width: 5, height: 7 },
    glyphCount: 96,
    internalFont: true,
    usedIn: ["TRS-80 Color Computer 2"],
    notes: "Enhanced version with 96 characters including true lowercase. Used in late CoCo 2 models.",
    funFacts: [
      "The T1 variant added lowercase letters, which many users of the original MC6847 had requested",
    ],
  },
  {
    id: "mcm6673",
    partNumber: "MCM6673",
    manufacturer: "Motorola",
    type: "Mask ROM (custom)",
    capacity: { bits: 5120, bytes: 640 },
    organization: "128×8×5",
    output: "5-bit parallel",
    glyph: { width: 5, height: 8 },
    glyphCount: 128,
    usedIn: ["TRS-80 Model I"],
    notes: "Custom for Radio Shack. Part of MCM6670 series. Outputs 5 bits per row.",
    funFacts: [
      "This was a custom ROM ordered by Radio Shack specifically for the TRS-80 Model I",
    ],
  },
  {
    id: "mcm6674",
    partNumber: "MCM6674",
    manufacturer: "Motorola",
    type: "Mask ROM",
    capacity: { bits: 5120, bytes: 640 },
    organization: "128×8×5",
    output: "5-bit parallel",
    glyph: { width: 5, height: 8 },
    glyphCount: 128,
    usedIn: [],
    notes: "General-purpose character generator for terminals. Standard terminal character set.",
    funFacts: [
      "The MCM6674 was widely used in video terminals and display systems",
    ],
  },

  // =========================================================================
  // Mullard/Philips
  // =========================================================================
  {
    id: "saa5050",
    partNumber: "SAA5050",
    manufacturer: "Mullard/Philips",
    type: "Teletext Character Generator",
    year: 1980,
    glyph: { width: 5, height: 9 },
    glyphCount: 96,
    internalFont: true,
    output: "RGB",
    usedIn: ["BBC Micro", "Philips P2000"],
    variants: {
      SAA5050: "UK",
      SAA5051: "German",
      SAA5052: "Swedish",
      SAA5053: "Italian",
      SAA5054: "Belgian",
      SAA5055: "US ASCII",
      SAA5056: "Hebrew",
      SAA5057: "Cyrillic",
    },
    notes: "Teletext standard IC. Internal 5×9 font interpolated to 10×18. Supports double-height, flashing, block graphics.",
    funFacts: [
      "The SAA5050 series was designed for the European Teletext broadcast standard",
      "It could interpolate its 5×9 font to 10×18 for smooth display on TVs",
    ],
  },

  // =========================================================================
  // Signetics
  // =========================================================================
  {
    id: "signetics-2513",
    partNumber: "2513",
    manufacturer: "Signetics",
    type: "Mask ROM",
    year: 1971,
    capacity: { bits: 2560 },
    organization: "64×8×5",
    output: "5-bit parallel",
    glyph: { width: 5, height: 7 },
    glyphCount: 64,
    usedIn: ["Apple II", "Apple II Plus"],
    variants: {
      "2513-CM": "Uppercase (General Instrument RO-3-2513)",
      "2513-CN": "Lowercase",
      "2513-4": "Greek",
    },
    notes: "Industry standard character generator of the 1970s. One of the earliest chargen ROMs.",
    funFacts: [
      "The Signetics 2513 was the industry standard character generator of the 1970s",
      "Steve Wozniak chose it for the Apple II due to its low cost and availability",
    ],
  },

  // =========================================================================
  // Sinclair (embedded ROM)
  // =========================================================================
  {
    id: "sinclair-spectrum-rom",
    partNumber: "Spectrum ROM",
    manufacturer: "Sinclair",
    type: "System ROM (embedded font)",
    year: 1982,
    capacity: { bytes: 768 },
    organization: "96×8×8",
    glyph: { width: 8, height: 8 },
    glyphCount: 96,
    internalFont: true,
    usedIn: [
      "ZX Spectrum",
      "ZX Spectrum 128",
      "ZX Spectrum +2",
      "ZX Spectrum +3",
    ],
    notes: "Font at $3D00-$3FFF in 16KB ROM. 768 bytes (96 chars × 8 bytes). Supports 21 UDGs.",
    funFacts: [
      "The Spectrum font was designed to be highly legible on 1980s TVs",
      "User-Defined Graphics (UDGs) allowed programmers to create custom characters",
    ],
  },

  // =========================================================================
  // Texas Instruments
  // =========================================================================
  {
    id: "tms9918",
    partNumber: "TMS9918A",
    manufacturer: "Texas Instruments",
    type: "Video Display Processor (VDP)",
    year: 1979,
    glyph: { width: 8, height: 8 },
    glyphCount: 256,
    internalFont: false,
    usedIn: [
      "TI-99/4A",
      "ColecoVision",
      "Coleco Adam",
      "MSX",
      "Sega SG-1000",
      "Sega SC-3000",
    ],
    variants: {
      TMS9918: "Original NTSC",
      TMS9918A: "Enhanced NTSC",
      TMS9928A: "Y/R-Y/B-Y component output",
      TMS9929A: "PAL version",
    },
    successors: ["V9938 (MSX2)", "V9958 (MSX2+)"],
    notes: "No internal font; all 256 patterns in 16KB VRAM. 32 sprites, multiple graphics modes.",
    funFacts: [
      "The TMS9918 was TI's answer to custom video chips like those in the Atari 2600",
      "It could display 32 sprites simultaneously, which was impressive for 1979",
    ],
  },

  // =========================================================================
  // Tandy (custom ASICs)
  // =========================================================================
  {
    id: "gime",
    partNumber: "GIME",
    manufacturer: "Tandy",
    type: "Custom Video Controller (ASIC)",
    year: 1986,
    glyph: { width: 8, height: 8 },
    glyphCount: 256,
    internalFont: false,
    usedIn: ["Tandy Color Computer 3"],
    notes:
      "Graphics Interrupt Memory Enhancement. Replaces MC6847 VDG and MC6883 SAM. " +
      "Supports 40/80 column text, 640×225 graphics, 64-color palette, software-definable fonts.",
    funFacts: [
      "The GIME was designed by Tandy to dramatically upgrade the CoCo 3's capabilities",
      "It combined the functions of multiple chips into one custom ASIC",
    ],
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
