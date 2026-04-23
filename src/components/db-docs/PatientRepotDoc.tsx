export default function PatientReportDoc() {
  return (
    <section className="max-w-5xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm mb-12">
      <h2 className="text-3xl font-bold mb-6">🧾 Patienten-Tabelle</h2>

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
            field="patient_id"
            type="String"
            description="Patient identifier / Patienten-ID"
          />

          <TableRow
            field="gender"
            type="Enum"
            description="Gender / Geschlecht"
            enumValues={[
              ["M", "Male / Männlich"],
              ["W", "Female / Weiblich"],
              ["D", "Diverse"],
              ["X", "Not specified / Keine Angabe"],
              ["U", "Unknown / Unbekannt"],
            ]}
          />

          <TableRow
            field="date_of_birth"
            type="Date"
            description="Date of birth / Geburtsdatum"
          />

          <TableRow
            field="date_of_birth_accuracy"
            type="Enum"
            description="Date accuracy / Datumsgenauigkeit (Geburt)"
            enumValues={[
              ["E", "Exact / Exakt"],
              ["T", "Day / Tag"],
              ["M", "Month / Monat"],
              ["V", "Estimate / Vollschätzung"],
            ]}
          />

          <TableRow
            field="is_deceased"
            type="Boolean"
            description="Is deceased / Verstorben"
          />

          <TableRow
            field="vital_status_date"
            type="Date"
            description="Date of vital status update / Datum des Vitalstatus"
          />

          <TableRow
            field="vital_status_date_accuracy"
            type="Enum"
            description="Date accuracy (vital status) / Datumsgenauigkeit (Vitalstatus)"
            enumValues={[
              ["E", "Exact / Exakt"],
              ["T", "Day / Tag"],
              ["M", "Month / Monat"],
              ["V", "Estimate / Vollschätzung"],
            ]}
          />

          <TableRow
            field="death_causes"
            type="JSON"
            description="Causes of death (ICD) / Todesursachen"
          />

          <TableRow
            field="register"
            type="Enum"
            description="Reporting registry / Lieferregister"
            enumValues={[
              ["01", "Schleswig-Holstein"],
              ["02", "Hamburg"],
              ["03", "Niedersachsen"],
              ["04", "Bremen"],
              ["05", "Nordrhein-Westfalen"],
              ["06", "Hessen"],
              ["07", "Rheinland-Pfalz"],
              ["08", "Baden-Württemberg"],
              ["09", "Bayern"],
              ["10", "Saarland"],
              ["11", "Berlin"],
              ["12", "Brandenburg"],
              ["13", "Mecklenburg-Vorpommern"],
              ["14", "Sachsen"],
              ["15", "Sachsen-Anhalt"],
              ["16", "Thüringen"],
              ["17", "Berlin-Brandenburg"],
            ]}
          />

          <TableRow
            field="reported_at"
            type="Date"
            description="Report date / Lieferdatum"
          />

          <TableRow
            field="updated_at"
            type="Timestamp"
            description="Last updated / Zuletzt aktualisiert"
          />
          <TableRow
            field="created_at"
            type="Timestamp"
            description="Created at / Erstellt am"
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
