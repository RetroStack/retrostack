import { Metadata } from "next";
import { Suspense } from "react";
import { EditView } from "./EditView";

export const metadata: Metadata = {
  title: "Edit Character Set - RetroStack",
  description: "Edit character pixels in your character ROM. Rotate, shift, and transform characters.",
};

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-retro-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-retro-cyan border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-400">Loading editor...</span>
      </div>
    </div>
  );
}

export default function EditPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EditView />
    </Suspense>
  );
}
