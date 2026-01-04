import { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/PlaceholderPage";

export const metadata: Metadata = {
  title: "Documentation - RetroStack",
  description: "Guides, manuals, and tutorials for building and programming vintage computer systems.",
};

export default function DocumentationPage() {
  return (
    <PlaceholderPage
      title="Documentation"
      description="Detailed guides, user manuals, programming references, and tutorials for building and working with vintage computer systems and our open-source projects."
      backLink="/resources"
      backLabel="Back to Resources"
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      }
    />
  );
}
