"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, Briefcase, MapPin } from "lucide-react";
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

type Experience = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
};

const emptyForm = {
  company: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
};

function formatMonth(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function ExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<DashboardDetail | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/experiences");
    const data = await res.json();
    setItems(data.experiences ?? []);
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

  function openEdit(x: Experience) {
    setEditingId(x.id);
    setForm({
      company: x.company,
      role: x.role,
      location: x.location ?? "",
      startDate: x.startDate.slice(0, 10),
      endDate: x.endDate ? x.endDate.slice(0, 10) : "",
      description: x.description ?? "",
    });
    setModalOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      company: form.company,
      role: form.role,
      location: form.location || null,
      startDate: form.startDate,
      endDate: form.endDate || null,
      description: form.description || null,
    };
    const url = editingId ? `/api/experiences/${editingId}` : "/api/experiences";
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
    toast.success(editingId ? "Experience updated" : "Experience added");
    setModalOpen(false);
    load();
  }

  async function remove(id: string, role: string) {
    if (!confirm(`Delete "${role}"?`)) return;
    const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete");
      return;
    }
    setItems((p) => p.filter((x) => x.id !== id));
    toast.success("Experience deleted");
  }

  return (
    <div>
      <PageHeader
        title="Experience"
        description="Your work history — internships, jobs, freelance, volunteering."
        action={
          !loading && items.length > 0 ? (
            <Btn onClick={openCreate}>
              <Plus className="h-4 w-4" />
              New experience
            </Btn>
          ) : null
        }
      />

      {loading ? (
        <SkeletonList />
      ) : items.length === 0 ? (
        <EmptyState onAdd={openCreate} />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((x, i) => (
              <motion.div
                key={x.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ ...springSoft, delay: i * 0.03 }}
                className="group rounded-2xl border border-neutral-200 bg-white p-5 hover:border-neutral-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <button
                    onClick={() =>
                      setDetail({
                        type: "experience",
                        role: x.role,
                        company: x.company,
                        location: x.location,
                        description: x.description,
                        startDate: x.startDate,
                        endDate: x.endDate,
                      })
                    }
                    className="flex-1 min-w-0 text-left"
                  >
                    <h3 className="font-semibold text-base group-hover:underline underline-offset-4">
                      {x.role}
                    </h3>
                    <p className="text-sm text-neutral-700 mt-0.5">
                      {x.company}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-neutral-500">
                      <span>
                        {formatMonth(x.startDate)} –{" "}
                        {x.endDate ? formatMonth(x.endDate) : "Present"}
                      </span>
                      {x.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {x.location}
                        </span>
                      )}
                    </div>
                    {x.description && (
                      <p className="text-sm text-neutral-600 mt-3 whitespace-pre-line line-clamp-2">
                        {x.description}
                      </p>
                    )}
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
                      onClick={() => remove(x.id, x.role)}
                      className="p-1.5 rounded-md text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
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
              {editingId ? "Edit experience" : "New experience"}
            </DialogTitle>
            <DialogDescription>
              Add a role, company, and what you worked on.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Role" required>
                <Input
                  required
                  autoFocus
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Software Engineer Intern"
                />
              </Field>
              <Field label="Company" required>
                <Input
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Tech Corp"
                />
              </Field>
            </div>

            <Field label="Location">
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Yangon, Myanmar (or Remote)"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Start date" required>
                <Input
                  required
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </Field>
              <Field label="End date" hint="Leave blank if current">
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </Field>
            </div>

            <Field label="Description">
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What did you work on? What did you learn?"
              />
            </Field>

            <div className="flex justify-end gap-2 pt-2">
              <Btn
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Btn>
              <Btn type="submit" loading={saving}>
                {editingId ? "Save changes" : "Add experience"}
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
      <Briefcase className="h-10 w-10 mx-auto text-neutral-300" />
      <h3 className="mt-4 font-medium">No experience yet</h3>
      <p className="text-sm text-neutral-500 mt-1 max-w-xs mx-auto">
        Add internships, jobs, or volunteer work to show your journey.
      </p>
      <div className="mt-5">
        <Btn onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add experience
        </Btn>
      </div>
    </motion.div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="h-4 w-1/3 bg-neutral-100 rounded animate-pulse mb-2" />
          <div className="h-3 w-1/4 bg-neutral-100 rounded animate-pulse mb-3" />
          <div className="h-3 w-full bg-neutral-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
