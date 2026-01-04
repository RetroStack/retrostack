import { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/PlaceholderPage";

export const metadata: Metadata = {
  title: "Character ROM Editor - RetroStack",
  description: "Design and edit character sets for vintage display systems. Export directly to ROM format.",
};

export default function CharacterROMEditorPage() {
  return (
    <PlaceholderPage
      title="Character ROM Editor"
      description="Design and edit character sets for vintage display systems. Create custom fonts, modify existing character ROMs, and export directly to binary ROM format for burning."
      backLink="/tools"
      backLabel="Back to Tools"
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      }
    />
  );
}
