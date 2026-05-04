import Image from "next/image";
import { Metadata } from "next";
import PatientReportDoc from "@/components/db-docs/PatientRepotDoc";
import TnmDoc from "@/components/db-docs/TNMDoc";
import TumorReportDoc from "@/components/db-docs/TumorReportDoc";
import TumorHistologyDoc from "@/components/db-docs/TumorHistologyDoc";
import TumorReportBreastDoc from "@/components/db-docs/TumorReportBreastDoc";
import TumorReportColorectalDoc from "@/components/db-docs/TumorReportColorectalDoc";
import TumorReportProstateDoc from "@/components/db-docs/TumorReportProstateDoc";
import TumorReportMelanomaDoc from "@/components/db-docs/TumorReportMelanomaDoc";
import TumorSurgeryDoc from "@/components/db-docs/TumorSurgeryDoc";
import TumorRadiotherapyDoc from "@/components/db-docs/TumorRadiotherapyDoc";
import RadiotherapySessionDoc from "@/components/db-docs/RadiotherapySessionDoc";
import RadiotherapySessionPercutaneousDoc from "@/components/db-docs/RadiotherapySessionPercutaneous";
import RadiotherapySessionBrachytherapyDoc from "@/components/db-docs/RadiotherapySessionBrachytherapy";
import RadiotherapySessionMetabolicDoc from "@/components/db-docs/RadiotherapySessionMetabolicDoc";
import TumorSystemicTherapyDoc from "@/components/db-docs/TumorSystemicTherapy";
import TumorFollowUpDoc from "@/components/db-docs/TumorFollowUpDoc";

export const metadata: Metadata = {
  title: "Datenbank-Schema – KIKA",
};

export default function SchemaPage() {
  return (
    <>
      <div className="mb-12 py-12 px-4 sm:px-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-6" style={{ color: "#003063" }}>
          Datenbank-Schema
        </h1>
        <p className="text-sm text-center max-w-3xl mx-auto" style={{ color: "#505050" }}>
          Vollständiger Überblick über alle Tabellen der Krebs-DB:
          Patientendaten, Tumormeldungen, Histologie, Therapiesitzungen und
          Verlaufskontrollen. Jede Tabelle mit Feldtypen, Beschreibungen und
          Enum-Werten.
        </p>

        {/* Tipp-Banner: Tabellennamen sind technische Namen */}
        <div
          className="max-w-3xl mx-auto mt-6 px-4 py-3 rounded-lg text-sm flex items-start gap-3"
          style={{ backgroundColor: "#FFF8E1", border: "1px solid #F0B429" }}
        >
          <span style={{ fontSize: "1.25rem", lineHeight: "1.25rem" }}>💡</span>
          <span style={{ color: "#7A4100" }}>
            <strong>Tipp für die R-/SQL-Programmierung:</strong> Der technische
            Name in Klammern (z.B. <code className="font-mono">patient_report</code>)
            ist der Name, den du in <code className="font-mono">dbReadTable()</code>{" "}
            oder <code className="font-mono">SELECT FROM …</code> brauchst.
          </span>
        </div>
      </div>

      <section className="max-w-5xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm mb-12">
        <h2 className="text-3xl font-bold mb-6">🗄️ Datenbankdiagramm</h2>
        <Image
          className="w-full aspect-auto"
          src="/db-schema-diagram.png"
          width={1200}
          height={1200}
          alt="Datenbankschema-Diagramm der Krebs-DB"
        />
      </section>

      <PatientReportDoc />
      <TnmDoc />
      <TumorReportDoc />
      <TumorHistologyDoc />
      <TumorReportBreastDoc />
      <TumorReportColorectalDoc />
      <TumorReportProstateDoc />
      <TumorReportMelanomaDoc />
      <TumorSurgeryDoc />
      <TumorRadiotherapyDoc />
      <RadiotherapySessionDoc />
      <RadiotherapySessionPercutaneousDoc />
      <RadiotherapySessionBrachytherapyDoc />
      <RadiotherapySessionMetabolicDoc />
      <TumorSystemicTherapyDoc />
      <TumorFollowUpDoc />
    </>
  );
}
