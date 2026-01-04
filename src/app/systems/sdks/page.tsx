import { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/PlaceholderPage";

export const metadata: Metadata = {
  title: "SDKs - RetroStack",
  description: "Software development kits for vintage computing platforms.",
};

export default function SDKsPage() {
  return (
    <PlaceholderPage
      title="SDKs"
      description="Software development kits designed for vintage computing platforms. Build software for classic systems using modern development tools and workflows."
      backLink="/systems"
      backLabel="Back to Systems"
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      }
    />
  );
}
