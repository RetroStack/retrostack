import { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/PlaceholderPage";

export const metadata: Metadata = {
  title: "Assemblers - RetroStack",
  description: "Browser-based assemblers for Z80, 6502, and other vintage CPU architectures.",
};

export default function AssemblersPage() {
  return (
    <PlaceholderPage
      title="Assemblers"
      description="Write assembly code directly in your browser for vintage CPU architectures. Features syntax highlighting, error checking, symbol tables, and direct output to binary or hex formats."
      backLink="/tools"
      backLabel="Back to Tools"
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      }
    />
  );
}
