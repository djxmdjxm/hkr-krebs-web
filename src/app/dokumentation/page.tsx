import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dokumentation – KIKA",
};

const cards = [
  {
    href:  "/dokumentation/schema",
    icon:  "🗄️",
    title: "Datenbank-Schema",
    desc:  "Alle Tabellen, Felder, Beziehungen und Enum-Werte der Krebs-DB",
  },
  {
    href:  "/dokumentation/forscher",
    icon:  "🔬",
    title: "Forscher-Handbuch",
    desc:  "Daten erkunden, Projekte anlegen, R-Pakete, Skripte einbringen",
  },
  {
    href:  "/dokumentation/it",
    icon:  "🛠️",
    title: "IT-Handbuch",
    desc:  "Installation, Anpassungen, Backup, Update, Troubleshooting",
  },
];

export default function DokumentationIndex() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-3 text-center" style={{ color: "#003063" }}>
        Dokumentation
      </h1>
      <p className="text-sm text-center mb-10" style={{ color: "#505050" }}>
        Alles, was du zur Arbeit mit KIKA brauchst — als Forscher, als Administrator
        oder beim Schreiben eigener Skripte.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map(c => (
          <Link
            key={c.href}
            href={c.href}
            className="block rounded-2xl p-6 no-underline border transition-shadow"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor:     "#D8D8D8",
              boxShadow:       "0 1px 4px rgba(0,0,0,0.04)",
            }}
            onMouseOver={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; }}
            onMouseOut={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{c.icon}</div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "#003063" }}>{c.title}</h2>
            <p className="text-sm" style={{ color: "#505050" }}>{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
