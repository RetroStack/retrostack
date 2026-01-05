"use client";

import { MakerSystemSelect } from "./MakerSystemSelect";

export interface ImportWizardStep2Props {
  /** Current metadata values */
  metadata: {
    name: string;
    description: string;
    source: string;
    maker: string;
    system: string;
  };
  /** Callback when any field changes */
  onChange: (field: keyof ImportWizardStep2Props["metadata"], value: string) => void;
}

/**
 * Step 2: Metadata entry (name, description, source, maker, system)
 */
export function ImportWizardStep2({
  metadata,
  onChange,
}: ImportWizardStep2Props) {
  const inputClasses = `
    w-full px-3 py-2 bg-retro-navy/50 border border-retro-grid/50 rounded-lg
    text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-retro-cyan/50
    transition-colors
  `;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-medium text-white mb-2">
          Character Set Details
        </h2>
        <p className="text-sm text-gray-400">
          Add information about your character set
        </p>
      </div>

      {/* Name field - required */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Name <span className="text-retro-pink">*</span>
        </label>
        <input
          type="text"
          value={metadata.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="e.g., Custom C64 Characters"
          className={inputClasses}
        />
        <p className="text-xs text-gray-500 mt-1">
          Give your character set a memorable name
        </p>
      </div>

      {/* Description field - optional */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Description
        </label>
        <textarea
          value={metadata.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Optional description of the character set..."
          rows={3}
          className={`${inputClasses} resize-none`}
        />
      </div>

      {/* Maker and System fields */}
      <MakerSystemSelect
        maker={metadata.maker}
        system={metadata.system}
        onMakerChange={(value) => onChange("maker", value)}
        onSystemChange={(value) => onChange("system", value)}
      />

      {/* Source field */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Source / Author
        </label>
        <input
          type="text"
          value={metadata.source}
          onChange={(e) => onChange("source", e.target.value)}
          placeholder="e.g., Original ROM, Your name, Website URL..."
          className={inputClasses}
        />
        <p className="text-xs text-gray-500 mt-1">
          Credit the original source or leave empty for &quot;yourself&quot;
        </p>
      </div>
    </div>
  );
}
