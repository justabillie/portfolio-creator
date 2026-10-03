"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, Wrench } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/form-field";
import { Btn } from "@/components/button";
import { PageHeader } from "@/components/page-header";
import { springSoft } from "@/lib/motion";

type Skill = {
  id: string;
  name: string;
  category: string | null;
  proficiency: number | null;
};

const CATEGORIES = ["Languages", "Frameworks", "Tools", "Databases", "Other"];
const emptyForm = { name: "", category: "Languages", proficiency: 3 };

export default function SkillsPage() {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/skills");
    const data = await res.json();
    setItems(data.skills ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditingId(null); setForm(emptyForm); setModalOpen(true);
  }

  function openEdit(x: Skill) {
    setEditingId(x.id);
    setForm({
      name: x.name,
      category: x.category ?? "Other",
      proficiency: x.proficiency ?? 3,
    });
    setModalOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const url = editingId ? `/api/skills/${editingId}` : "/api/skills";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { toast.error(data.error ?? "Failed to save"); return; }
    toast.success(editingId ? "Skill updated" : "Skill added");
    setModalOpen(false);
    load();
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Failed to delete"); return; }
    setItems((p) => p.filter((x) => x.id !== id));
    toast.success("Skill deleted");
  }

  const grouped = CATEGORIES.map((cat) => ({
    cat,
    skills: items.filter((s) => (s.category ?? "Other") === cat),
  })).filter((g) => g.skills.length > 0);

  return (
    <div>
      <PageHeader
        title="Skills"
        description="Languages, frameworks, tools — and how comfortable you are with each."
        action={
          !loading && items.length > 0 ? (
            <Btn onClick={openCreate}>
              <Plus className="h-4 w-4" />
              New skill
            </Btn>
          ) : null
        }
      />

      {loading ? (
        <SkeletonList />
      ) : items.length === 0 ? (
        <EmptyState onAdd={openCreate} />
      ) : (
        <div className="space-y-8">
          {grouped.map((g) => (
            <div key={g.cat}>
              <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
                {g.cat}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <AnimatePresence mode="popLayout">
                  {g.skills.map((s, i) => (
                    <motion.div
                      key={s.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ ...springSoft, delay: i * 0.02 }}
                      className="group rounded-xl border border-neutral-200 bg-white p-4 hover:border-neutral-400 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{s.name}</div>
                          {s.proficiency && (
                            <div className="flex gap-1 mt-2">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <div
                                  key={n}
                                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                                    n <= s.proficiency!
                                      ? "bg-neutral-900"
                                      : "bg-neutral-200"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(s)}
                            className="p-1 rounded text-neutral-400 hover:text-neutral-900"
                            aria-label="Edit"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => remove(s.id, s.name)}
                            className="p-1 rounded text-neutral-400 hover:text-red-600"
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
            </div>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit skill" : "New skill"}</DialogTitle>
            <DialogDescription>
              Pick a category and rate your proficiency from 1 to 5.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4 mt-2">
            <Field label="Name" required>
              <Input
                required autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="TypeScript"
              />
            </Field>

            <Field label="Category">
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>

            <Field label={`Proficiency: ${form.proficiency}/5`}>
              <input
                type="range"
                min={1}
                max={5}
                value={form.proficiency}
                onChange={(e) =>
                  setForm({ ...form, proficiency: Number(e.target.value) })
                }
                className="w-full accent-neutral-900"
              />
            </Field>

            <div className="flex justify-end gap-2 pt-2">
              <Btn type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Btn>
              <Btn type="submit" loading={saving}>{editingId ? "Save changes" : "Add skill"}</Btn>
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
      <Wrench className="h-10 w-10 mx-auto text-neutral-300" />
      <h3 className="mt-4 font-medium">No skills yet</h3>
      <p className="text-sm text-neutral-500 mt-1 max-w-xs mx-auto">
        Add skills you've picked up — from languages to tools.
      </p>
      <div className="mt-5"><Btn onClick={onAdd}><Plus className="h-4 w-4" />Add skill</Btn></div>
    </motion.div>
  );
}

function SkeletonList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-xl border border-neutral-200 bg-white p-4 h-20">
          <div className="h-3 w-2/3 bg-neutral-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
