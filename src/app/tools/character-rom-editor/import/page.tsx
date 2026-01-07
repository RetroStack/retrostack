import { Metadata } from "next";
import { ImportHubView } from "./ImportHubView";

export const metadata: Metadata = {
  title: "Import Character Set - RetroStack",
  description: "Import character sets from binary ROM files, images, fonts, or code.",
};

export default function ImportPage() {
  return <ImportHubView />;
}
