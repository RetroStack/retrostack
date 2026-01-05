import { Metadata } from "next";
import { ImportView } from "./ImportView";

export const metadata: Metadata = {
  title: "Import Character ROM - RetroStack",
  description: "Import binary character ROM files and configure dimensions and format settings.",
};

export default function ImportPage() {
  return <ImportView />;
}
