export default function RadiotherapySessionMetabolicDoc() {
  return (
    <section className="max-w-5xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm mb-12">
      <h2 className="text-3xl font-bold mb-6">
        🧪 Radiotherapy Session (Metabolic)
      </h2>

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
            field="radiotherapy_session_id"
            type="Integer (FK)"
            description="Reference to radiotherapy session / Verweis auf Bestrahlungssitzung"
          />

          <TableRow
            field="type"
            type="Enum"
            description="Type of radionuclide therapy / Typ der nuklearmedizinischen Therapie"
            enumValues={[
              [
                "SIRT",
                "Selective Internal Radiation Therapy / Selektive interne Radiotherapie",
              ],
              [
                "PRRT",
                "Peptide Receptor Radionuclide Therapy / Peptid-Radio-Rezeptor-Therapie",
              ],
              ["PSMA", "PSMA Therapy / PSMA-Therapie"],
              ["RJT", "Radioiodine Therapy / Radiojod-Therapie"],
              ["RIT", "Radioimmunotherapy / Radioimmun-Therapie"],
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
