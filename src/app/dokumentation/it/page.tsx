import { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import HandbookView from "@/components/HandbookView";

export const metadata: Metadata = {
  title: "IT-Handbuch – KIKA",
};

export default async function ItHandbuch() {
  const file = path.join(process.cwd(), "src", "content", "HANDBUCH-IT.md");
  const source = await fs.readFile(file, "utf-8");

  return (
    <HandbookView
      title="IT-Handbuch"
      emoji="🛠️"
      source={source}
      downloadFilename="KIKA-IT-Handbuch.md"
    />
  );
}
