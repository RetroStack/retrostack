import { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/PlaceholderPage";

export const metadata: Metadata = {
  title: "Schematic Viewer - RetroStack",
  description: "Interactive viewer for vintage computer schematics with zoom and component highlighting.",
};

export default function SchematicViewerPage() {
  return (
    <PlaceholderPage
      title="Schematic Viewer"
      description="An interactive viewer for vintage computer schematics. Zoom, pan, search for components, highlight signal paths, and cross-reference with documentation."
      backLink="/tools"
      backLabel="Back to Tools"
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      }
    />
  );
}
