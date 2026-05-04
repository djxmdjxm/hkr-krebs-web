import { Metadata } from "next";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About – KIKA",
};

const BUILD_VERSION = process.env.BUILD_VERSION ?? "–";

export default function AboutPage() {
  return (
    <div className={styles.about}>
      <div className={styles.header}>
        <p className={styles.headerLabel}>Hamburgisches Krebsregister</p>
        <h1 className={styles.headerTitle}>KIKA</h1>
        <p className={styles.headerSubtitle}>KI in der Krebsregister-Datenanalyse</p>
      </div>

      <div className={styles.lead}>
        KIKA ist die interne Analyseplattform des Hamburgischen Krebsregisters für den
        strukturierten Import, die Qualitätsprüfung und die explorative Auswertung
        onkologischer Meldedaten. Die Anwendung läuft vollständig innerhalb der gesicherten
        Registerinfrastruktur — ein Internetzugang ist im Betrieb nicht erforderlich.
      </div>

      <p className={styles.sectionTitle}>Kernfunktionen</p>
      <div className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h10v2H3V3zm0 4h10v2H3V7zm0 4h6v2H3v-2z" fill="#005CA9" />
            </svg>
          </div>
          <p className={styles.featureTitle}>XML-Import</p>
          <p className={styles.featureDesc}>
            Einzel- und Massenimport von oBDS-XML-Dateien mit automatischer Schema-Prüfung
            und Fehlerprotokoll.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="5" stroke="#005CA9" strokeWidth="1.5" fill="none" />
              <path d="M8 5v3l2 2" stroke="#005CA9" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className={styles.featureTitle}>Qualitätsprüfung</p>
          <p className={styles.featureDesc}>
            Kleinere Schemabweichungen werden toleriert und als Warnungen protokolliert,
            ohne den Import zu blockieren.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="10" width="3" height="4" rx="1" fill="#005CA9" />
              <rect x="6.5" y="7" width="3" height="7" rx="1" fill="#005CA9" opacity="0.7" />
              <rect x="11" y="4" width="3" height="10" rx="1" fill="#005CA9" opacity="0.4" />
            </svg>
          </div>
          <p className={styles.featureTitle}>R-Auswertung</p>
          <p className={styles.featureDesc}>
            Integrierte R-Umgebung mit vorbereiteten Analyseskripten, die direkt auf die
            importierte Datenbank zugreifen.
          </p>
        </div>

      </div>

      <p className={styles.sectionTitle}>Unterstützte Importformate</p>
      <div className={styles.formats}>
        <div className={styles.formatRow}>
          <span className={styles.formatBadge}>oBDS 3.0.4_RKI</span>
          <span className={styles.formatText}>
            Onkologischer Basisdatensatz, RKI-Profil, Version 3.0.4 — aktuell empfohlenes Format
          </span>
        </div>
        <div className={styles.formatRow}>
          <span className={styles.formatBadge}>oBDS 3.0.0.8a_RKI</span>
          <span className={styles.formatText}>
            Onkologischer Basisdatensatz, RKI-Profil, Version 3.0.0.8a — wird weiterhin unterstützt
          </span>
        </div>
      </div>

      <div className={styles.securityBox}>
        <div className={styles.securityIcon}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 2L3 5v4c0 3.31 2.56 6.41 6 7 3.44-.59 6-3.69 6-7V5L9 2z"
              stroke="#005CA9"
              strokeWidth="1.5"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M6.5 9l1.5 1.5 3-3"
              stroke="#005CA9"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p>
          <strong>Datenschutz &amp; Betrieb:</strong> KIKA wird ausschließlich auf der internen
          Infrastruktur des jeweiligen Landeskrebsregisters betrieben. Patientendaten verlassen
          zu keinem Zeitpunkt die gesicherte Registerumgebung. Ein aktiver Internetzugang ist
          für den regulären Betrieb nicht erforderlich.
        </p>
      </div>

      <p className={styles.sectionTitle}>Ansprechpartner</p>
      <div className={styles.contactGrid}>
        <div className={styles.contactCard}>
          <div className={styles.contactInner}>
            <div className={styles.avatar}>AS</div>
            <div>
              <p className={styles.contactName}>Dr. Annemarie Schultz</p>
              <p className={styles.contactRole}>Hamburgisches Krebsregister</p>
              <a href="mailto:annemarie.schultz@bwfg.hamburg.de" className={styles.contactEmail}>
                annemarie.schultz@bwfg.hamburg.de
              </a>
            </div>
          </div>
        </div>

        <div className={styles.contactCard}>
          <div className={styles.contactInner}>
            <div className={styles.avatar}>FP</div>
            <div>
              <p className={styles.contactName}>PD Dr. Frederik Peters</p>
              <p className={styles.contactRole}>Hamburgisches Krebsregister</p>
              <a href="mailto:frederik.peters@bwfg.hamburg.de" className={styles.contactEmail}>
                frederik.peters@bwfg.hamburg.de
              </a>
            </div>
          </div>
        </div>
      </div>

      <p className={styles.collabNote}>
        KIKA wurde in Kooperation mit der HAW Hamburg, Fachbereich Informatik, Leitung Prof. Kai von Luck entwickelt.
      </p>

      <div className={styles.footer}>
        <span className={styles.footerLeft}>© 2025 Hamburgisches Krebsregister</span>
        <span className={styles.footerBuild}>Build {BUILD_VERSION}</span>
      </div>
    </div>
  );
}
