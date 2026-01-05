import { Metadata } from "next";
import { Suspense } from "react";
import { ExportView } from "./ExportView";

export const metadata: Metadata = {
  title: "Export Character ROM - RetroStack",
  description: "Export your character set to binary ROM format.",
};

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-retro-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-retro-cyan border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    </div>
  );
}

export default function ExportPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ExportView />
    </Suspense>
  );
}
