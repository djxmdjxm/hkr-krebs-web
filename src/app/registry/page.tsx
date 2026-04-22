"use client";

import { useState } from "react";
import UploadSection from "@/components/UploadSection";
import BulkUploadSection from "@/components/BulkUploadSection";
import DatabaseResetButton from "@/components/DatabaseResetButton";

export default function Registry() {
  const [tab, setTab] = useState<"single" | "bulk">("single");

  return (
    <div>
      {/* Tab-Toggle */}
      <div className="flex gap-0 border-b pt-6 px-4 max-w-lg mx-auto"
        style={{ borderColor: "#D8D8D8" }}>
        {(["single", "bulk"] as const).map((t) => {
          const label = t === "single" ? "Einzelimport" : "Massenimport";
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2 text-sm font-semibold transition-colors"
              style={{
                color: active ? "#003063" : "#505050",
                borderBottom: active ? "2px solid #003063" : "2px solid transparent",
                marginBottom: "-1px",
                backgroundColor: "transparent",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {tab === "single" ? <UploadSection /> : <BulkUploadSection />}

      {/* Datenverwaltung */}
      <div className="max-w-2xl mx-auto px-4 pb-10">
        <div className="border-t pt-4 flex items-center gap-4" style={{ borderColor: "#D8D8D8" }}>
          <span className="text-xs shrink-0" style={{ color: "#909090" }}>Neustart:</span>
          <DatabaseResetButton />
        </div>
      </div>
    </div>
  );
}
