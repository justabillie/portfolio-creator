"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Code2,
  FolderKanban,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/form-field";
import { Btn } from "@/components/button";
import { PageHeader } from "@/components/page-header";
import { FileUpload } from "@/components/file-upload";
import { springSoft } from "@/lib/motion";

type Project = {
  id: string;
  title: string;
  description: string | null;
  techStack: string[];
  imageUrl: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  startDate: string | null;
  endDate: string | null;
};

const emptyForm = {
  title: "",
  description: "",
  techStackInput: "",
  imageUrl: "",
  demoUrl: "",
  repoUrl: "",
  startDate: "",
  endDate: "",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data.projects ?? []);
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

  function openEdit(p: Project) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description ?? "",
      techStackInput: p.techStack.join(", "),
      imageUrl: p.imageUrl ?? "",
      demoUrl: p.demoUrl ?? "",
      repoUrl: p.repoUrl ?? "",
      startDate: p.startDate ? p.startDate.slice(0, 10) : "",
      endDate: p.endDate ? p.endDate.slice(0, 10) : "",
    });
    setModalOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description || null,
      techStack: form.techStackInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      imageUrl: form.imageUrl || null,
      demoUrl: form.demoUrl || null,
      repoUrl: form.repoUrl || null,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
    };
    const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
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
    toast.success(editingId ? "Project updated" : "Project added");
    setModalOpen(false);
    load();
  }

  async function remove(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete");
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.success("Project deleted");
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Showcase your best work. Add links, tech stack, and screenshots."
        action={
          !loading && projects.length > 0 ? (
            <Btn onClick={openCreate}>
              <Plus className="h-4 w-4" />
              New project
            </Btn>
          ) : null
        }
      />

      {loading ? (
        <SkeletonGrid />
      ) : projects.length === 0 ? (
        <EmptyState onAdd={openCreate} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ ...springSoft, delay: i * 0.03 }}
                className="group rounded-xl border border-neutral-200 bg-white overflow-hidden hover:border-neutral-400 hover:shadow-sm transition-all flex flex-col"
              >
                {/* Image or slim placeholder — only ~40% of card height */}
                {p.imageUrl ? (
                  <div className="aspect-[16/9] bg-neutral-100 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-neutral-50 flex items-center justify-center shrink-0 border-b border-neutral-100">
                    <ImageIcon className="h-6 w-6 text-neutral-300" />
                  </div>
                )}

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm leading-tight line-clamp-1">
                      {p.title}
                    </h3>
                    <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
                        aria-label="Edit"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => remove(p.id, p.title)}
                        className="p-1 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {p.description && (
                    <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  )}

                  {p.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {p.techStack.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600"
                        >
                          {t}
                        </span>
                      ))}
                      {p.techStack.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-neutral-400">
                          +{p.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {(p.demoUrl || p.repoUrl) && (
                    <div className="flex gap-3 mt-auto pt-3 text-[11px]">
                      {p.demoUrl && (
                        <a
                          href={p.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Live
                        </a>
                      )}
                      {p.repoUrl && (
                        <a
                          href={p.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900"
                        >
                          <Code2 className="h-3 w-3" />
                          Code
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit project" : "New project"}
            </DialogTitle>
            <DialogDescription>
              Fill in what you built, where to find it, and what you learned.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4 mt-2">
            <Field label="Title" required>
              <Input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="ポートフォリーヨ"
                autoFocus
              />
            </Field>

            <Field label="Description">
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="What does it do? What did you learn?"
              />
            </Field>

            <Field
              label="Tech stack"
              hint="Comma-separated · React, Node.js, PostgreSQL"
            >
              <Input
                value={form.techStackInput}
                onChange={(e) =>
                  setForm({ ...form, techStackInput: e.target.value })
                }
                placeholder="React, TypeScript, Tailwind"
              />
            </Field>

            <FileUpload
              label="Cover image"
              value={form.imageUrl || null}
              onChange={(url) => setForm({ ...form, imageUrl: url ?? "" })}
              folder="projects"
              accept="image/*"
              aspectClass="aspect-video max-w-[280px]"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Demo URL">
                <Input
                  value={form.demoUrl}
                  onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                  placeholder="https://…"
                />
              </Field>
              <Field label="Repository URL">
                <Input
                  value={form.repoUrl}
                  onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
                  placeholder="https://github.com/…"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Start date">
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                />
              </Field>
              <Field label="End date">
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                />
              </Field>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Btn
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Btn>
              <Btn type="submit" loading={saving}>
                {editingId ? "Save changes" : "Add project"}
              </Btn>
            </div>
          </form>
        </DialogContent>
      </Dialog>
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
      <FolderKanban className="h-10 w-10 mx-auto text-neutral-300" />
      <h3 className="mt-4 font-medium">No projects yet</h3>
      <p className="text-sm text-neutral-500 mt-1 max-w-xs mx-auto">
        Add your first project to showcase what you've built.
      </p>
      <div className="mt-5">
        <Btn onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add your first project
        </Btn>
      </div>
    </motion.div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-neutral-200 bg-white overflow-hidden"
        >
          <div className="aspect-[16/9] bg-neutral-100 animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-3.5 w-1/2 bg-neutral-100 rounded animate-pulse" />
            <div className="h-3 w-full bg-neutral-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
