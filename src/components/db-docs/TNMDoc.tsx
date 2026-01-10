"use client";

import { useState } from "react";

export default function TnmDoc() {
  const [showUiccStages, setShowUiccStages] = useState(false);

  return (
    <section className="max-w-5xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm mb-12">
      <h2 className="text-3xl font-bold mb-6">🧬 TNM Table</h2>

      <table className="w-full text-sm text-left border border-gray-300 rounded-lg overflow-hidden">
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
            field="version"
            type="Enum"
            description="TNM version / TNM-Version"
            enumValues={[
              ["6", "v6"],
              ["7", "v7"],
              ["8", "v8"],
            ]}
          />

          <TableRow
            field="y_symbol"
            type="Boolean"
            description="Pre-treatment indicator / Prätherapie-Kennzeichnung (y)"
          />
          <TableRow
            field="r_symbol"
            type="Boolean"
            description="Recurrence assessment / Rezidivstatus (r)"
          />
          <TableRow
            field="a_symbol"
            type="Boolean"
            description="Autopsy / Autopsiebefund (a)"
          />

          <TableRow
            field="t_prefix"
            type="Enum"
            description="Prefix for T / Präfix für T"
            enumValues={[
              ["c", "Clinical / Klinisch"],
              ["p", "Pathological / Pathologisch"],
              ["u", "Unknown / Unbekannt"],
            ]}
          />
          <TableRow
            field="t"
            type="String"
            description="Primary tumor (T) / Primärtumor (T)"
          />

          <TableRow
            field="m_symbol"
            type="String"
            description="Additional M symbol / Zusatzsymbol M"
          />

          <TableRow
            field="n_prefix"
            type="Enum"
            description="Prefix for N / Präfix für N"
            enumValues={[
              ["c", "Clinical"],
              ["p", "Pathological"],
              ["u", "Unknown"],
            ]}
          />
          <TableRow
            field="n"
            type="String"
            description="Regional lymph nodes (N) / Regionale Lymphknoten (N)"
          />

          <TableRow
            field="m_prefix"
            type="Enum"
            description="Prefix for M / Präfix für M"
            enumValues={[
              ["c", "Clinical"],
              ["p", "Pathological"],
              ["u", "Unknown"],
            ]}
          />
          <TableRow
            field="m"
            type="String"
            description="Distant metastasis (M) / Fernmetastasen (M)"
          />

          <TableRow
            field="l"
            type="Enum"
            description="Lymphatic invasion / Lymphbahneninvasion (L)"
            enumValues={[
              ["LX", "Unknown / Unbekannt"],
              ["L0", "No invasion / Keine Invasion"],
              ["L1", "Positive / Positiv"],
            ]}
          />

          <TableRow
            field="v"
            type="Enum"
            description="Venous invasion / Veneninvasion (V)"
            enumValues={[
              ["VX", "Unknown"],
              ["V0", "None"],
              ["V1", "Microscopic"],
              ["V2", "Macroscopic"],
            ]}
          />

          <TableRow
            field="pn"
            type="Enum"
            description="Perineural invasion / Perineuralscheideninvasion (Pn)"
            enumValues={[
              ["PnX", "Unknown"],
              ["Pn0", "Absent"],
              ["Pn1", "Present"],
            ]}
          />

          <TableRow
            field="s"
            type="Enum"
            description="Surgical margin / Resektionsrand (S)"
            enumValues={[
              ["SX", "Unknown"],
              ["S0", "No residual tumor"],
              ["S1", "Microscopic residual"],
              ["S2", "Macroscopic residual"],
              ["S3", "Tumor in lymph node or other tissue"],
            ]}
          />

          <tr className="hover:bg-gray-50">
            <td className="p-3 font-mono text-blue-900">uicc_stage</td>
            <td className="p-3 text-gray-700">Enum</td>
            <td className="p-3 text-gray-800">
              <div>UICC stage (combined TNM) / UICC-Stadium</div>
              <button
                onClick={() => setShowUiccStages(!showUiccStages)}
                className="mt-2 text-xs text-blue-600 underline"
              >
                {showUiccStages ? "Hide stages" : "Show all stages"}
              </button>
              {showUiccStages && (
                <div className="mt-2 flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
                  {[
                    "okk",
                    "0",
                    "0a",
                    "0is",
                    "I",
                    "IA",
                    "IA1",
                    "IA2",
                    "IA3",
                    "IB",
                    "IB1",
                    "IB2",
                    "IC",
                    "II",
                    "IIA",
                    "IIA1",
                    "IIA2",
                    "IIB",
                    "IIC",
                    "III",
                    "IIIA",
                    "IIIA1",
                    "IIIA2",
                    "IIIB",
                    "IIIC",
                    "IIIC1",
                    "IIIC2",
                    "IIID",
                    "IS",
                    "IV",
                    "IVA",
                    "IVA1",
                    "IVA2",
                    "IVB",
                    "IVC",
                  ].map((stage) => (
                    <span
                      key={stage}
                      className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800"
                    >
                      {stage}
                    </span>
                  ))}
                </div>
              )}
            </td>
          </tr>

          <TableRow
            field="created_at"
            type="Timestamp"
            description="Created at / Erstellt am"
          />
          <TableRow
            field="updated_at"
            type="Timestamp"
            description="Updated at / Aktualisiert am"
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
