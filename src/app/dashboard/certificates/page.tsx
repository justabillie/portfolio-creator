"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, Award, ExternalLink, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, Input } from "@/components/form-field";
import { Btn } from "@/components/button";
import { PageHeader } from "@/components/page-header";
import { FileUpload } from "@/components/file-upload";
import {
  DashboardDetailModal,
  type DashboardDetail,
} from "@/components/dashboard-detail-modal";
import { springSoft } from "@/lib/motion";

type Cert = {
  id: string;
  title: string;
  issuer: string;
  issueDate: string | null;
  credentialUrl: string | null;
  imageUrl: string | null;
};

const emptyForm = {
  title: "",
  issuer: "",
  issueDate: "",
  credentialUrl: "",
  imageUrl: "",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function CertificatesPage() {
  const [items, setItems] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<DashboardDetail | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/certificates");
    const data = await res.json();
    setItems(data.certificates ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(x: Cert) {
    setEditingId(x.id);
    setForm({
      title: x.title,
      issuer: x.issuer,
      issueDate: x.issueDate ? x.issueDate.slice(0, 10) : "",
      credentialUrl: x.credentialUrl ?? "",
      imageUrl: x.imageUrl ?? "",
    });
    setModalOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      issuer: form.issuer,
      issueDate: form.issueDate || null,
      credentialUrl: form.credentialUrl || null,
      imageUrl: form.imageUrl || null,
    };
    const url = editingId
      ? `/api/certificates/${editingId}`
      : "/api/certificates";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      toast.error(data.error ?? "Failed to save");
      return;
    }
    toast.success(editingId ? "Certificate updated" : "Certificate added");
    setModalOpen(false);
    load();
  }

  async function remove(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/certificates/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete");
      return;
    }
    setItems((p) => p.filter((x) => x.id !== id));
    toast.success("Certificate deleted");
  }

  return (
    <div>
      <PageHeader
        title="Certificates"
        description="Licenses, credentials, and courses you've completed."
        action={
          !loading && items.length > 0 ? (
            <Btn onClick={openCreate}>
              <Plus className="h-4 w-4" />
              New certificate
            </Btn>
          ) : null
        }
      />

      {loading ? (
        <SkeletonGrid />
      ) : items.length === 0 ? (
        <EmptyState onAdd={openCreate} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {items.map((x, i) => {
              const isPdf = x.imageUrl?.toLowerCase().endsWith(".pdf");
              return (
                <motion.div
                  key={x.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ ...springSoft, delay: i * 0.03 }}
                  className="group rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:border-neutral-400 hover:shadow-md transition-all"
                >
                  <button
                    onClick={() =>
                      setDetail({
                        type: "certificate",
                        title: x.title,
                        issuer: x.issuer,
                        issueDate: x.issueDate,
                        credentialUrl: x.credentialUrl,
                        imageUrl: x.imageUrl,
                      })
                    }
                    className="text-left w-full"
                  >
                    {x.imageUrl && !isPdf && (
                      <div className="aspect-[4/3] bg-neutral-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={x.imageUrl}
                          alt={x.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      </div>
                    )}
                    {x.imageUrl && isPdf && (
                      <div className="aspect-[4/3] bg-neutral-100 border-b border-neutral-100 overflow-hidden relative">
                        <iframe
                          src={`${x.imageUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=page-width`}
                          className="w-full h-full pointer-events-none"
                          title={x.title}
                        />
                      </div>
                    )}
                  </button>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() =>
                          setDetail({
                            type: "certificate",
                            title: x.title,
                            issuer: x.issuer,
                            issueDate: x.issueDate,
                            credentialUrl: x.credentialUrl,
                            imageUrl: x.imageUrl,
                          })
                        }
                        className="flex-1 min-w-0 text-left"
                      >
                        <h3 className="font-semibold truncate group-hover:underline underline-offset-4">
                          {x.title}
                        </h3>
                        <p className="text-sm text-neutral-600 mt-0.5">
                          {x.issuer}
                          {x.issueDate && ` · ${formatDate(x.issueDate)}`}
                        </p>
                      </button>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => openEdit(x)}
                          className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => remove(x.id, x.title)}
                          className="p-1.5 rounded-md text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-3 text-xs">
                      {x.credentialUrl && (
                        <a
                          href={x.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-neutral-700 hover:text-neutral-900 font-medium"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Verify
                        </a>
                      )}
                      {isPdf && x.imageUrl && (
                        <a
                          href={x.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-neutral-700 hover:text-neutral-900 font-medium"
                        >
                          <FileText className="h-3 w-3" />
                          Open PDF
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit certificate" : "New certificate"}
            </DialogTitle>
            <DialogDescription>
              Add the certificate details and attach a photo or PDF.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4 mt-2">
            <Field label="Title" required>
              <Input
                required
                autoFocus
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="AWS Certified Cloud Practitioner"
              />
            </Field>

            <Field label="Issuer" required>
              <Input
                required
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                placeholder="Amazon Web Services"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Issue date">
                <Input
                  type="date"
                  value={form.issueDate}
                  onChange={(e) =>
                    setForm({ ...form, issueDate: e.target.value })
                  }
                />
              </Field>
              <Field label="Credential URL">
                <Input
                  value={form.credentialUrl}
                  onChange={(e) =>
                    setForm({ ...form, credentialUrl: e.target.value })
                  }
                  placeholder="https://…"
                />
              </Field>
            </div>

            <FileUpload
              label="Certificate file"
              value={form.imageUrl || null}
              onChange={(url) => setForm({ ...form, imageUrl: url ?? "" })}
              folder="certificates"
              accept="image/*,application/pdf"
              aspectClass="aspect-[4/3] max-w-[280px]"
              hint="JPG, PNG, WebP, or PDF · max 5 MB"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Btn
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Btn>
              <Btn type="submit" loading={saving}>
                {editingId ? "Save changes" : "Add certificate"}
              </Btn>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DashboardDetailModal content={detail} onClose={() => setDetail(null)} />
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springSoft}
      className="rounded-2xl border-2 border-dashed border-neutral-200 p-12 text-center"
    >
      <Award className="h-10 w-10 mx-auto text-neutral-300" />
      <h3 className="mt-4 font-medium">No certificates yet</h3>
      <p className="text-sm text-neutral-500 mt-1 max-w-xs mx-auto">
        Add credentials, licenses, and course completions.
      </p>
      <div className="mt-5">
        <Btn onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add certificate
        </Btn>
      </div>
    </motion.div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-neutral-200 bg-white p-5"
        >
          <div className="h-4 w-2/3 bg-neutral-100 rounded animate-pulse mb-2" />
          <div className="h-3 w-1/2 bg-neutral-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
