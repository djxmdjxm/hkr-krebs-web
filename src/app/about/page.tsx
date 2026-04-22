import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About – KIKA",
};

const BUILD_VERSION = process.env.BUILD_VERSION ?? "–";

const FORMATS = [
  { id: "oBDS 3.0.4_RKI", label: "oBDS 3.0.4_RKI", desc: "Onkologischer Basisdatensatz, RKI-Profil, Version 3.0.4" },
  { id: "oBDS 3.0.0.8a_RKI", label: "oBDS 3.0.0.8a_RKI", desc: "Onkologischer Basisdatensatz, RKI-Profil, Version 3.0.0.8a" },
];

const STEPS = [
  {
    n: 1,
    title: "XML prüfen",
    text: "Stellen Sie sicher, dass Ihre Exportdatei dem oBDS-RKI-Format entspricht. Bei Upload-Fehlern zeigt KIKA den genauen XML-Pfad und die Abweichung an.",
  },
  {
    n: 2,
    title: "Daten hochladen",
    text: 'Laden Sie eine oder mehrere XML-Dateien über die Upload-Seite hoch. Der Einzelimport eignet sich für Tests, der Massenimport für den regulären Datentransfer. Fehlertolerante Prüfung: Kleinere Abweichungen (z. B. ungültige Code-Werte) werden importiert und als Warnungen protokolliert.',
  },
  {
    n: 3,
    title: "In der R-Umgebung analysieren",
    text: 'Öffnen Sie die R-Umgebung über den Button oben rechts. Die vorbereiteten Skripte (analyse.R, karte_kreise.R) greifen direkt auf die importierte Datenbank zu.',
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">
      {/* Was ist KIKA */}
      <section>
        <h1 className="text-2xl font-bold mb-3" style={{ color: "#003063" }}>
          Was ist KIKA?
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "#303030" }}>
          KIKA (Krebsregister Import- und Karten-Applikation) ist eine webbasierte Plattform
          des Hamburgischen Krebsregisters für den strukturierten Import und die explorative
          Analyse onkologischer Meldedaten. Die Anwendung wird lokal in der gesicherten
          Infrastruktur der Krebsregister betrieben — ein Internetzugang ist im laufenden
          Betrieb nicht erforderlich.
        </p>
      </section>

      {/* Unterstützte Formate */}
      <section>
        <h2 className="text-base font-semibold mb-3" style={{ color: "#003063" }}>
          Unterstützte Importformate
        </h2>
        <div className="space-y-2">
          {FORMATS.map((f) => (
            <div
              key={f.id}
              className="flex items-start gap-3 rounded-lg px-4 py-3 text-sm"
              style={{ backgroundColor: "#F2F5F7", borderLeft: "3px solid #003063" }}
            >
              <span className="font-mono font-semibold shrink-0" style={{ color: "#003063" }}>
                {f.label}
              </span>
              <span style={{ color: "#505050" }}>{f.desc}</span>
            </div>
          ))}
        </div>
        <p className="text-xs mt-2" style={{ color: "#909090" }}>
          Dateien mit geringfügigen Schema-Abweichungen (z. B. unbekannte Code-Werte) werden
          importiert und mit Warnungen versehen, damit die Datenqualität nachvollzogen werden kann.
        </p>
      </section>

      {/* Kurzanleitung */}
      <section>
        <h2 className="text-base font-semibold mb-4" style={{ color: "#003063" }}>
          Kurzanleitung
        </h2>
        <ol className="space-y-4">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-4">
              <span
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: "#003063" }}
              >
                {s.n}
              </span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#003063" }}>
                  {s.title}
                </p>
                <p className="text-sm mt-0.5 leading-relaxed" style={{ color: "#505050" }}>
                  {s.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Ansprechpartner */}
      <section>
        <h2 className="text-base font-semibold mb-3" style={{ color: "#003063" }}>
          Ansprechpartner &amp; Support
        </h2>
        <div
          className="rounded-lg px-4 py-3 text-sm space-y-1"
          style={{ backgroundColor: "#F2F5F7" }}
        >
          <p style={{ color: "#303030" }}>
            Bei technischen Fragen oder Problemen mit dem Import wenden Sie sich bitte an:
          </p>
          <p>
            <a
              href="mailto:christopher.mangels@innopard.com"
              className="font-medium underline"
              style={{ color: "#003063" }}
            >
              christopher.mangels@innopard.com
            </a>
          </p>
        </div>
      </section>

      {/* Build-Version */}
      <section className="border-t pt-6" style={{ borderColor: "#D8D8D8" }}>
        <p className="text-xs" style={{ color: "#909090" }}>
          Build-Version:{" "}
          <span className="font-mono">{BUILD_VERSION}</span>
        </p>
      </section>
    </div>
  );
}
