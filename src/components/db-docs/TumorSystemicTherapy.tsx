export default function TumorSystemicTherapyDoc() {
  return (
    <section className="max-w-5xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm mb-12">
      <h2 className="text-3xl font-bold mb-6">💉 Systemische Tumortherapie</h2>

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
            field="tumor_report_id"
            type="Integer (FK)"
            description="Reference to tumor report / Verweis auf Tumorbericht"
          />
          <TableRow
            field="start_date"
            type="Date"
            description="Start date of therapy / Beginn der systemischen Therapie"
          />
          <TableRow
            field="start_date_accuracy"
            type="Enum"
            description="Date accuracy / Datumsgenauigkeit (Beginn)"
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
            field="intent"
            type="Enum"
            description="Therapy intent / Therapieintention"
            enumValues={[
              ["K", "Curative / Kurativ"],
              ["P", "Palliative"],
              ["S", "Symptom control / Symptomatisch"],
              ["X", "Unknown / Unbekannt"],
            ]}
          />
          <TableRow
            field="surgery_relation"
            type="Enum"
            description="Relation to surgery / Stellung zur OP"
            enumValues={[
              ["O", "Without surgery / Ohne OP"],
              ["A", "Adjuvant"],
              ["N", "Neoadjuvant"],
              ["I", "Intercurrent / Interkurrent"],
              ["Z", "Interval irradiation / Zwischenbestrahlung"],
              ["S", "Other / Sonstiges"],
            ]}
          />
          <TableRow
            field="type"
            type="Enum"
            description="Type of systemic therapy / Therapieart"
            enumValues={[
              ["CH", "Chemotherapy / Chemotherapie"],
              ["HO", "Hormone therapy / Hormontherapie"],
              ["IM", "Immunotherapy / Immun-/Antikörpertherapie"],
              ["ZS", "Targeted therapy / Zielgerichtete Substanzen"],
              ["CI", "Chemo + Immunotherapy"],
              ["CZ", "Chemo + Targeted therapy"],
              ["CIZ", "Chemo + Immuno + Targeted"],
              ["IZ", "Immuno + Targeted"],
              ["SZ", "Stem cell transplant"],
              ["AS", "Active surveillance"],
              ["WS", "Wait and see"],
              ["WW", "Watchful waiting"],
              ["SO", "Other / Sonstiges"],
            ]}
          />
          <TableRow
            field="protocol"
            type="JSON"
            description="Therapy protocol / Therapieprotokoll"
          />
          <TableRow
            field="drugs"
            type="JSON"
            description="Drugs administered / Verabreichte Substanzen"
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
