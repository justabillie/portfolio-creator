"use client";

import { useEffect, useRef, useState } from "react";

type CvFile = {
  id: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
};

export default function CvPage() {
  const [cv, setCv] = useState<CvFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/cv");
    const data = await res.json();
    setCv(data.cvFile ?? null);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/cv", { method: "POST", body: fd });
    const data = await res.json();

    if (!res.ok) {
      setMessage(`⚠️ ${data.error}`);
    } else {
      setMessage("✅ CV uploaded");
      setCv(data.cvFile);
      setTimeout(() => setMessage(null), 2500);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function remove() {
    if (!confirm("Delete your CV?")) return;
    const res = await fetch("/api/cv", { method: "DELETE" });
    if (res.ok) {
      setCv(null);
      setMessage("✅ CV removed");
      setTimeout(() => setMessage(null), 2500);
    }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">CV / Resume</h1>
      <p className="text-sm text-neutral-600 mb-6">
        Upload your CV as a PDF (max 5 MB). It will appear on your public portfolio
        with a preview and a download button.
      </p>

      <div className="rounded-lg border border-neutral-200 bg-white p-5 mb-6">
        <h2 className="font-medium mb-3">
          {cv ? "Replace your CV" : "Upload your CV"}
        </h2>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={upload}
          disabled={uploading}
          className="block text-sm file:mr-4 file:rounded-md file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-neutral-800 disabled:opacity-50"
        />

        {uploading && (
          <p className="text-sm text-neutral-500 mt-3">Uploading…</p>
        )}

        {message && (
          <div className="rounded-md bg-neutral-100 border border-neutral-200 px-3 py-2 text-sm mt-3">
            {message}
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-neutral-500 text-sm">Loading…</p>
      ) : cv ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="font-medium">Current CV</h2>
              <p className="text-sm text-neutral-600 truncate mt-1">{cv.fileName}</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                {formatSize(cv.fileSize)} · uploaded{" "}
                {new Date(cv.uploadedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <a
                href={cv.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-neutral-700 underline"
              >
                Open
              </a>
              <a
                href={cv.fileUrl}
                download={cv.fileName}
                className="text-xs text-neutral-700 underline"
              >
                Download
              </a>
              <button
                onClick={remove}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="mt-4 border border-neutral-200 rounded overflow-hidden">
            <iframe
              src={cv.fileUrl}
              className="w-full"
              style={{ height: "600px" }}
              title="CV preview"
            />
          </div>
        </div>
      ) : (
        <p className="text-neutral-500 text-sm">No CV uploaded yet.</p>
      )}
    </div>
  );
}
