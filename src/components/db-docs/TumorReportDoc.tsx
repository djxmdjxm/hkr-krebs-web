export default function TumorReportDoc() {
  return (
    <section className="max-w-5xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm mb-12">
      <h2 className="text-3xl font-bold mb-6">🧾 Tumorbericht-Tabelle</h2>

      <table className="min-w-full text-sm text-left border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="p-3">Feld</th>
            <th className="p-3">Typ</th>
            <th className="p-3">Beschreibung</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <TableRow
            field="id"
            type="Integer (PK)"
            description="Internal ID / Interne ID"
          />
          <TableRow
            field="patient_report_id"
            type="Integer (FK)"
            description="Reference to patient report / Verweis auf Patientenbericht"
          />
          <TableRow
            field="tumor_id"
            type="String"
            description="Tumor ID / Tumor-ID"
          />
          <TableRow
            field="diagnosis_date"
            type="Date"
            description="Diagnosis date / Diagnosedatum"
          />
          <TableRow
            field="diagnosis_date_accuracy"
            type="Enum"
            description="Date accuracy / Datumsgenauigkeit"
            enumValues={[
              ["E", "Exact / Exakt"],
              ["T", "Day / Tag"],
              ["M", "Month / Monat"],
              ["V", "Estimate / Vollschätzung"],
            ]}
          />
          <TableRow
            field="incidence_location"
            type="String"
            description="Incidence location / Inzidenzort"
          />
          <TableRow
            field="icd"
            type="JSON"
            description="ICD classification / ICD-Klassifikation (Primaertumor)"
          />
          <TableRow
            field="topographie"
            type="JSON"
            description="Topography (ICD-O) / Topographie ICD-O"
          />
          <TableRow
            field="diagnostic_certainty"
            type="Enum"
            description="Diagnostic certainty / Diagnosesicherheit"
            enumValues={[
              ["0", "Unknown / Unbekannt"],
              ["1", "Clinical / Klinisch"],
              ["2", "Clinical + Imaging / Klinisch + Bildgebung"],
              ["4", "Specific lab / Spezifischer Labortest"],
              ["5", "Cytology / Zytologie"],
              ["6", "Primary histology / Histologie Primärtumor"],
              ["7", "Metastasis histology / Histologie Metastase"],
              ["9", "Autopsy / Autopsie"],
            ]}
          />
          <TableRow
            field="c_tnm_id"
            type="Integer (FK)"
            description="Reference to clinical TNM / Verweis auf cTNM"
          />
          <TableRow
            field="p_tnm_id"
            type="Integer (FK)"
            description="Reference to pathological TNM / Verweis auf pTNM"
          />
          <TableRow
            field="distant_metastasis"
            type="JSON"
            description="Distant metastases / Fernmetastasen"
          />
          <TableRow
            field="other_classification"
            type="JSON"
            description="Other classifications / Weitere Klassifikationen"
          />
          <TableRow
            field="laterality"
            type="Enum"
            description="Laterality / Seitenlokalisation"
            enumValues={[
              ["L", "Left / Links"],
              ["R", "Right / Rechts"],
              ["B", "Bilateral / Beidseitig"],
              ["M", "Middle / Mitte"],
              ["U", "Unknown / Unbekannt"],
              ["T", "Not applicable / Nicht zutreffend"],
            ]}
          />
          <TableRow
            field="created_at"
            type="Timestamp"
            description="Created at / Erstellt am"
          />
          <TableRow
            field="updated_at"
            type="Timestamp"
            description="Last updated / Zuletzt aktualisiert"
          />
        </tbody>
      </table>
    </section>
  );
}

function TableRow({
  field,
  type,
  description,
  enumValues = [],
}: {
  field: string;
  type: string;
  description: string;
  enumValues?: [string, string][];
}) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-3 font-mono text-blue-900">{field}</td>
      <td className="p-3 text-gray-700">{type}</td>
      <td className="p-3 text-gray-800">
        <div>{description}</div>
        {enumValues.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {enumValues.map(([val, label]) => (
              <span
                key={val}
                className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-xs text-blue-800 font-medium"
              >
                {val}: {label}
              </span>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
}
