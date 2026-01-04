import { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/PlaceholderPage";

export const metadata: Metadata = {
  title: "Game Consoles - RetroStack",
  description: "Classic gaming console projects and hardware replicas.",
};

export default function GameConsolesPage() {
  return (
    <PlaceholderPage
      title="Game Consoles"
      description="Discover our collection of classic gaming console projects, from early home systems to arcade hardware. Each project includes complete schematics and build documentation."
      backLink="/systems"
      backLabel="Back to Systems"
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    />
  );
}
