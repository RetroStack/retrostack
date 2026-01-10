/**
 * Transform Preview Components
 *
 * Mini character preview components for transform tooltips.
 * Components:
 * - MiniPreview: Single character preview at small scale
 * - TransformPreviewContent: Before/after comparison layout
 *
 * Used in TransformToolbar to show the effect of transforms
 * before applying them.
 *
 * @module components/character-editor/editor/TransformPreview
 */
"use client";

/**
 * Mini character preview for tooltip display
 */
export function MiniPreview({
  pixels,
  label,
  foregroundColor = "#ffffff",
  backgroundColor = "#000000",
}: {
  pixels: boolean[][];
  label: string;
  foregroundColor?: string;
  backgroundColor?: string;
}) {
  const height = pixels.length;
  const width = pixels[0]?.length || 0;
  const scale = 3; // Small scale for tooltip

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[9px] text-gray-400 uppercase">{label}</span>
      <div
        className="border border-gray-600"
        style={{
          width: width * scale,
          height: height * scale,
          display: "grid",
          gridTemplateColumns: `repeat(${width}, ${scale}px)`,
          gridTemplateRows: `repeat(${height}, ${scale}px)`,
        }}
      >
        {pixels.flat().map((isOn, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: isOn ? foregroundColor : backgroundColor,
              width: scale,
              height: scale,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Transform preview tooltip content showing before/after comparison
 */
export function TransformPreviewContent({
  before,
  after,
  label,
  shortcut,
}: {
  before: boolean[][];
  after: boolean[][];
  label: string;
  shortcut?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 p-1">
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium">{label}</span>
        {shortcut && (
          <span className="text-gray-400 font-mono text-[10px] bg-gray-700/50 px-1.5 py-0.5 rounded">
            {shortcut}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <MiniPreview pixels={before} label="Before" />
        <span className="text-gray-500">→</span>
        <MiniPreview pixels={after} label="After" />
      </div>
    </div>
  );
}
