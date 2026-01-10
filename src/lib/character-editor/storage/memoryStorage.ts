/**
 * Character ROM Editor - In-Memory Storage Implementations
 *
 * Provides in-memory implementations of storage interfaces for testing.
 * These implementations have no browser dependencies and can run in any
 * JavaScript environment (Node.js, JSDOM, etc.)
 */

import type {
  IKeyValueStorage,
  ICharacterSetStorage,
  ISnapshotStorage,
  Snapshot,
  AutoSaveData,
  IAutoSaveStorage,
} from "./interfaces";
import type { SerializedCharacterSet, CharacterSetNote } from "../types";
import { generateId } from "../types";

/**
 * In-memory key-value storage implementation
 *
 * Implements IKeyValueStorage using a Map for storage.
 * Useful for testing code that depends on localStorage.
 */
export class InMemoryKeyValueStorage implements IKeyValueStorage {
  private data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  /** Clear all stored data (useful for test cleanup) */
  clear(): void {
    this.data.clear();
  }

  /** Get all stored keys (useful for test assertions) */
  keys(): string[] {
    return Array.from(this.data.keys());
  }

  /** Get the number of stored items */
  get size(): number {
    return this.data.size;
  }
}

/**
 * In-memory character set storage implementation
 *
 * Implements ICharacterSetStorage using an array for storage.
 * Useful for testing hooks and components that depend on character set storage.
 */
export class InMemoryCharacterSetStorage implements ICharacterSetStorage {
  private data: SerializedCharacterSet[] = [];
  private _initialized = false;

  /** Direct access to the underlying data for test assertions */
  get sets(): SerializedCharacterSet[] {
    return this.data;
  }

  /** Check if the storage has been initialized */
  get isInitialized(): boolean {
    return this._initialized;
  }

  async initialize(): Promise<void> {
    this._initialized = true;
  }

  async getAll(): Promise<SerializedCharacterSet[]> {
    // Sort by pinned first, then by updated date (newest first)
    return [...this.data].sort((a, b) => {
      const aPinned = a.metadata.isPinned ? 1 : 0;
      const bPinned = b.metadata.isPinned ? 1 : 0;
      if (aPinned !== bPinned) return bPinned - aPinned;
      return b.metadata.updatedAt - a.metadata.updatedAt;
    });
  }

  async getById(id: string): Promise<SerializedCharacterSet | null> {
    return this.data.find((s) => s.metadata.id === id) ?? null;
  }

  async save(characterSet: SerializedCharacterSet): Promise<string> {
    const existingIndex = this.data.findIndex(
      (s) => s.metadata.id === characterSet.metadata.id
    );

    if (existingIndex >= 0) {
      this.data[existingIndex] = characterSet;
    } else {
      this.data.push(characterSet);
    }

    return characterSet.metadata.id;
  }

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

  async delete(id: string): Promise<void> {
    this.data = this.data.filter((s) => s.metadata.id !== id);
  }

  async togglePinned(id: string): Promise<boolean> {
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

  async addNote(id: string, text: string): Promise<CharacterSetNote> {
    const set = await this.getById(id);
    if (!set) {
      throw new Error("Character set not found");
    }

    const now = Date.now();
    const note: CharacterSetNote = {
      id: generateId(),
      text,
      createdAt: now,
      updatedAt: now,
    };

    const updated: SerializedCharacterSet = {
      ...set,
      metadata: {
        ...set.metadata,
        notes: [...(set.metadata.notes ?? []), note],
      },
    };

    await this.save(updated);
    return note;
  }

  async updateNote(id: string, noteId: string, text: string): Promise<CharacterSetNote> {
    const set = await this.getById(id);
    if (!set) {
      throw new Error("Character set not found");
    }

    const notes = set.metadata.notes ?? [];
    const noteIndex = notes.findIndex((n) => n.id === noteId);
    if (noteIndex === -1) {
      throw new Error("Note not found");
    }

    const updatedNote: CharacterSetNote = {
      ...notes[noteIndex],
      text,
      updatedAt: Date.now(),
    };

    const updatedNotes = [...notes];
    updatedNotes[noteIndex] = updatedNote;

    const updated: SerializedCharacterSet = {
      ...set,
      metadata: {
        ...set.metadata,
        notes: updatedNotes,
      },
    };

    await this.save(updated);
    return updatedNote;
  }

  async deleteNote(id: string, noteId: string): Promise<void> {
    const set = await this.getById(id);
    if (!set) {
      throw new Error("Character set not found");
    }

    const notes = set.metadata.notes ?? [];
    const updatedNotes = notes.filter((n) => n.id !== noteId);

    const updated: SerializedCharacterSet = {
      ...set,
      metadata: {
        ...set.metadata,
        notes: updatedNotes,
      },
    };

    await this.save(updated);
  }

  async getNotes(id: string): Promise<CharacterSetNote[]> {
    const set = await this.getById(id);
    if (!set) {
      throw new Error("Character set not found");
    }

    return set.metadata.notes ?? [];
  }

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

  async filterByManufacturers(
    manufacturers: string[]
  ): Promise<SerializedCharacterSet[]> {
    if (manufacturers.length === 0) {
      return this.getAll();
    }
    const all = await this.getAll();
    const lowerManufacturers = manufacturers.map((m) => m.toLowerCase());
    return all.filter((set) =>
      lowerManufacturers.includes(set.metadata.manufacturer.toLowerCase())
    );
  }

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

  async nameExists(name: string, excludeId?: string): Promise<boolean> {
    const all = await this.getAll();
    return all.some(
      (set) =>
        set.metadata.name.toLowerCase() === name.toLowerCase() &&
        set.metadata.id !== excludeId
    );
  }

  async count(): Promise<number> {
    return this.data.length;
  }

  async isEmpty(): Promise<boolean> {
    return this.data.length === 0;
  }

  async clear(): Promise<void> {
    this.data = [];
  }

  /** Reset initialization state (useful for testing initialization logic) */
  reset(): void {
    this.data = [];
    this._initialized = false;
  }
}

/**
 * In-memory snapshot storage implementation
 *
 * Implements ISnapshotStorage using an array for storage.
 * Useful for testing snapshot-related functionality.
 */
export class InMemorySnapshotStorage implements ISnapshotStorage {
  private data: Snapshot[] = [];
  private maxSnapshots = 10;

  /** Direct access to the underlying data for test assertions */
  get snapshots(): Snapshot[] {
    return this.data;
  }

  /** Set the maximum snapshots allowed per character set */
  setMaxSnapshots(max: number): void {
    this.maxSnapshots = max;
  }

  async save(snapshot: Snapshot): Promise<void> {
    // Check capacity
    const existingSnapshots = await this.getForCharacterSet(snapshot.characterSetId);
    if (existingSnapshots.length >= this.maxSnapshots) {
      throw new Error(
        `Maximum of ${this.maxSnapshots} snapshots per character set. Delete an existing snapshot first.`
      );
    }

    // Update or insert
    const existingIndex = this.data.findIndex((s) => s.id === snapshot.id);
    if (existingIndex >= 0) {
      this.data[existingIndex] = snapshot;
    } else {
      this.data.push(snapshot);
    }
  }

  async getForCharacterSet(characterSetId: string): Promise<Snapshot[]> {
    return this.data
      .filter((s) => s.characterSetId === characterSetId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async getById(id: string): Promise<Snapshot | null> {
    return this.data.find((s) => s.id === id) ?? null;
  }

  async delete(id: string): Promise<void> {
    this.data = this.data.filter((s) => s.id !== id);
  }

  async deleteAllForCharacterSet(characterSetId: string): Promise<void> {
    this.data = this.data.filter((s) => s.characterSetId !== characterSetId);
  }

  async rename(id: string, newName: string): Promise<void> {
    const snapshot = await this.getById(id);
    if (!snapshot) {
      throw new Error("Snapshot not found");
    }

    const updatedSnapshot: Snapshot = {
      ...snapshot,
      name: newName,
    };

    const index = this.data.findIndex((s) => s.id === id);
    if (index >= 0) {
      this.data[index] = updatedSnapshot;
    }
  }

  async getCount(characterSetId: string): Promise<number> {
    const snapshots = await this.getForCharacterSet(characterSetId);
    return snapshots.length;
  }

  async isAtCapacity(characterSetId: string): Promise<boolean> {
    const count = await this.getCount(characterSetId);
    return count >= this.maxSnapshots;
  }

  getMaxSnapshots(): number {
    return this.maxSnapshots;
  }

  /** Clear all snapshots (useful for test cleanup) */
  clear(): void {
    this.data = [];
  }
}

/**
 * In-memory auto-save storage implementation
 *
 * Implements IAutoSaveStorage using in-memory storage.
 * Useful for testing auto-save functionality.
 */
export class InMemoryAutoSaveStorage implements IAutoSaveStorage {
  private data: AutoSaveData | null = null;

  /** Direct access to the underlying data for test assertions */
  get autoSaveData(): AutoSaveData | null {
    return this.data;
  }

  save(data: AutoSaveData): void {
    this.data = data;
  }

  get(): AutoSaveData | null {
    return this.data;
  }

  clear(): void {
    this.data = null;
  }

  hasNewerAutoSave(characterSetId: string, storedUpdatedAt: number): boolean {
    if (!this.data || this.data.characterSetId !== characterSetId) {
      return false;
    }

    return this.data.timestamp > storedUpdatedAt && this.data.isDirty;
  }
}

/**
 * Factory functions for creating pre-configured mock storage instances
 */

/** Create an empty in-memory key-value storage */
export function createMockKeyValueStorage(): InMemoryKeyValueStorage {
  return new InMemoryKeyValueStorage();
}

/** Create an empty in-memory character set storage */
export function createMockCharacterSetStorage(): InMemoryCharacterSetStorage {
  return new InMemoryCharacterSetStorage();
}

/** Create an empty in-memory snapshot storage */
export function createMockSnapshotStorage(): InMemorySnapshotStorage {
  return new InMemorySnapshotStorage();
}

/** Create an empty in-memory auto-save storage */
export function createMockAutoSaveStorage(): InMemoryAutoSaveStorage {
  return new InMemoryAutoSaveStorage();
}
