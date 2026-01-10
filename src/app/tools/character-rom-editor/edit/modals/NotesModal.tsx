"use client";
/* eslint-disable react-hooks/set-state-in-effect -- Modal state reset on open/close is intentional */

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Modal, ModalHeader, ModalContent } from "@/components/ui/Modal";
import { CharacterSetNote } from "@/lib/character-editor/types";
import { formatTimestamp } from "@/lib/character-editor/utils";

export interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: CharacterSetNote[];
  loading: boolean;
  error: string | null;
  characterSetName: string;
  onAdd: (text: string) => Promise<boolean>;
  onUpdate: (noteId: string, text: string) => Promise<boolean>;
  onDelete: (noteId: string) => Promise<boolean>;
}

/**
 * Modal for managing notes attached to a character set
 */
export function NotesModal({
  isOpen,
  onClose,
  notes,
  loading,
  error,
  characterSetName,
  onAdd,
  onUpdate,
  onDelete,
}: NotesModalProps) {
  const [newNoteText, setNewNoteText] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setNewNoteText("");
      setEditingId(null);
      setConfirmDeleteId(null);
    }
  }, [isOpen]);

  // Handle add new note
  const handleAdd = useCallback(async () => {
    if (!newNoteText.trim()) return;

    setSaving(true);
    const success = await onAdd(newNoteText.trim());
    setSaving(false);

    if (success) {
      setNewNoteText("");
    }
  }, [newNoteText, onAdd]);

  // Handle start editing
  const handleStartEdit = useCallback((note: CharacterSetNote) => {
    setEditingId(note.id);
    setEditingText(note.text);
    setConfirmDeleteId(null);
  }, []);

  // Handle finish editing
  const handleFinishEdit = useCallback(async () => {
    if (editingId && editingText.trim()) {
      await onUpdate(editingId, editingText.trim());
    }
    setEditingId(null);
    setEditingText("");
  }, [editingId, editingText, onUpdate]);

  // Handle cancel editing
  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingText("");
  }, []);

  // Handle delete
  const handleDelete = useCallback(
    async (noteId: string) => {
      await onDelete(noteId);
      setConfirmDeleteId(null);
    },
    [onDelete]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" maxHeight="80vh">
      <ModalHeader onClose={onClose} showCloseButton>
        <div>
          <h2 className="text-lg font-medium text-white">Notes</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {notes.length} note{notes.length !== 1 ? "s" : ""} for {characterSetName}
          </p>
        </div>
      </ModalHeader>

      <ModalContent className="p-4">
        {/* Add new note form */}
        <div className="mb-4 p-3 bg-retro-dark/50 rounded border border-retro-grid/30">
          <label className="block text-xs text-gray-400 mb-1">Add New Note</label>
          <textarea
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Type your note here..."
            className="w-full px-2 py-1.5 bg-retro-dark border border-retro-grid/50 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-retro-cyan resize-none"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey && newNoteText.trim()) {
                handleAdd();
              }
            }}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">Ctrl+Enter to save</span>
            <Button
              onClick={handleAdd}
              disabled={!newNoteText.trim() || saving || !!error}
              variant="cyan"
              size="sm"
            >
              {saving ? "Adding..." : "Add Note"}
            </Button>
          </div>
        </div>

        {/* Notes list */}
        {error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-center">
            <svg
              className="w-8 h-8 mx-auto mb-2 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm text-red-400 mb-1">Failed to load notes</p>
            <p className="text-xs text-gray-500">{error}</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-retro-cyan border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <p className="text-sm">No notes yet</p>
            <p className="text-xs mt-1">Add a note to keep track of your work</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-3 rounded border bg-retro-dark/30 border-retro-grid/30"
              >
                {editingId === note.id ? (
                  // Edit mode
                  <div>
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full px-2 py-1.5 bg-retro-dark border border-retro-cyan rounded text-sm text-white focus:outline-none resize-none"
                      rows={3}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.ctrlKey) {
                          handleFinishEdit();
                        } else if (e.key === "Escape") {
                          handleCancelEdit();
                        }
                      }}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button onClick={handleCancelEdit} variant="ghost" size="sm">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleFinishEdit}
                        disabled={!editingText.trim()}
                        variant="cyan"
                        size="sm"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <p className="text-sm text-gray-200 whitespace-pre-wrap">{note.text}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-retro-grid/20">
                      <div className="text-xs text-gray-500">
                        <span>Created {formatTimestamp(note.createdAt)}</span>
                        {note.updatedAt !== note.createdAt && (
                          <span className="ml-2">
                            (edited {formatTimestamp(note.updatedAt)})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(note)}
                          className="p-1 text-gray-500 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        {confirmDeleteId === note.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(note.id)}
                              className="px-2 py-0.5 text-xs bg-red-500/20 border border-red-500 rounded text-red-400 hover:bg-red-500/30"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-0.5 text-xs border border-retro-grid/50 rounded text-gray-400 hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(note.id)}
                            className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
