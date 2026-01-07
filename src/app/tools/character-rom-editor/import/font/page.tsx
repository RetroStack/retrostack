import { Metadata } from "next";
import { FontImportView } from "./FontImportView";

export const metadata: Metadata = {
  title: "Import from Font - RetroStack",
  description: "Rasterize character sets from TTF, OTF, or WOFF font files.",
};

export default function FontImportPage() {
  return <FontImportView />;
}
