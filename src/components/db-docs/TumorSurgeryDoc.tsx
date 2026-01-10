export default function TumorSurgeryDoc() {
  return (
    <section className="max-w-5xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm mb-12">
      <h2 className="text-3xl font-bold mb-6">🛠️ Tumor Surgery Table</h2>

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
            field="intent"
            type="Enum"
            description="Surgical intent / OP-Intention"
            enumValues={[
              ["K", "Curative / Kurativ"],
              ["P", "Palliative / Palliativ"],
              ["D", "Diagnostic / Diagnostisch"],
              ["R", "Revision/Complication / Revision/Komplikation"],
              ["S", "Other / Sonstiges"],
              ["X", "Not specified / Keine Angabe"],
            ]}
          />

          <TableRow
            field="date"
            type="Date"
            description="Date of surgery / OP-Datum"
          />

          <TableRow
            field="date_accuracy"
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
            field="operations"
            type="JSON"
            description="List of performed operations (OPS codes) / Liste der durchgeführten Operationen (OPS-Codes)"
          />

          <TableRow
            field="local_residual_status"
            type="Enum"
            description="Residual tumor status / Residualstatus (lokal)"
            enumValues={[
              ["R0", "No residual tumor / Kein Residualtumor"],
              ["R1", "Microscopic residual / Mikroskopischer Residual"],
              ["R2", "Macroscopic residual / Makroskopischer Residual"],
              ["R1(is)", "In situ residual / Residual in situ"],
              ["R1(cy+)", "Cytological positive / Zytologisch positiv"],
              ["RX", "Unknown / Unbekannt"],
              ["U", "Not assessable / Nicht beurteilbar"],
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
