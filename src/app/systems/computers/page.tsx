import { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/PlaceholderPage";

export const metadata: Metadata = {
  title: "Computers - RetroStack",
  description: "Vintage computer replicas including TRS-80, Sorcerer, Apple I, and more classic systems.",
};

export default function ComputersPage() {
  return (
    <PlaceholderPage
      title="Computers"
      description="Explore our vintage computer replicas including the TRS-80, Exidy Sorcerer, Apple I, and other classic systems from the golden age of personal computing."
      backLink="/systems"
      backLabel="Back to Systems"
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      }
    />
  );
}
