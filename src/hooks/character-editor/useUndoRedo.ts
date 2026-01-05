"use client";

import { useState, useCallback, useRef } from "react";

export interface UseUndoRedoResult<T> {
  /** Current state */
  state: T;
  /** Set new state (adds to history) */
  setState: (newState: T) => void;
  /** Reset state without adding to history */
  resetState: (newState: T) => void;
  /** Undo last change */
  undo: () => void;
  /** Redo last undone change */
  redo: () => void;
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Number of items in history */
  historyLength: number;
  /** Clear all history */
  clearHistory: () => void;
}

/**
 * Hook for unlimited undo/redo functionality
 *
 * @param initialState - Initial state value
 * @param maxHistory - Maximum history length (default: unlimited)
 */
export function useUndoRedo<T>(
  initialState: T,
  maxHistory: number = Infinity
): UseUndoRedoResult<T> {
  // Use refs to avoid unnecessary re-renders
  const pastRef = useRef<T[]>([]);
  const futureRef = useRef<T[]>([]);

  // Current state
  const [present, setPresent] = useState<T>(initialState);

  // Force re-render when history changes
  const [, forceUpdate] = useState({});

  const setState = useCallback(
    (newState: T) => {
      // Add current state to past
      pastRef.current = [...pastRef.current, present];

      // Limit history if needed
      if (pastRef.current.length > maxHistory) {
        pastRef.current = pastRef.current.slice(-maxHistory);
      }

      // Clear future (new branch in history)
      futureRef.current = [];

      // Set new present
      setPresent(newState);
      forceUpdate({});
    },
    [present, maxHistory]
  );

  const resetState = useCallback((newState: T) => {
    // Reset without adding to history
    pastRef.current = [];
    futureRef.current = [];
    setPresent(newState);
    forceUpdate({});
  }, []);

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;

    // Move present to future
    futureRef.current = [present, ...futureRef.current];

    // Pop from past
    const previous = pastRef.current[pastRef.current.length - 1];
    pastRef.current = pastRef.current.slice(0, -1);

    setPresent(previous);
    forceUpdate({});
  }, [present]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;

    // Move present to past
    pastRef.current = [...pastRef.current, present];

    // Pop from future
    const next = futureRef.current[0];
    futureRef.current = futureRef.current.slice(1);

    setPresent(next);
    forceUpdate({});
  }, [present]);

  const clearHistory = useCallback(() => {
    pastRef.current = [];
    futureRef.current = [];
    forceUpdate({});
  }, []);

  return {
    state: present,
    setState,
    resetState,
    undo,
    redo,
    canUndo: pastRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
    historyLength: pastRef.current.length + futureRef.current.length,
    clearHistory,
  };
}

/**
 * Deep clone helper for state snapshots
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
