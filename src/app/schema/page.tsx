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
import DatabaseResetButton from "@/components/DatabaseResetButton";

export default function Schema() {
  return (
    <>
      <div className="mb-16 py-16 px-4 sm:px-8">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-8">
          Cancer Registry Data Schema
        </h2>
        <p className="mt-2 text-gray-600 text-sm text-center max-w-3xl mx-auto">
          This schema provides a comprehensive overview of all database tables
          used in the Krebs DB cancer registry. It includes patient data, tumor
          reports, histology, therapy sessions, and follow-up information. Each
          table is documented with field types, descriptions (EN/DE), and
          enumerated values where applicable. Ideal for developers, data
          scientists, and public health analysts working with cancer data.
        </p>
      </div>

      <section className="max-w-5xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm mb-12">
        <h2 className="text-3xl font-bold mb-6">🗄️ Diagram</h2>

        <Image
          className="w-full aspect-auto"
          src="/db-schema-diagram.png"
          width={1200}
          height={1200}
          alt="Picture of the author"
        />
      </section>

      {/* Datenverwaltung */}
      <section className="max-w-5xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm mb-12">
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#003063" }}>Datenverwaltung</h2>
        <p className="text-sm mb-5" style={{ color: "#505050" }}>
          Setzt die gesamte Krebsregister-Datenbank zurück — alle Patientendaten, Tumormeldungen
          und Import-Protokolle werden unwiderruflich gelöscht. Nutzen Sie diese Funktion,
          wenn Sie Daten korrigiert haben und einen vollständigen Neuimport durchführen möchten.
        </p>
        <div className="max-w-sm">
          <DatabaseResetButton />
        </div>
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
