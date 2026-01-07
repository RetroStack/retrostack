import { Metadata } from "next";
import { TextImportView } from "./TextImportView";

export const metadata: Metadata = {
  title: "Import from Code - RetroStack",
  description: "Import character sets from pasted byte arrays in C, JavaScript, or Assembly format.",
};

export default function TextImportPage() {
  return <TextImportView />;
}
