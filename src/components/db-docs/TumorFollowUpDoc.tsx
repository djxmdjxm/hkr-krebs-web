export default function TumorFollowUpDoc() {
  return (
    <section className="max-w-5xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm mb-12">
      <h2 className="text-3xl font-bold mb-6">🔁 Tumor Follow-up</h2>

      <table className="min-w-full text-sm text-left border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="p-3">Field</th>
            <th className="p-3">Type</th>
            <th className="p-3">Description (EN / DE)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <TableRow
            field="id"
            type="Integer (PK)"
            description="Internal ID / Interne ID"
          />
          <TableRow
            field="tumor_report_id"
            type="Integer (FK)"
            description="Reference to tumor report / Verweis auf Tumorbericht"
          />
          <TableRow
            field="tnm_id"
            type="Integer (FK)"
            description="TNM classification at follow-up / TNM-Klassifikation beim Folgeereignis"
          />
          <TableRow
            field="other_classification"
            type="JSON"
            description="Other tumor classification / Weitere Klassifikation"
          />
          <TableRow
            field="date"
            type="Date"
            description="Date of follow-up event / Datum des Folgeereignisses"
          />
          <TableRow
            field="date_accuracy"
            type="String"
            description="Date accuracy / Datumsgenauigkeit"
          />
          <TableRow
            field="overall_tumor_status"
            type="Enum"
            description="Overall tumor status / Gesamtbeurteilung Tumorstatus"
            enumValues={[
              ["V", "Complete remission / Komplette Remission"],
              ["T", "Partial remission / Teilremission"],
              ["K", "No change / Kein Fortschritt"],
              ["P", "Progression"],
              ["D", "Divergent course / Divergenter Verlauf"],
              ["B", "Minimal response / Minimale Besserung"],
              ["R", "CR with residual / Komplette Remission mit Restbefund"],
              ["Y", "Recurrence / Rezidiv"],
              ["U", "Assessment impossible / Keine Beurteilung möglich"],
              ["X", "Missing data / Fehlende Angabe"],
            ]}
          />
          <TableRow
            field="local_tumor_status"
            type="Enum"
            description="Local tumor status / Lokaler Tumorstatus"
            enumValues={[
              ["K", "No detectable tumor / Kein Tumor nachweisbar"],
              [
                "T",
                "Residual tumor / Resttumor (unbekannt ob stabil oder progressiv)",
              ],
              ["P", "Progressive residual tumor / Progressiver Resttumor"],
              ["N", "No change / Kein Fortschritt"],
              ["R", "Local recurrence / Lokalrezidiv"],
              ["F", "Questionable finding / Fraglicher Befund"],
              ["U", "Unknown / Unbekannt"],
              ["X", "Missing / Fehlende Angabe"],
            ]}
          />
          <TableRow
            field="lymph_node_tumor_status"
            type="Enum"
            description="Lymph node tumor status / Tumorstatus Lymphknoten"
            enumValues={[
              ["K", "No involvement / Kein Befall"],
              ["T", "Residual involvement / Restbefall"],
              ["P", "Progression / Progress"],
              ["N", "No change / Kein Fortschritt"],
              ["R", "Recurrence / Lymphknotenrezidiv"],
              ["F", "Questionable / Fraglicher Befund"],
              ["U", "Unknown / Unbekannt"],
              ["X", "Missing / Fehlende Angabe"],
            ]}
          />
          <TableRow
            field="distant_metastasis_tumor_status"
            type="Enum"
            description="Distant metastasis status / Fernmetastasenstatus"
            enumValues={[
              ["K", "None / Keine"],
              ["T", "Residual / Residuen"],
              ["P", "Progression"],
              ["N", "No change / Kein Fortschritt"],
              ["R", "New / Neue Metastasen"],
              ["F", "Questionable / Fraglich"],
              ["U", "Unknown / Unbekannt"],
              ["X", "Missing / Fehlende Angabe"],
            ]}
          />
          <TableRow
            field="distant_metastasis"
            type="JSON"
            description="Distant metastasis details / Details zu Fernmetastasen"
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
