import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function UploadJingle() {
  const [uploadStatus, setUploadStatus] = useState("");
  const { districtId } = useParams();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setUploadStatus("Please select a file first.");
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setUploadStatus("");
  };

  const triggerUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("No file selected to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", selectedFile);

    try {
      setUploadStatus("Uploading...");
      const response = await fetch(
        `http://localhost:5000/hpat/jingles/upload/${districtId}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        setUploadStatus("Upload successful!");
      } else {
        setUploadStatus("Upload failed.");
      }
    } catch (error) {
      setUploadStatus("Upload failed.");
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-100/60 to-indigo-200/65">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-8 text-center tracking-tight">
          Upload Jingle
        </h2>
        <div className="mb-6">
          <label
            htmlFor="jingle-upload"
            className="block text-gray-700 text-base font-semibold mb-3"
          >
            Select Audio File:
          </label>
          <input
            id="jingle-upload"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="block w-full text-base text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition"
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={triggerUpload}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out"
          >
            Upload
          </button>
        </div>
        <div
          className={`text-center text-sm mt-4 ${
            uploadStatus === "Upload successful!"
              ? "text-green-600"
              : uploadStatus === "Uploading..."
              ? "text-blue-600"
              : uploadStatus
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {uploadStatus}
        </div>
      </div>
    </div>
  );
}
