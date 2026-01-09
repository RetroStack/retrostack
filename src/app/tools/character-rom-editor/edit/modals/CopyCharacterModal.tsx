"use client";

import { useState, useCallback, useEffect } from "react";
import { CharacterDisplay } from "@/components/character-editor/character/CharacterDisplay";
import { Character } from "@/lib/character-editor/types";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "@/components/ui/Modal";

export interface CopyCharacterModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Array of characters in the current set */
  characters: Character[];
  /** Currently selected index (to exclude from selection) */
  currentIndex: number;
  /** Callback when a character is selected to copy */
  onCopy: (sourceIndex: number) => void;
}

/**
 * Modal for copying a character from the current set to replace the selected character(s)
 */
export function CopyCharacterModal({
  isOpen,
  onClose,
  characters,
  currentIndex,
  onCopy,
}: CopyCharacterModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Reset selection when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional reset when modal closes
      setSelectedIndex(null);
    }
  }, [isOpen]);

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleCopy = useCallback(() => {
    if (selectedIndex !== null) {
      onCopy(selectedIndex);
      onClose();
    }
  }, [selectedIndex, onCopy, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleCopy}
      confirmOnEnter
      size="lg"
      maxHeight="70vh"
    >
      <ModalHeader>
        <h2 className="text-lg font-medium text-white">Copy Character</h2>
        <p className="text-xs text-gray-500 mt-1">
          Select a character to copy. It will replace the currently selected character(s).
        </p>
      </ModalHeader>

      <ModalContent scrollable>
        <div className="bg-black/30 rounded-lg p-3">
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))" }}>
            {characters.map((char, index) => {
              const isSelected = selectedIndex === index;
              const isCurrent = index === currentIndex;

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  disabled={isCurrent}
                  className={`
                    p-1.5 rounded border-2 transition-all relative
                    ${isSelected
                      ? "border-retro-cyan bg-retro-cyan/20"
                      : isCurrent
                      ? "border-retro-pink/30 bg-retro-pink/10 opacity-50 cursor-not-allowed"
                      : "border-transparent hover:border-retro-grid/50"
                    }
                  `}
                  title={isCurrent ? "Current selection" : `Character ${index}`}
                >
                  <CharacterDisplay
                    character={char}
                    mode="small"
                    smallScale={3}
                  />
                  {isCurrent && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[8px] text-retro-pink bg-retro-dark/80 px-1 rounded">
                        current
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {selectedIndex !== null && (
          <div className="text-xs text-gray-500 text-center mt-3">
            Character {selectedIndex} selected
          </div>
        )}
      </ModalContent>

      <ModalFooter className="flex justify-between">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm border border-retro-grid/50 rounded text-gray-400 hover:border-retro-grid hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCopy}
          disabled={selectedIndex === null}
          className="px-4 py-2 text-sm bg-retro-cyan/20 border border-retro-cyan rounded text-retro-cyan hover:bg-retro-cyan/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Copy
        </button>
      </ModalFooter>
    </Modal>
  );
}
