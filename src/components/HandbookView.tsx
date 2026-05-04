"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { useMemo } from "react";

interface TocEntry { id: string; text: string; }

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äöüß]/g, c => ({ "ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss" }[c] ?? c))
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractToc(md: string): TocEntry[] {
  const lines = md.split("\n");
  const toc: TocEntry[] = [];
  let inFence = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) {
      const text = m[1].replace(/<a[^>]*>.*?<\/a>/g, "").trim();
      toc.push({ id: slugify(text), text });
    }
  }
  return toc;
}

interface Props {
  title: string;
  emoji: string;
  source: string;
  downloadFilename: string;
}

export default function HandbookView({ title, emoji, source, downloadFilename }: Props) {
  const toc = useMemo(() => extractToc(source), [source]);

  const handleDownload = () => {
    const blob = new Blob([source], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-semibold" style={{ color: "#003063" }}>
          <span className="mr-2">{emoji}</span>{title}
        </h1>
        <button
          onClick={handleDownload}
          className="px-4 py-2 rounded text-sm font-medium border transition-colors"
          style={{ color: "#003063", borderColor: "#003063", backgroundColor: "transparent" }}
          onMouseOver={e => { e.currentTarget.style.backgroundColor = "#F0F4FF"; }}
          onMouseOut={e => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          📄 Als Markdown herunterladen
        </button>
      </div>

      <div className="flex gap-8">
        {toc.length > 0 && (
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto pr-2">
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#909090" }}>
                Inhalt
              </p>
              <ul className="space-y-1.5 text-sm">
                {toc.map(e => (
                  <li key={e.id}>
                    <a
                      href={`#${e.id}`}
                      className="block py-0.5 hover:opacity-100 transition-opacity"
                      style={{ color: "#003063", opacity: 0.75 }}
                      onMouseOver={ev => { ev.currentTarget.style.opacity = "1"; }}
                      onMouseOut={ev => { ev.currentTarget.style.opacity = "0.75"; }}
                    >
                      {e.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}

        <article className="flex-1 min-w-0 handbook-prose">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug]}
          >
            {source}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
