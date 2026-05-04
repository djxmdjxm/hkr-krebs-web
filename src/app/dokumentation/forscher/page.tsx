import { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import HandbookView from "@/components/HandbookView";

export const metadata: Metadata = {
  title: "Forscher-Handbuch – KIKA",
};

export default async function ForscherHandbuch() {
  const file = path.join(process.cwd(), "src", "content", "HANDBUCH-FORSCHER.md");
  const source = await fs.readFile(file, "utf-8");

  return (
    <HandbookView
      title="Forscher-Handbuch"
      emoji="🔬"
      source={source}
      downloadFilename="KIKA-Forscher-Handbuch.md"
    />
  );
}
