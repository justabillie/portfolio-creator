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
  Users,
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
import {
  DashboardDetailModal,
  type DashboardDetail,
} from "@/components/dashboard-detail-modal";
import { springSoft } from "@/lib/motion";

type Project = {
  id: string;
  title: string;
  role: string | null;
  description: string | null;
  techStack: string[];
  demoUrl: string | null;
  repoUrl: string | null;
};

const emptyForm = {
  title: "",
  role: "",
  description: "",
  techStackInput: "",
  demoUrl: "",
  repoUrl: "",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<DashboardDetail | null>(null);

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
      role: p.role ?? "",
      description: p.description ?? "",
      techStackInput: p.techStack.join(", "),
      demoUrl: p.demoUrl ?? "",
      repoUrl: p.repoUrl ?? "",
    });
    setModalOpen(true);
  }

  function openDetail(p: Project) {
    setDetail({
      type: "project",
      title: p.title,
      role: p.role,
      description: p.description,
      techStack: p.techStack,
      demoUrl: p.demoUrl,
      repoUrl: p.repoUrl,
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      role: form.role || null,
      description: form.description || null,
      techStack: form.techStackInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      demoUrl: form.demoUrl || null,
      repoUrl: form.repoUrl || null,
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
        description="Showcase your best work. Add your role, tech stack, and links."
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
                className="group rounded-xl border border-neutral-200 bg-white p-4 hover:border-neutral-400 hover:shadow-sm transition-all flex flex-col"
              >
                {/* Click body to open detail modal */}
                <button
                  type="button"
                  onClick={() => openDetail(p)}
                  className="text-left w-full flex-1 flex flex-col"
                >
                  <h3 className="font-semibold text-sm leading-tight line-clamp-1 group-hover:underline underline-offset-4">
                    {p.title}
                  </h3>

                  {p.role && (
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-neutral-500">
                      <Users className="h-3 w-3" />
                      {p.role}
                    </div>
                  )}

                  {p.description && (
                    <p className="text-xs text-neutral-500 mt-2 line-clamp-3 leading-relaxed">
                      {p.description}
                    </p>
                  )}

                  {p.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {p.techStack.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600"
                        >
                          {t}
                        </span>
                      ))}
                      {p.techStack.length > 4 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-neutral-400">
                          +{p.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </button>

                {/* Bottom row: links + edit/delete */}
                <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-neutral-100">
                  <div className="flex gap-3 text-[11px]">
                    {p.demoUrl && (
                      <a
                        href={p.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
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
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900"
                      >
                        <Code2 className="h-3 w-3" />
                        Code
                      </a>
                    )}
                  </div>

                  <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(p);
                      }}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
                      aria-label="Edit"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(p.id, p.title);
                      }}
                      className="p-1 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Edit/create dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit project" : "New project"}
            </DialogTitle>
            <DialogDescription>
              Fill in what you built, your role, and where to find it.
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

            <Field
              label="Your role"
              hint="e.g. Solo project · Lead Developer · Frontend · Team of 4"
            >
              <Input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Solo project"
              />
            </Field>

            <Field label="Description">
              <Textarea
                rows={4}
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

      {/* Read-only detail modal */}
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
          className="rounded-xl border border-neutral-200 bg-white p-4 space-y-2"
        >
          <div className="h-3.5 w-1/2 bg-neutral-100 rounded animate-pulse" />
          <div className="h-3 w-full bg-neutral-100 rounded animate-pulse" />
          <div className="h-3 w-3/4 bg-neutral-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
