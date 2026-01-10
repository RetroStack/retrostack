"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export interface UseEditorReturnOptions {
  /** Default back URL when not from editor. Default: '/tools/character-rom-editor' */
  defaultBackUrl?: string;
  /** Default back label when not from editor. Default: 'Back to Library' */
  defaultBackLabel?: string;
}

export interface UseEditorReturnResult {
  /** URL to navigate back to */
  backUrl: string;
  /** Label text for the back link */
  backLabel: string;
  /** Whether the user navigated from the editor */
  isFromEditor: boolean;
  /** The character set ID being edited (if from editor) */
  editId: string | null;
  /** Build URL search params string for passing to child routes */
  buildEditorReturnParams: () => string;
}

const DEFAULT_BACK_URL = "/tools/character-rom-editor";
const DEFAULT_BACK_LABEL = "Back to Library";
const EDITOR_BACK_LABEL = "Back to Editor";

/**
 * Hook for managing return-to-editor navigation
 *
 * Reads `from` and `editId` from URL search params to determine
 * if the user came from the editor. Provides navigation helpers
 * for consistent back button behavior.
 *
 * @param options - Optional configuration for default back URL and label
 * @returns Navigation helpers including backUrl, backLabel, and param builder
 *
 * @example
 * ```tsx
 * const { backUrl, backLabel } = useEditorReturn();
 * return <Link href={backUrl}>{backLabel}</Link>;
 * ```
 */
export function useEditorReturn(
  options?: UseEditorReturnOptions
): UseEditorReturnResult {
  const searchParams = useSearchParams();

  const from = searchParams.get("from");
  const editId = searchParams.get("editId");

  const isFromEditor = from === "editor" && editId !== null;

  const backUrl = useMemo(() => {
    if (isFromEditor && editId) {
      return `/tools/character-rom-editor/edit?id=${editId}`;
    }
    return options?.defaultBackUrl ?? DEFAULT_BACK_URL;
  }, [isFromEditor, editId, options?.defaultBackUrl]);

  const backLabel = useMemo(() => {
    if (isFromEditor) {
      return EDITOR_BACK_LABEL;
    }
    return options?.defaultBackLabel ?? DEFAULT_BACK_LABEL;
  }, [isFromEditor, options?.defaultBackLabel]);

  const buildEditorReturnParams = useMemo(() => {
    return () => {
      if (isFromEditor && editId) {
        return `from=editor&editId=${editId}`;
      }
      return "";
    };
  }, [isFromEditor, editId]);

  return {
    backUrl,
    backLabel,
    isFromEditor,
    editId,
    buildEditorReturnParams,
  };
}
