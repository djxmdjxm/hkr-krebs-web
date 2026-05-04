export default function RadiotherapySessionDoc() {
  return (
    <section className="max-w-5xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm mb-12">
      <h2 className="text-3xl font-bold mb-6">
        ☢️ Bestrahlungssitzung — Basis <code className="font-mono text-xl text-gray-500 ml-2">(radiotherapy_session)</code>
      </h2>

      <p className="text-sm mb-4" style={{ color: "#505050" }}>
        Eltern-Tabelle der drei spezifischen Sitzungs-Tabellen
        (perkutan, brachytherapeutisch, metabolisch). Jede Zeile entspricht
        einer Bestrahlungssitzung; die spezifischen Tabellen referenzieren
        diese über <code className="font-mono">radiotherapy_session_id</code>.
      </p>

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
            field="tumor_radiotherapy_id"
            type="Integer (FK)"
            description="Reference to tumor_radiotherapy / Verweis auf Strahlentherapie"
          />
          <TableRow
            field="start_date"
            type="Date"
            description="Start of session / Beginn der Sitzung"
          />
          <TableRow
            field="start_date_accuracy"
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
            field="duration_days"
            type="Integer"
            description="Duration in days / Dauer in Tagen"
          />
          <TableRow
            field="target_area"
            type="Enum"
            description="Target region / Zielgebiet"
          />
          <TableRow
            field="laterality"
            type="Enum"
            description="Side / Seite (Links / Rechts / Beidseits / Mittellinie)"
            enumValues={[
              ["L", "Left / Links"],
              ["R", "Right / Rechts"],
              ["B", "Bilateral / Beidseits"],
              ["M", "Midline / Mittellinie"],
              ["U", "Unknown / Unbekannt"],
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
