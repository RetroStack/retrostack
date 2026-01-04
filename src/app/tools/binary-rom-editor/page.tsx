import { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/PlaceholderPage";

export const metadata: Metadata = {
  title: "Binary ROM Editor - RetroStack",
  description: "Hex editor for ROM images with disassembly views and patching capabilities.",
};

export default function BinaryROMEditorPage() {
  return (
    <PlaceholderPage
      title="Binary ROM Editor"
      description="A powerful hex editor designed for ROM images. Features include disassembly views, search and replace, checksum calculation, and patching capabilities for vintage system ROMs."
      backLink="/tools"
      backLabel="Back to Tools"
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      }
    />
  );
}
