/**
 * Auto-save utilities for the Character ROM Editor
 *
 * Provides functions for saving/loading/checking auto-save data
 * used by the editor to recover unsaved work.
 */

import { CHARACTER_EDITOR_STORAGE_KEY_AUTOSAVE } from "./keys";
import type { IKeyValueStorage, ICharacterSetStorage, AutoSaveData } from "./interfaces";

/**
 * Default localStorage wrapper that implements IKeyValueStorage
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

/** Default key-value storage wrapper (uses localStorage) */
const defaultKvStorage = createLocalStorageWrapper();

/**
 * Save auto-save data to storage
 *
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
 *
 * @param storage Optional key-value storage (defaults to localStorage wrapper)
 * @returns The auto-save data or null if not found
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
 *
 * @param storage Optional key-value storage (defaults to localStorage wrapper)
 */
export function clearAutoSave(storage: IKeyValueStorage = defaultKvStorage): void {
  storage.removeItem(CHARACTER_EDITOR_STORAGE_KEY_AUTOSAVE);
}

/**
 * Check if auto-save data exists and is newer than library version
 *
 * @param characterSetId The character set ID to check
 * @param storage Optional key-value storage (defaults to localStorage wrapper)
 * @param charStorage Character set storage instance for looking up the original
 * @returns true if auto-save data exists and is newer than the stored version
 */
export async function hasNewerAutoSave(
  characterSetId: string,
  storage: IKeyValueStorage = defaultKvStorage,
  charStorage: ICharacterSetStorage
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
