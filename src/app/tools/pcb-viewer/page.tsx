import { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/PlaceholderPage";

export const metadata: Metadata = {
  title: "PCB Viewer - RetroStack",
  description: "Interactive PCB layout viewer for vintage computer boards with layer controls.",
};

export default function PCBViewerPage() {
  return (
    <PlaceholderPage
      title="PCB Viewer"
      description="View PCB layouts from our vintage computer projects. Toggle layers, highlight nets, measure distances, and export high-resolution images for reference."
      backLink="/tools"
      backLabel="Back to Tools"
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      }
    />
  );
}
