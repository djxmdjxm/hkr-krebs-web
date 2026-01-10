"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

const ALL_TABS = ["Python", "R"];

export default function Showcase() {
  const [activeTab, setActiveTab] = useState("R");

  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-8">
      <h2 className="text-3xl text-slate-700 sm:text-4xl font-semibold text-center mb-8">
        Integrate in under a minute
      </h2>

      <div className="flex justify-center gap-6 mb-12 text-sm sm:text-base">
        {ALL_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-full font-medium ${
              tab === activeTab
                ? "bg-black text-white"
                : tab === "All 13 Adapters"
                ? "text-gray-500 hover:text-black flex items-center gap-1"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Active Content Card */}
      <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-10  flex flex-col md:flex-row  max-w-5xl mx-auto">
        {/* Left */}
        <div className="flex-1 space-y-4 mb-6 md:mb-0">
          <h3 className="text-xl font-semibold">{activeTab}</h3>
          <p className="text-gray-600">
            Access high-quality, structured oncology data in seconds with{" "}
            {activeTab}.
          </p>

          <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1 mt-4">
            <li>Fast JSON & Parquet APIs</li>
            <li>Secure, token-based access</li>
            <li>Field-level access control</li>
            <li>Privacy-first architecture</li>
          </ul>
        </div>

        {/* Right (image placeholder or code box) */}
        <div className="flex-1">
          <div className="flex flex-col bg-gradient-to-br from-blue-300 via-orange-300 to-pink-200 rounded-2xl p-6">
            {activeTab === "R" && <RCodeSample />}
            {activeTab === "Python" && <PythonCodeSample />}
          </div>
        </div>
      </div>
    </section>
  );
}

function PythonCodeSample() {
  return (
    <>
      <SyntaxHighlighter
        className="bg-white rounded-md p-4 text-xs text-gray-800 whitespace-pre-wrap"
        language="python"
        style={oneLight}
      >
        {`import requests
import pandas as pd

# Your secure API token
token = "your_api_token"

# Request patient reports from JSON API
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(
  "https://api.krebsdata.org/v1/patient_reports",
  headers=headers)

# Parse JSON into a DataFrame
data = pd.json_normalize(response.json())

# Preview the data
print(data.head())
`}
      </SyntaxHighlighter>

      <div className="text-center my-4 text-slate-50 font-bold">OR</div>

      <SyntaxHighlighter
        className="bg-white rounded-md p-4 text-xs text-gray-800 whitespace-pre-wrap"
        language="python"
        style={oneLight}
      >
        {`import requests
import pandas as pd
import pyarrow.parquet as pq
import pyarrow as pa
import io

# Your secure API token
token = "your_api_token"

# Download Parquet file securely
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(
  "https://api.krebsdata.org/v1/parquet/patient_reports.parquet",
  headers=headers)

# Load Parquet into a DataFrame
buffer = io.BytesIO(response.content)
table = pq.read_table(buffer)
data = table.to_pandas()

# Preview the data
print(data.head())
`}
      </SyntaxHighlighter>
    </>
  );
}

function RCodeSample() {
  return (
    <>
      <SyntaxHighlighter
        className="bg-white rounded-md p-4 text-xs text-gray-800 whitespace-pre-wrap"
        language="r"
        style={oneLight}
      >
        {`library(httr)
library(jsonlite)

# Your secure API token
token <- "your_api_token"

# Request patient reports from JSON API
response <- GET(
  url = "https://api.krebsdata.org/v1/patient_reports",
  add_headers(Authorization = paste("Bearer", token))
)

# Parse JSON into a data frame
data <- fromJSON(content(response, "text"), flatten = TRUE)

# Preview the data
print(head(data))
`}
      </SyntaxHighlighter>

      <div className="text-center my-4 text-slate-50 font-bold">OR</div>

      <SyntaxHighlighter
        className="bg-white rounded-md p-4 text-xs text-gray-800 whitespace-pre-wrap"
        language="r"
        style={oneLight}
      >
        {`library(httr)
library(arrow)

# Set your API token
token <- "your_api_token"

# Securely download the Parquet file with token
response <- GET(
  url = "https://api.krebsdata.org/v1/parquet/patient_reports.parquet",
  add_headers(Authorization = paste("Bearer", token)),
  write_disk("patient_reports.parquet", overwrite = TRUE)
)

# Load the Parquet file
data <- read_parquet("patient_reports.parquet")

# Preview the data
print(head(data))
`}
      </SyntaxHighlighter>
    </>
  );
}
