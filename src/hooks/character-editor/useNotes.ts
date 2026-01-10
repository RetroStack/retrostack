/**
 * Notes Management Hook
 *
 * Manages user notes attached to character sets. Notes are "user-owned"
 * metadata that can be modified on any character set, including built-in
 * sets. Notes are preserved when built-in character sets are updated.
 *
 * Features:
 * - Add, edit, and delete notes
 * - Timestamps (created and updated)
 * - Works on any character set including built-in
 *
 * Supports dependency injection for testing via ICharacterSetStorage.
 *
 * @module hooks/character-editor/useNotes
 */
"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type { CharacterSetNote } from "@/lib/character-editor/types";
import type { ICharacterSetStorage } from "@/lib/character-editor/storage/interfaces";
import { characterStorage } from "@/lib/character-editor/storage/storage";

export interface UseNotesOptions {
  /** Character set ID to manage notes for */
  characterSetId: string | null;
  /** Whether notes management is enabled */
  enabled?: boolean;
  /**
   * Character set storage implementation.
   * Defaults to the real IndexedDB storage.
   * Pass a mock implementation for testing.
   */
  storage?: ICharacterSetStorage;
}

export interface UseNotesResult {
  /** List of notes for the current character set */
  notes: CharacterSetNote[];
  /** Whether notes are loading */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Add a new note */
  addNote: (text: string) => Promise<boolean>;
  /** Update a note's text */
  updateNote: (noteId: string, text: string) => Promise<boolean>;
  /** Delete a note */
  deleteNote: (noteId: string) => Promise<boolean>;
  /** Refresh the notes list */
  refresh: () => Promise<void>;
  /** Whether there are any notes */
  hasNotes: boolean;
}

/**
 * Hook for managing notes attached to character sets
 */
export function useNotes(options: UseNotesOptions): UseNotesResult {
  const { characterSetId, enabled = true, storage: providedStorage } = options;

  // Use injected storage or default storage
  const storage = useMemo(
    () => providedStorage ?? characterStorage,
    [providedStorage]
  );

  const [notes, setNotes] = useState<CharacterSetNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load notes when character set changes
  const refresh = useCallback(async () => {
    if (!characterSetId || !enabled) {
      setNotes([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const loaded = await storage.getNotes(characterSetId);
      // Sort by createdAt (newest first)
      const sorted = [...loaded].sort((a, b) => b.createdAt - a.createdAt);
      setNotes(sorted);
    } catch (e) {
      console.error("Failed to load notes:", e);
      setError(e instanceof Error ? e.message : "Failed to load notes");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [characterSetId, enabled, storage]);

  // Load notes on mount and when character set changes
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Add a new note
  const addNote = useCallback(
    async (text: string): Promise<boolean> => {
      if (!characterSetId) {
        setError("No character set ID");
        return false;
      }

      if (!text.trim()) {
        setError("Note text cannot be empty");
        return false;
      }

      try {
        await storage.addNote(characterSetId, text.trim());
        await refresh();
        return true;
      } catch (e) {
        console.error("Failed to add note:", e);
        setError(e instanceof Error ? e.message : "Failed to add note");
        return false;
      }
    },
    [characterSetId, refresh, storage]
  );

  // Update a note
  const updateNote = useCallback(
    async (noteId: string, text: string): Promise<boolean> => {
      if (!characterSetId) {
        setError("No character set ID");
        return false;
      }

      if (!text.trim()) {
        setError("Note text cannot be empty");
        return false;
      }

      try {
        await storage.updateNote(characterSetId, noteId, text.trim());
        await refresh();
        return true;
      } catch (e) {
        console.error("Failed to update note:", e);
        setError(e instanceof Error ? e.message : "Failed to update note");
        return false;
      }
    },
    [characterSetId, refresh, storage]
  );

  // Delete a note
  const deleteNote = useCallback(
    async (noteId: string): Promise<boolean> => {
      if (!characterSetId) {
        setError("No character set ID");
        return false;
      }

      try {
        await storage.deleteNote(characterSetId, noteId);
        await refresh();
        return true;
      } catch (e) {
        console.error("Failed to delete note:", e);
        setError(e instanceof Error ? e.message : "Failed to delete note");
        return false;
      }
    },
    [characterSetId, refresh, storage]
  );

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    refresh,
    hasNotes: notes.length > 0,
  };
}
