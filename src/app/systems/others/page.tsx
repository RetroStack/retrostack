import { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/PlaceholderPage";

export const metadata: Metadata = {
  title: "Other Systems - RetroStack",
  description: "Mechanical calculators, peripheral devices, and other vintage computing artifacts.",
};

export default function OthersPage() {
  return (
    <PlaceholderPage
      title="Other Systems"
      description="Explore mechanical calculators, vintage peripheral devices, and other computing artifacts that shaped the history of technology."
      backLink="/systems"
      backLabel="Back to Systems"
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      }
    />
  );
}
