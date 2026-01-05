"use client";

import { useState, useCallback } from "react";

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
  // Use state for all values to ensure proper re-renders
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initialState);

  const setState = useCallback(
    (newState: T) => {
      setPast((prevPast) => {
        // Add current state to past
        let newPast = [...prevPast, present];
        // Limit history if needed
        if (newPast.length > maxHistory) {
          newPast = newPast.slice(-maxHistory);
        }
        return newPast;
      });
      // Clear future (new branch in history)
      setFuture([]);
      // Set new present
      setPresent(newState);
    },
    [present, maxHistory]
  );

  const resetState = useCallback((newState: T) => {
    // Reset without adding to history
    setPast([]);
    setFuture([]);
    setPresent(newState);
  }, []);

  const undo = useCallback(() => {
    setPast((prevPast) => {
      if (prevPast.length === 0) return prevPast;

      const previous = prevPast[prevPast.length - 1];
      const newPast = prevPast.slice(0, -1);

      // Move present to future
      setFuture((prevFuture) => [present, ...prevFuture]);
      setPresent(previous);

      return newPast;
    });
  }, [present]);

  const redo = useCallback(() => {
    setFuture((prevFuture) => {
      if (prevFuture.length === 0) return prevFuture;

      const next = prevFuture[0];
      const newFuture = prevFuture.slice(1);

      // Move present to past
      setPast((prevPast) => [...prevPast, present]);
      setPresent(next);

      return newFuture;
    });
  }, [present]);

  const clearHistory = useCallback(() => {
    setPast([]);
    setFuture([]);
  }, []);

  return {
    state: present,
    setState,
    resetState,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    historyLength: past.length + future.length,
    clearHistory,
  };
}

/**
 * Deep clone helper for state snapshots
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
