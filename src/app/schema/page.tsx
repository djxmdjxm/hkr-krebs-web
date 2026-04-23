import Image from "next/image";
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
import RadiotherapySessionPercutaneousDoc from "@/components/db-docs/RadiotherapySessionPercutaneous";
import RadiotherapySessionBrachytherapyDoc from "@/components/db-docs/RadiotherapySessionBrachytherapy";
import RadiotherapySessionMetabolicDoc from "@/components/db-docs/RadiotherapySessionMetabolicDoc";
import TumorSystemicTherapyDoc from "@/components/db-docs/TumorSystemicTherapy";
import TumorFollowUpDoc from "@/components/db-docs/TumorFollowUpDoc";
import PageHeader from "@/components/PageHeader";

export default function Schema() {
  return (
    <>
      <div className="mb-16 py-16 px-4 sm:px-8">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-8">
          Datenbankschema Krebsregister
        </h2>
        <p className="mt-2 text-gray-600 text-sm text-center max-w-3xl mx-auto">
          Diese Dokumentation gibt einen vollständigen Überblick über alle
          Datenbanktabellen der Krebs-DB. Enthalten sind Patientendaten,
          Tumorberichte, Histologie, Therapiesitzungen und Nachsorgedaten. Jede
          Tabelle ist mit Feldtypen, Beschreibungen und Enum-Werten
          dokumentiert. Geeignet für Entwickler, Datenwissenschaftler und
          Public-Health-Analysten.
        </p>
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
      <RadiotherapySessionPercutaneousDoc />
      <RadiotherapySessionBrachytherapyDoc />
      <RadiotherapySessionMetabolicDoc />
      <TumorSystemicTherapyDoc />
      <TumorFollowUpDoc />
    </>
  );
}
