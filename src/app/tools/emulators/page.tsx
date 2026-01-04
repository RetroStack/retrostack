import { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/PlaceholderPage";

export const metadata: Metadata = {
  title: "Emulators - RetroStack",
  description: "Browser-based emulators for Z80, 6502, and other vintage CPUs with debugging tools.",
};

export default function EmulatorsPage() {
  return (
    <PlaceholderPage
      title="Emulators"
      description="Full-featured browser-based emulators for vintage CPUs including Z80 and 6502. Includes step debugging, memory inspection, register views, and breakpoint support."
      backLink="/tools"
      backLabel="Back to Tools"
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      }
    />
  );
}
