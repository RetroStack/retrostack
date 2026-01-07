import { Metadata } from "next";
import { BinaryImportView } from "./BinaryImportView";

export const metadata: Metadata = {
  title: "Import Binary ROM - RetroStack",
  description: "Import binary character ROM files and configure dimensions and format settings.",
};

export default function BinaryImportPage() {
  return <BinaryImportView />;
}
