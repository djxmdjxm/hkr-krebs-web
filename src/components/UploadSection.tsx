"use client";

import { useState, DragEvent, ChangeEvent, FormEvent } from "react";

export default function UploadSection() {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [type, setType] = useState("XML:oBDS_3.0.4_RKI");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select a file.");

    setUploading(true);

    // Use FormData (multipart/form-data) instead of base64 JSON.
    // Base64 encoding inflates file size by ~33% and causes Gunicorn timeouts
    // for large files (Hamburg delivers >100 MB per quarter).
    const formData = new FormData();
    formData.append("type", type);
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        body: formData,  // no Content-Type header — browser sets multipart boundary automatically
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      alert("File uploaded successfully!");
      setSelectedFile(null);
    } catch (err) {
      alert("Error uploading file.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className=" bg-gray-50 py-16 px-4 sm:px-8">
      <div className="mb-16">
        <h2 className="text-3xl text-slate-700 sm:text-4xl font-semibold text-center mb-8">
          Upload Registry File
        </h2>
        <p className="mt-2 text-gray-600 text-sm text-center">
          Select the file type and upload your clinical registry data file.
          Supported formats include structured oBDS XML for cancer reporting.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-gray-200 shadow-sm max-w-md w-full mx-auto p-6 space-y-6"
      >
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Format
          </label>
          <select
            id="country"
            name="country"
            className="block w-full rounded-md border border-gray-200 bg-white py-2 px-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value="XML:oBDS_3.0.0.8a_RKI">
              oBDS 3.0.0.8a RKI (XML)
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="file"
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`block w-full text-center border-2 border-dashed rounded-md p-6 cursor-pointer ${
              dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <p className="text-sm text-gray-600 mb-1 w-full overflow-hidden overflow-ellipsis">
              {selectedFile ? selectedFile.name : "Drag & drop your file here"}
            </p>
            <p className="text-xs text-gray-400">or click to select</p>
            <input
              id="file"
              name="file"
              type="file"
              accept=".xml"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white rounded-md py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>
      </form>
    </section>
  );
}
