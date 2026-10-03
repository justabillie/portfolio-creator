"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Upload, X, FileText, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: "profile" | "projects" | "certificates";
  accept?: string;
  label?: string;
  hint?: string;
  /** compact = small inline tile; default = full drag-drop zone */
  variant?: "default" | "compact";
  /** aspect ratio class for preview (default: video) */
  aspectClass?: string;
};

export function FileUpload({
  value,
  onChange,
  folder,
  accept = "image/*",
  label,
  hint,
  variant = "default",
  aspectClass = "aspect-video",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function uploadFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Upload failed");
        return;
      }
      onChange(data.url);
      toast.success("Uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  async function removeFile() {
    if (!value) return;
    if (!confirm("Remove this file?")) return;
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      });
    } catch {
      // ignore, still remove from form
    }
    onChange(null);
    toast.success("Removed");
  }

  const isPdf = value?.toLowerCase().endsWith(".pdf");

  // ── Has file: show preview ─────────────────────────
  if (value) {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-neutral-800 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative rounded-lg border border-neutral-200 bg-white overflow-hidden group">
          {isPdf ? (
            <div className="aspect-video bg-neutral-50 flex flex-col items-center justify-center gap-2">
              <FileText className="h-8 w-8 text-neutral-400" />
              <p className="text-xs text-neutral-500">PDF attached</p>
            </div>
          ) : (
            <div className={cn("bg-neutral-100 overflow-hidden", aspectClass)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <button
            type="button"
            onClick={removeFile}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-white/90 backdrop-blur-sm text-neutral-700 hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
            aria-label="Remove"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        {hint && <p className="text-xs text-neutral-500 mt-1">{hint}</p>}
      </div>
    );
  }

  // ── Compact variant: small button ──────────────────
  if (variant === "compact") {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-neutral-800 mb-1.5">
            {label}
          </label>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full rounded-lg border border-dashed border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 transition-colors px-4 py-3 inline-flex items-center justify-center gap-2 text-sm text-neutral-600 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Choose file
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onFileSelect}
          className="hidden"
        />
        {hint && <p className="text-xs text-neutral-500 mt-1">{hint}</p>}
      </div>
    );
  }

  // ── Empty state: drag-drop zone ────────────────────
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-neutral-800 mb-1.5">
          {label}
        </label>
      )}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          "rounded-lg border-2 border-dashed transition-all cursor-pointer",
          aspectClass,
          dragging
            ? "border-neutral-900 bg-neutral-50 scale-[1.01]"
            : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50",
          uploading && "opacity-60 pointer-events-none"
        )}
      >
        <motion.div
          animate={{ scale: dragging ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="h-full flex flex-col items-center justify-center gap-2 text-neutral-500"
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-xs">Uploading…</span>
            </>
          ) : (
            <>
              <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
                {accept.includes("pdf") ? (
                  <FileText className="h-4 w-4" />
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )}
              </div>
              <span className="text-xs font-medium">
                Drop file here or click
              </span>
              <span className="text-[10px] text-neutral-400">
                {accept.includes("pdf")
                  ? "JPG, PNG, WebP, or PDF · up to 5 MB"
                  : "JPG, PNG, WebP, or GIF · up to 5 MB"}
              </span>
            </>
          )}
        </motion.div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onFileSelect}
        className="hidden"
      />
      {hint && <p className="text-xs text-neutral-500 mt-1">{hint}</p>}
    </div>
  );
}
