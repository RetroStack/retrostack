/**
 * Character ROM Editor - Storage Layer
 *
 * Provides IndexedDB storage for character sets with localStorage fallback.
 * Handles CRUD operations, search, and filtering.
 */

import { SerializedCharacterSet, generateId } from "../types";
import {
  DB_NAME,
  DB_VERSION,
  CHARACTER_EDITOR_STORE_NAME,
  CHARACTER_EDITOR_SNAPSHOTS_STORE,
  CHARACTER_EDITOR_STORAGE_KEY_FALLBACK,
  CHARACTER_EDITOR_STORAGE_KEY_AUTOSAVE,
} from "./keys";
import type { ICharacterSetStorage, IKeyValueStorage, AutoSaveData } from "./interfaces";

/**
 * Check if IndexedDB is available
 */
function isIndexedDBAvailable(): boolean {
  try {
    if (typeof window === "undefined") return false;
    return !!window.indexedDB;
  } catch {
    return false;
  }
}

/**
 * Create a localStorage wrapper that implements IKeyValueStorage
 * Returns a safe wrapper that handles SSR (no window) gracefully
 */
function createLocalStorageWrapper(): IKeyValueStorage {
  return {
    getItem(key: string): string | null {
      if (typeof window === "undefined") return null;
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem(key: string, value: string): void {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.error("Failed to write to localStorage:", e);
      }
    },
    removeItem(key: string): void {
      if (typeof window === "undefined") return;
      try {
        localStorage.removeItem(key);
      } catch {
        // Ignore errors
      }
    },
  };
}

/**
 * Character storage class with IndexedDB and localStorage fallback
 * Implements ICharacterSetStorage for dependency injection
 */
class CharacterStorage implements ICharacterSetStorage {
  private db: IDBDatabase | null = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private kvStorage: IKeyValueStorage;

  /**
   * Create a new CharacterStorage instance
   * @param kvStorage Optional key-value storage for fallback (defaults to localStorage)
   */
  constructor(kvStorage?: IKeyValueStorage) {
    this.kvStorage = kvStorage ?? createLocalStorageWrapper();
  }

  /**
   * Initialize the storage (opens IndexedDB or sets up fallback)
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this._initialize();
    await this.initPromise;
    this.initialized = true;
  }

  private async _initialize(): Promise<void> {
    if (!isIndexedDBAvailable()) {
      console.log("IndexedDB not available, using localStorage fallback");
      return;
    }

    return new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error("Failed to open IndexedDB, using localStorage fallback");
        resolve();
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = (event.target as IDBOpenDBRequest).transaction!;
        const oldVersion = event.oldVersion;

        // Create the character sets store (if new database)
        if (!db.objectStoreNames.contains(CHARACTER_EDITOR_STORE_NAME)) {
          const store = db.createObjectStore(CHARACTER_EDITOR_STORE_NAME, {
            keyPath: "metadata.id",
          });

          // Create indexes for searching and filtering
          store.createIndex("by-name", "metadata.name", { unique: false });
          store.createIndex("by-updated", "metadata.updatedAt", {
            unique: false,
          });
          store.createIndex("by-size", "sizeKey", { unique: false });
          store.createIndex("by-manufacturer", "metadata.manufacturer", { unique: false });
          store.createIndex("by-system", "metadata.system", { unique: false });
          store.createIndex("by-locale", "metadata.locale", { unique: false });
        } else {
          // Migration from v1 to v2: add manufacturer/system indexes and fields
          if (oldVersion < 2) {
            const store = transaction.objectStore(CHARACTER_EDITOR_STORE_NAME);

            // Add new indexes if they don't exist
            if (!store.indexNames.contains("by-manufacturer")) {
              store.createIndex("by-manufacturer", "metadata.manufacturer", { unique: false });
            }
            if (!store.indexNames.contains("by-system")) {
              store.createIndex("by-system", "metadata.system", { unique: false });
            }

            // Migrate existing records to add manufacturer/system fields
            const cursorRequest = store.openCursor();
            cursorRequest.onsuccess = (e) => {
              const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
              if (cursor) {
                const record = cursor.value;
                // Add manufacturer/system fields if missing
                if (record.metadata && record.metadata.manufacturer === undefined) {
                  record.metadata.manufacturer = "";
                }
                if (record.metadata && record.metadata.system === undefined) {
                  record.metadata.system = "";
                }
                cursor.update(record);
                cursor.continue();
              }
            };
          }

          // Migration from v2 to v3: add isPinned field
          if (oldVersion < 3) {
            const store = transaction.objectStore(CHARACTER_EDITOR_STORE_NAME);

            // Migrate existing records to add isPinned field
            const cursorRequest = store.openCursor();
            cursorRequest.onsuccess = (e) => {
              const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
              if (cursor) {
                const record = cursor.value;
                // Add isPinned field if missing
                if (record.metadata && record.metadata.isPinned === undefined) {
                  record.metadata.isPinned = false;
                }
                cursor.update(record);
                cursor.continue();
              }
            };
          }

          // Migration from v3 to v4: add locale field and index
          if (oldVersion < 4) {
            const store = transaction.objectStore(CHARACTER_EDITOR_STORE_NAME);

            // Add locale index if it doesn't exist
            if (!store.indexNames.contains("by-locale")) {
              store.createIndex("by-locale", "metadata.locale", { unique: false });
            }

            // Migrate existing records to add locale field
            const cursorRequest = store.openCursor();
            cursorRequest.onsuccess = (e) => {
              const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
              if (cursor) {
                const record = cursor.value;
                // Add locale field if missing
                if (record.metadata && record.metadata.locale === undefined) {
                  record.metadata.locale = "";
                }
                cursor.update(record);
                cursor.continue();
              }
            };
          }
        }

        // Create snapshots store (for all versions, including new and migrating DBs)
        if (!db.objectStoreNames.contains(CHARACTER_EDITOR_SNAPSHOTS_STORE)) {
          const snapshotsStore = db.createObjectStore(CHARACTER_EDITOR_SNAPSHOTS_STORE, {
            keyPath: "id",
          });
          snapshotsStore.createIndex("by-character-set", "characterSetId", { unique: false });
          snapshotsStore.createIndex("by-created", "createdAt", { unique: false });
        }
      };
    });
  }

  /**
   * Check if using fallback storage
   */
  private useFallback(): boolean {
    return this.db === null;
  }

  /**
   * Get all character sets from fallback storage
   */
  private fallbackGetAll(): SerializedCharacterSet[] {
    try {
      const data = this.kvStorage.getItem(CHARACTER_EDITOR_STORAGE_KEY_FALLBACK);
      if (!data) return [];
      const sets = JSON.parse(data) as SerializedCharacterSet[];
      // Ensure manufacturer/system/locale/isPinned fields exist for migrated data
      return sets.map((set) => ({
        ...set,
        metadata: {
          ...set.metadata,
          manufacturer: set.metadata.manufacturer ?? "",
          system: set.metadata.system ?? "",
          locale: set.metadata.locale ?? "",
          isPinned: set.metadata.isPinned ?? false,
        },
      }));
    } catch {
      return [];
    }
  }

  /**
   * Save all character sets to fallback storage
   */
  private fallbackSaveAll(sets: SerializedCharacterSet[]): void {
    try {
      this.kvStorage.setItem(CHARACTER_EDITOR_STORAGE_KEY_FALLBACK, JSON.stringify(sets));
    } catch (e) {
      console.error("Failed to save to fallback storage:", e);
      throw new Error("Storage quota exceeded");
    }
  }

  /**
   * Get all character sets
   */
  async getAll(): Promise<SerializedCharacterSet[]> {
    await this.initialize();

    if (this.useFallback()) {
      return this.fallbackGetAll();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CHARACTER_EDITOR_STORE_NAME], "readonly");
      const store = transaction.objectStore(CHARACTER_EDITOR_STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        // Sort by pinned first, then by updated date (newest first)
        const results = request.result as SerializedCharacterSet[];
        results.sort((a, b) => {
          // Pinned items come first
          const aPinned = a.metadata.isPinned ? 1 : 0;
          const bPinned = b.metadata.isPinned ? 1 : 0;
          if (aPinned !== bPinned) return bPinned - aPinned;
          // Then sort by updated date
          return b.metadata.updatedAt - a.metadata.updatedAt;
        });
        resolve(results);
      };

      request.onerror = () => {
        reject(new Error("Failed to get character sets"));
      };
    });
  }

  /**
   * Get a character set by ID
   */
  async getById(id: string): Promise<SerializedCharacterSet | null> {
    await this.initialize();

    if (this.useFallback()) {
      const sets = this.fallbackGetAll();
      return sets.find((s) => s.metadata.id === id) || null;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CHARACTER_EDITOR_STORE_NAME], "readonly");
      const store = transaction.objectStore(CHARACTER_EDITOR_STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error("Failed to get character set"));
      };
    });
  }

  /**
   * Save a character set (insert or update)
   */
  async save(characterSet: SerializedCharacterSet): Promise<string> {
    await this.initialize();

    // Add size key for indexing
    const setWithSizeKey = {
      ...characterSet,
      sizeKey: `${characterSet.config.width}x${characterSet.config.height}`,
    };

    if (this.useFallback()) {
      const sets = this.fallbackGetAll();
      const existingIndex = sets.findIndex(
        (s) => s.metadata.id === characterSet.metadata.id
      );

      if (existingIndex >= 0) {
        sets[existingIndex] = characterSet;
      } else {
        sets.push(characterSet);
      }

      this.fallbackSaveAll(sets);
      return characterSet.metadata.id;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CHARACTER_EDITOR_STORE_NAME], "readwrite");
      const store = transaction.objectStore(CHARACTER_EDITOR_STORE_NAME);
      const request = store.put(setWithSizeKey);

      request.onsuccess = () => {
        resolve(characterSet.metadata.id);
      };

      request.onerror = () => {
        reject(new Error("Failed to save character set"));
      };
    });
  }

  /**
   * Save as a new character set with a new name
   */
  async saveAs(
    characterSet: SerializedCharacterSet,
    newName: string
  ): Promise<string> {
    const newId = generateId();
    const now = Date.now();

    const newSet: SerializedCharacterSet = {
      ...characterSet,
      metadata: {
        ...characterSet.metadata,
        id: newId,
        name: newName,
        createdAt: now,
        updatedAt: now,
        isBuiltIn: false,
        source: "yourself",
      },
    };

    await this.save(newSet);
    return newId;
  }

  /**
   * Toggle the pinned state of a character set
   */
  async togglePinned(id: string): Promise<boolean> {
    await this.initialize();

    const set = await this.getById(id);
    if (!set) {
      throw new Error("Character set not found");
    }

    const newPinnedState = !set.metadata.isPinned;
    const updated: SerializedCharacterSet = {
      ...set,
      metadata: {
        ...set.metadata,
        isPinned: newPinnedState,
      },
    };

    await this.save(updated);
    return newPinnedState;
  }

  /**
   * Delete a character set by ID
   */
  async delete(id: string): Promise<void> {
    await this.initialize();

    if (this.useFallback()) {
      const sets = this.fallbackGetAll();
      const filtered = sets.filter((s) => s.metadata.id !== id);
      this.fallbackSaveAll(filtered);
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CHARACTER_EDITOR_STORE_NAME], "readwrite");
      const store = transaction.objectStore(CHARACTER_EDITOR_STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error("Failed to delete character set"));
      };
    });
  }

  /**
   * Search character sets by name, description, source, manufacturer, system, or locale
   */
  async search(query: string): Promise<SerializedCharacterSet[]> {
    const all = await this.getAll();
    const lowerQuery = query.toLowerCase();

    return all.filter(
      (set) =>
        set.metadata.name.toLowerCase().includes(lowerQuery) ||
        set.metadata.description.toLowerCase().includes(lowerQuery) ||
        set.metadata.source.toLowerCase().includes(lowerQuery) ||
        set.metadata.manufacturer.toLowerCase().includes(lowerQuery) ||
        set.metadata.system.toLowerCase().includes(lowerQuery) ||
        set.metadata.locale.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter character sets by size
   */
  async filterBySize(
    width: number | null,
    height: number | null
  ): Promise<SerializedCharacterSet[]> {
    const all = await this.getAll();

    return all.filter((set) => {
      if (width !== null && set.config.width !== width) return false;
      if (height !== null && set.config.height !== height) return false;
      return true;
    });
  }

  /**
   * Filter character sets by manufacturers (OR logic)
   */
  async filterByManufacturers(manufacturers: string[]): Promise<SerializedCharacterSet[]> {
    if (manufacturers.length === 0) {
      return this.getAll();
    }
    const all = await this.getAll();
    const lowerManufacturers = manufacturers.map((m) => m.toLowerCase());
    return all.filter((set) =>
      lowerManufacturers.includes(set.metadata.manufacturer.toLowerCase())
    );
  }

  /**
   * Filter character sets by systems (OR logic)
   */
  async filterBySystems(systems: string[]): Promise<SerializedCharacterSet[]> {
    if (systems.length === 0) {
      return this.getAll();
    }
    const all = await this.getAll();
    const lowerSystems = systems.map((s) => s.toLowerCase());
    return all.filter((set) =>
      lowerSystems.includes(set.metadata.system.toLowerCase())
    );
  }

  /**
   * Get unique manufacturers available in the library
   */
  async getAvailableManufacturers(): Promise<string[]> {
    const all = await this.getAll();
    const manufacturers = new Set<string>();
    for (const set of all) {
      if (set.metadata.manufacturer) {
        manufacturers.add(set.metadata.manufacturer);
      }
    }
    return Array.from(manufacturers).sort();
  }

  /**
   * Get unique systems available in the library
   */
  async getAvailableSystems(): Promise<string[]> {
    const all = await this.getAll();
    const systems = new Set<string>();
    for (const set of all) {
      if (set.metadata.system) {
        systems.add(set.metadata.system);
      }
    }
    return Array.from(systems).sort();
  }

  /**
   * Get unique sizes available in the library
   */
  async getAvailableSizes(): Promise<{ width: number; height: number }[]> {
    const all = await this.getAll();
    const sizeMap = new Map<string, { width: number; height: number }>();

    for (const set of all) {
      const key = `${set.config.width}x${set.config.height}`;
      if (!sizeMap.has(key)) {
        sizeMap.set(key, {
          width: set.config.width,
          height: set.config.height,
        });
      }
    }

    return Array.from(sizeMap.values()).sort((a, b) => {
      if (a.width !== b.width) return a.width - b.width;
      return a.height - b.height;
    });
  }

  /**
   * Check if a character set with the given name exists
   */
  async nameExists(name: string, excludeId?: string): Promise<boolean> {
    const all = await this.getAll();
    return all.some(
      (set) =>
        set.metadata.name.toLowerCase() === name.toLowerCase() &&
        set.metadata.id !== excludeId
    );
  }

  /**
   * Get count of character sets
   */
  async count(): Promise<number> {
    const all = await this.getAll();
    return all.length;
  }

  /**
   * Check if library is empty (no user sets, only built-in)
   */
  async isEmpty(): Promise<boolean> {
    const all = await this.getAll();
    return all.length === 0;
  }

  /**
   * Clear all data (for testing purposes)
   */
  async clear(): Promise<void> {
    await this.initialize();

    if (this.useFallback()) {
      this.kvStorage.removeItem(CHARACTER_EDITOR_STORAGE_KEY_FALLBACK);
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CHARACTER_EDITOR_STORE_NAME], "readwrite");
      const store = transaction.objectStore(CHARACTER_EDITOR_STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error("Failed to clear storage"));
      };
    });
  }
}

// Export singleton instance
export const characterStorage = new CharacterStorage();

/**
 * Get the shared IndexedDB database instance
 * Used by other modules (like snapshots) that need to access the same database
 */
export async function getSharedDatabase(): Promise<IDBDatabase | null> {
  await characterStorage.initialize();
  const db = (characterStorage as unknown as { db: IDBDatabase | null }).db;

  // Check if required stores exist - if not, the database needs to be recreated
  if (db && !db.objectStoreNames.contains(CHARACTER_EDITOR_SNAPSHOTS_STORE)) {
    console.warn("Database missing snapshots store, triggering recreation...");
    db.close();

    // Delete and recreate the database
    await new Promise<void>((resolve) => {
      const deleteRequest = indexedDB.deleteDatabase(DB_NAME);
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => resolve(); // Continue even if delete fails
      deleteRequest.onblocked = () => resolve();
    });

    // Reset the singleton and reinitialize
    (characterStorage as unknown as { db: IDBDatabase | null; initialized: boolean }).db = null;
    (characterStorage as unknown as { db: IDBDatabase | null; initialized: boolean; initPromise: Promise<void> | null }).initialized = false;
    (characterStorage as unknown as { db: IDBDatabase | null; initialized: boolean; initPromise: Promise<void> | null }).initPromise = null;

    await characterStorage.initialize();
    return (characterStorage as unknown as { db: IDBDatabase | null }).db;
  }

  return db;
}

// Auto-save utilities

// Default key-value storage wrapper (uses localStorage)
const defaultKvStorage = createLocalStorageWrapper();

/**
 * Save auto-save data to storage
 * @param data The auto-save data to save
 * @param storage Optional key-value storage (defaults to localStorage wrapper)
 */
export function saveAutoSave(data: AutoSaveData, storage: IKeyValueStorage = defaultKvStorage): void {
  try {
    storage.setItem(CHARACTER_EDITOR_STORAGE_KEY_AUTOSAVE, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to auto-save:", e);
  }
}

/**
 * Get auto-save data from storage
 * @param storage Optional key-value storage (defaults to localStorage wrapper)
 */
export function getAutoSave(storage: IKeyValueStorage = defaultKvStorage): AutoSaveData | null {
  try {
    const data = storage.getItem(CHARACTER_EDITOR_STORAGE_KEY_AUTOSAVE);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Clear auto-save data
 * @param storage Optional key-value storage (defaults to localStorage wrapper)
 */
export function clearAutoSave(storage: IKeyValueStorage = defaultKvStorage): void {
  storage.removeItem(CHARACTER_EDITOR_STORAGE_KEY_AUTOSAVE);
}

/**
 * Check if auto-save data exists and is newer than library version
 * @param characterSetId The character set ID to check
 * @param storage Optional key-value storage (defaults to localStorage wrapper)
 * @param charStorage Optional character set storage (defaults to singleton)
 */
export async function hasNewerAutoSave(
  characterSetId: string,
  storage: IKeyValueStorage = defaultKvStorage,
  charStorage: ICharacterSetStorage = characterStorage
): Promise<boolean> {
  const autoSave = getAutoSave(storage);
  if (!autoSave || autoSave.characterSetId !== characterSetId) {
    return false;
  }

  const stored = await charStorage.getById(characterSetId);
  if (!stored) {
    // Original doesn't exist anymore, auto-save is orphaned
    return autoSave.isDirty;
  }

  return autoSave.timestamp > stored.metadata.updatedAt && autoSave.isDirty;
}

// Re-export types from interfaces for convenience
export type { AutoSaveData, IKeyValueStorage, ICharacterSetStorage } from "./interfaces";

// Export the localStorage wrapper factory for use in other modules
export { createLocalStorageWrapper };
