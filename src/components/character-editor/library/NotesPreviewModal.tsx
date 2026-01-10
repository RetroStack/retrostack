"use client";

import { createPortal } from "react-dom";
import { Modal, ModalHeader, ModalContent } from "@/components/ui/Modal";
import { CharacterSetNote } from "@/lib/character-editor/types";
import { formatTimestamp } from "@/lib/character-editor/utils";

export interface NotesPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: CharacterSetNote[];
  characterSetName: string;
}

/**
 * Read-only modal for previewing notes attached to a character set
 * Uses a portal to render at document body level to avoid z-index issues
 */
export function NotesPreviewModal({
  isOpen,
  onClose,
  notes,
  characterSetName,
}: NotesPreviewModalProps) {
  // Don't render on server or if not open
  if (typeof document === "undefined" || !isOpen) return null;

  const modalContent = (
    <Modal isOpen={isOpen} onClose={onClose} size="md" maxHeight="70vh">
      <ModalHeader onClose={onClose} showCloseButton>
        <div>
          <h2 className="text-lg font-medium text-white">Notes</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {notes.length} note{notes.length !== 1 ? "s" : ""} for {characterSetName}
          </p>
        </div>
      </ModalHeader>

      <ModalContent className="p-4">
        {notes.length === 0 ? (
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
            <p className="text-sm">No notes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-3 rounded border bg-retro-dark/30 border-retro-grid/30"
              >
                <p className="text-sm text-gray-200 whitespace-pre-wrap">{note.text}</p>
                <div className="mt-2 pt-2 border-t border-retro-grid/20 text-xs text-gray-500">
                  <span>Created {formatTimestamp(note.createdAt)}</span>
                  {note.updatedAt !== note.createdAt && (
                    <span className="ml-2">
                      (edited {formatTimestamp(note.updatedAt)})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ModalContent>
    </Modal>
  );

  return createPortal(modalContent, document.body);
}
