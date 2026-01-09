"use client";

import { useState, useCallback } from "react";
import { AnchorPoint } from "@/lib/character-editor/types";
import { AnchorPositionGrid } from "@/components/character-editor/selectors/AnchorPositionGrid";
import { Modal, ModalContent, ModalActions } from "@/components/ui/Modal";

export interface ResizeModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Current width */
  currentWidth: number;
  /** Current height */
  currentHeight: number;
  /** Callback when resize is applied */
  onResize: (width: number, height: number, anchor: AnchorPoint) => void;
}

/**
 * Modal for resizing character dimensions with anchor point selection
 */
export function ResizeModal({
  isOpen,
  onClose,
  currentWidth,
  currentHeight,
  onResize,
}: ResizeModalProps) {
  const [width, setWidth] = useState(currentWidth);
  const [height, setHeight] = useState(currentHeight);
  const [anchor, setAnchor] = useState<AnchorPoint>("tl");

  // Apply resize
  const handleApply = useCallback(() => {
    if (width > 0 && height > 0) {
      onResize(width, height, anchor);
      onClose();
    }
  }, [width, height, anchor, onResize, onClose]);

  const hasChanges = width !== currentWidth || height !== currentHeight;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleApply}
      confirmOnEnter
      size="sm"
    >
      <ModalContent>
        <h2 className="text-lg font-medium text-white mb-4">Resize Characters</h2>

        {/* Dimension inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Width</label>
            <input
              type="number"
              min={1}
              max={32}
              value={width}
              onChange={(e) => setWidth(Math.max(1, Math.min(32, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 bg-retro-dark border border-retro-grid/50 rounded text-sm text-white focus:outline-none focus:border-retro-cyan"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Height</label>
            <input
              type="number"
              min={1}
              max={32}
              value={height}
              onChange={(e) => setHeight(Math.max(1, Math.min(32, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 bg-retro-dark border border-retro-grid/50 rounded text-sm text-white focus:outline-none focus:border-retro-cyan"
            />
          </div>
        </div>

        {/* Anchor position grid */}
        <div className="mb-6">
          <AnchorPositionGrid
            value={anchor}
            onChange={setAnchor}
            description="Select where to anchor existing content when resizing"
          />
        </div>

        {/* Info text - always visible with consistent height */}
        <p className="text-xs text-gray-500 mb-4 text-center h-4">
          {!hasChanges
            ? "No changes"
            : width > currentWidth || height > currentHeight
            ? "New pixels will be added with background color"
            : width < currentWidth || height < currentHeight
            ? "Some pixels will be cropped"
            : "No changes"}
        </p>
      </ModalContent>

      <ModalActions
        onCancel={onClose}
        onConfirm={handleApply}
        confirmDisabled={!hasChanges || width < 1 || height < 1}
      />
    </Modal>
  );
}
