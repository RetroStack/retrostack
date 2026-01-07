"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { NeonText } from "@/components/effects/NeonText";

interface ImportOption {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: "cyan" | "pink" | "purple" | "violet";
}

const IMPORT_OPTIONS: ImportOption[] = [
  {
    title: "Binary ROM File",
    description: "Import from a raw binary character ROM dump file.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    href: "/tools/character-rom-editor/import/binary",
    color: "cyan",
  },
  {
    title: "Image Grid",
    description: "Extract characters from a PNG image with a character grid.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    href: "/tools/character-rom-editor/import/image",
    color: "pink",
  },
  {
    title: "Font File",
    description: "Rasterize characters from TTF, OTF, or WOFF font files.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 6h16M12 6v14"
        />
      </svg>
    ),
    href: "/tools/character-rom-editor/import/font",
    color: "cyan",
  },
  {
    title: "Code / Text",
    description: "Paste byte arrays from C, JavaScript, or Assembly code.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    href: "/tools/character-rom-editor/import/text",
    color: "violet",
  },
];

const colorClasses = {
  cyan: {
    border: "hover:border-retro-cyan",
    bg: "hover:bg-retro-cyan/5",
    icon: "text-retro-cyan",
    iconBg: "bg-retro-cyan/20",
  },
  pink: {
    border: "hover:border-retro-pink",
    bg: "hover:bg-retro-pink/5",
    icon: "text-retro-pink",
    iconBg: "bg-retro-pink/20",
  },
  purple: {
    border: "hover:border-retro-purple",
    bg: "hover:bg-retro-purple/5",
    icon: "text-retro-purple",
    iconBg: "bg-retro-purple/20",
  },
  violet: {
    border: "hover:border-retro-violet",
    bg: "hover:bg-retro-violet/5",
    icon: "text-retro-violet",
    iconBg: "bg-retro-violet/20",
  },
};

/**
 * Import Hub - Selection page for choosing import type
 */
export function ImportHubView() {
  return (
    <div className="min-h-screen flex flex-col safe-top">
      <Header />

      <main className="flex-1 bg-retro-dark pt-24 pb-12">
        <Container size="default">
          {/* Page header */}
          <div className="mb-8">
            <Link
              href="/tools/character-rom-editor"
              className="text-xs text-gray-500 hover:text-retro-cyan transition-colors mb-2 inline-flex items-center gap-1"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Library
            </Link>
            <h1 className="text-2xl sm:text-3xl font-display">
              <NeonText color="cyan">Import Character Set</NeonText>
            </h1>
            <p className="text-gray-400 mt-2">
              Choose how you want to import your character set
            </p>
          </div>

          {/* Import options grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {IMPORT_OPTIONS.map((option) => {
              const colors = colorClasses[option.color];
              return (
                <Link
                  key={option.href}
                  href={option.href}
                  className={`
                    card-retro p-6 transition-all group
                    border border-retro-grid/50
                    ${colors.border} ${colors.bg}
                  `}
                >
                  <div
                    className={`
                    w-14 h-14 rounded-lg flex items-center justify-center mb-4
                    ${colors.iconBg}
                  `}
                  >
                    <span className={colors.icon}>{option.icon}</span>
                  </div>
                  <h2 className="text-lg font-medium text-gray-200 mb-2 group-hover:text-white transition-colors">
                    {option.title}
                  </h2>
                  <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                    {option.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm text-gray-600 group-hover:text-gray-400 transition-colors">
                    <span>Get started</span>
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
