"use client";

import { useState, useEffect, useCallback } from "react";
import {
  KeyboardShortcut,
  formatShortcut,
} from "@/hooks/character-editor/useKeyboardShortcuts";

export interface KeyboardShortcutsHelpProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** List of shortcuts to display */
  shortcuts: KeyboardShortcut[];
}

/**
 * Modal displaying keyboard shortcuts help
 */
export function KeyboardShortcutsHelp({
  isOpen,
  onClose,
  shortcuts,
}: KeyboardShortcutsHelpProps) {
  // Close on escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Group shortcuts by context
  const groupedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      const context = shortcut.context || "General";
      if (!acc[context]) {
        acc[context] = [];
      }
      acc[context].push(shortcut);
      return acc;
    },
    {} as Record<string, KeyboardShortcut[]>
  );

  // Order contexts
  const contextOrder = ["Editor", "Sidebar", "Global"];
  const sortedContexts = Object.keys(groupedShortcuts).sort((a, b) => {
    const aIndex = contextOrder.indexOf(a);
    const bIndex = contextOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-retro-navy border border-retro-grid/50 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-retro-grid/30">
          <h2 className="text-lg font-medium text-white">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-6">
          {sortedContexts.map((context) => (
            <div key={context}>
              <h3 className="text-sm font-medium text-retro-cyan mb-2">
                {context}
              </h3>
              <div className="space-y-1">
                {groupedShortcuts[context].map((shortcut, index) => (
                  <div
                    key={`${context}-${index}`}
                    className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-retro-purple/10"
                  >
                    <span className="text-sm text-gray-300">
                      {shortcut.description}
                    </span>
                    <kbd className="px-2 py-0.5 text-xs font-mono bg-retro-dark border border-retro-grid/50 rounded text-gray-400">
                      {formatShortcut(shortcut)}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-retro-grid/30 text-center">
          <span className="text-xs text-gray-500">
            Press <kbd className="px-1 py-0.5 bg-retro-dark border border-retro-grid/50 rounded text-gray-400">Esc</kbd> or <kbd className="px-1 py-0.5 bg-retro-dark border border-retro-grid/50 rounded text-gray-400">?</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
