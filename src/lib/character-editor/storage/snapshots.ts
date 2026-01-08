/**
 * Character ROM Editor - Snapshots Storage
 *
 * Provides IndexedDB storage for named snapshots of character sets.
 * Snapshots allow users to save multiple versions of their work.
 */

import { Character, CharacterSetConfig, generateId } from "../types";
import { serializeCharacterRom, binaryToBase64, base64ToBinary, parseCharacterRom } from "../import/binary";
import { getSharedDatabase } from "./storage";
import { CHARACTER_EDITOR_SNAPSHOTS_STORE } from "./keys";

const SNAPSHOTS_STORE = CHARACTER_EDITOR_SNAPSHOTS_STORE;
const MAX_SNAPSHOTS_PER_SET = 10;

/**
 * Snapshot metadata and data
 */
export interface Snapshot {
  /** Unique snapshot ID */
  id: string;
  /** ID of the character set this snapshot belongs to */
  characterSetId: string;
  /** User-provided name for the snapshot */
  name: string;
  /** When the snapshot was created */
  createdAt: number;
  /** Binary data as base64 */
  binaryData: string;
  /** Character set config at time of snapshot */
  config: CharacterSetConfig;
  /** Number of characters in the snapshot */
  characterCount: number;
}

/**
 * Get the IndexedDB database (uses shared database from storage.ts)
 * Returns null if database or snapshots store is not available
 */
async function getDatabase(): Promise<IDBDatabase | null> {
  const db = await getSharedDatabase();
  if (!db) {
    return null;
  }
  // Verify the snapshots store exists
  if (!db.objectStoreNames.contains(SNAPSHOTS_STORE)) {
    console.warn("Snapshots store not found in database. Please refresh the page to trigger database migration.");
    return null;
  }
  return db;
}

/**
 * Create a snapshot from characters
 */
export function createSnapshot(
  characterSetId: string,
  name: string,
  characters: Character[],
  config: CharacterSetConfig
): Snapshot {
  const binaryData = binaryToBase64(serializeCharacterRom(characters, config));

  return {
    id: generateId(),
    characterSetId,
    name,
    createdAt: Date.now(),
    binaryData,
    config,
    characterCount: characters.length,
  };
}

/**
 * Restore characters from a snapshot
 */
export function restoreSnapshot(snapshot: Snapshot): Character[] {
  const binary = base64ToBinary(snapshot.binaryData);
  return parseCharacterRom(binary, snapshot.config);
}

/**
 * Save a snapshot to IndexedDB
 */
export async function saveSnapshot(snapshot: Snapshot): Promise<void> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("Snapshots not available. Please refresh the page.");
  }

  // Check if we've exceeded the limit for this character set
  const existingSnapshots = await getSnapshotsForCharacterSet(snapshot.characterSetId);
  if (existingSnapshots.length >= MAX_SNAPSHOTS_PER_SET) {
    throw new Error(
      `Maximum of ${MAX_SNAPSHOTS_PER_SET} snapshots per character set. Delete an existing snapshot first.`
    );
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SNAPSHOTS_STORE], "readwrite");
    const store = transaction.objectStore(SNAPSHOTS_STORE);
    const request = store.put(snapshot);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error("Failed to save snapshot"));
  });
}

/**
 * Get all snapshots for a character set
 * Returns empty array if snapshots store is not available
 */
export async function getSnapshotsForCharacterSet(characterSetId: string): Promise<Snapshot[]> {
  const db = await getDatabase();
  if (!db) {
    return []; // Gracefully return empty if store not available
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SNAPSHOTS_STORE], "readonly");
    const store = transaction.objectStore(SNAPSHOTS_STORE);
    const index = store.index("by-character-set");
    const request = index.getAll(characterSetId);

    request.onsuccess = () => {
      const snapshots = request.result as Snapshot[];
      // Sort by created date, newest first
      snapshots.sort((a, b) => b.createdAt - a.createdAt);
      resolve(snapshots);
    };

    request.onerror = () => {
      reject(new Error("Failed to get snapshots"));
    };
  });
}

/**
 * Get a snapshot by ID
 */
export async function getSnapshotById(id: string): Promise<Snapshot | null> {
  const db = await getDatabase();
  if (!db) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SNAPSHOTS_STORE], "readonly");
    const store = transaction.objectStore(SNAPSHOTS_STORE);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      reject(new Error("Failed to get snapshot"));
    };
  });
}

/**
 * Delete a snapshot
 */
export async function deleteSnapshot(id: string): Promise<void> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("Snapshots not available. Please refresh the page.");
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SNAPSHOTS_STORE], "readwrite");
    const store = transaction.objectStore(SNAPSHOTS_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error("Failed to delete snapshot"));
  });
}

/**
 * Delete all snapshots for a character set
 */
export async function deleteAllSnapshotsForCharacterSet(characterSetId: string): Promise<void> {
  const snapshots = await getSnapshotsForCharacterSet(characterSetId);

  for (const snapshot of snapshots) {
    await deleteSnapshot(snapshot.id);
  }
}

/**
 * Rename a snapshot
 */
export async function renameSnapshot(id: string, newName: string): Promise<void> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("Snapshots not available. Please refresh the page.");
  }

  const snapshot = await getSnapshotById(id);
  if (!snapshot) {
    throw new Error("Snapshot not found");
  }

  const updatedSnapshot: Snapshot = {
    ...snapshot,
    name: newName,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SNAPSHOTS_STORE], "readwrite");
    const store = transaction.objectStore(SNAPSHOTS_STORE);
    const request = store.put(updatedSnapshot);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error("Failed to rename snapshot"));
  });
}

/**
 * Get snapshot count for a character set
 */
export async function getSnapshotCount(characterSetId: string): Promise<number> {
  const snapshots = await getSnapshotsForCharacterSet(characterSetId);
  return snapshots.length;
}

/**
 * Check if snapshots are at capacity
 */
export async function isAtSnapshotCapacity(characterSetId: string): Promise<boolean> {
  const count = await getSnapshotCount(characterSetId);
  return count >= MAX_SNAPSHOTS_PER_SET;
}

/**
 * Get max snapshots per character set
 */
export function getMaxSnapshots(): number {
  return MAX_SNAPSHOTS_PER_SET;
}
