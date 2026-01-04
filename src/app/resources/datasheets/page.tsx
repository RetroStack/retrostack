import { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/PlaceholderPage";

export const metadata: Metadata = {
  title: "Datasheets - RetroStack",
  description: "Component datasheets for vintage ICs, CPUs, memory chips, and peripheral controllers.",
};

export default function DatasheetsPage() {
  return (
    <PlaceholderPage
      title="Datasheets"
      description="A comprehensive library of component datasheets for vintage ICs including CPUs (Z80, 6502, 8080), memory chips, peripheral controllers, and support logic."
      backLink="/resources"
      backLabel="Back to Resources"
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      }
    />
  );
}
