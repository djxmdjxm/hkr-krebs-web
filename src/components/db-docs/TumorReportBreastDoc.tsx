export default function TumorReportBreastDoc() {
  return (
    <section className="max-w-5xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm mb-12">
      <h2 className="text-3xl font-bold mb-6">🩺 Tumorbericht Mamma</h2>

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
            field="tumor_report_id"
            type="Integer (PK, FK)"
            description="Reference to tumor report / Verweis auf Tumorbericht"
          />

          <TableRow
            field="menopause_status_at_diagnosis"
            type="Enum"
            description="Menopausal status at diagnosis / Menopausenstatus bei Diagnose"
            enumValues={[
              ["1", "Premenopausal / Prämenopausal"],
              ["3", "Postmenopausal / Postmenopausal"],
              ["U", "Unknown / Unbekannt"],
            ]}
          />

          <TableRow
            field="estrogen_receptor_status"
            type="Enum"
            description="Estrogen receptor status / Östrogenrezeptorstatus"
            enumValues={[
              ["P", "Positive / Positiv"],
              ["N", "Negative / Negativ"],
              ["U", "Unknown / Unbekannt"],
            ]}
          />

          <TableRow
            field="progesterone_receptor_status"
            type="Enum"
            description="Progesterone receptor status / Progesteronrezeptorstatus"
            enumValues={[
              ["P", "Positive / Positiv"],
              ["N", "Negative / Negativ"],
              ["U", "Unknown / Unbekannt"],
            ]}
          />

          <TableRow
            field="her2neu_status"
            type="Enum"
            description="HER2/neu status / HER2/neu-Status"
            enumValues={[
              ["P", "Positive / Positiv"],
              ["N", "Negative / Negativ"],
              ["U", "Unknown / Unbekannt"],
            ]}
          />

          <TableRow
            field="tumor_size_mm_invasive"
            type="Integer"
            description="Tumor size (invasive, mm) / Tumorgröße invasiv (mm)"
          />

          <TableRow
            field="tumor_size_mm_dcis"
            type="Integer"
            description="Tumor size (DCIS, mm) / Tumorgröße DCIS (mm)"
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
