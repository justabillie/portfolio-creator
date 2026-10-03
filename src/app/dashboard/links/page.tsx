"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, Link2, ExternalLink } from "lucide-react";
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

type Link = { id: string; platform: string; url: string };

const PLATFORMS = ["GitHub", "LinkedIn", "Twitter", "Website", "Email", "Phone", "Other"];
const emptyForm = { platform: "GitHub", url: "" };

export default function LinksPage() {
  const [items, setItems] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/social-links");
    const data = await res.json();
    setItems(data.socialLinks ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditingId(null); setForm(emptyForm); setModalOpen(true);
  }

  function openEdit(x: Link) {
    setEditingId(x.id);
    setForm({ platform: x.platform, url: x.url });
    setModalOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const url = editingId ? `/api/social-links/${editingId}` : "/api/social-links";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { toast.error(data.error ?? "Failed to save"); return; }
    toast.success(editingId ? "Link updated" : "Link added");
    setModalOpen(false);
    load();
  }

  async function remove(id: string, platform: string) {
    if (!confirm(`Delete "${platform}" link?`)) return;
    const res = await fetch(`/api/social-links/${id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Failed to delete"); return; }
    setItems((p) => p.filter((x) => x.id !== id));
    toast.success("Link deleted");
  }

  return (
    <div>
      <PageHeader
        title="Social Links"
        description="GitHub, LinkedIn, Twitter, and anywhere else you can be found."
        action={
          !loading && items.length > 0 ? (
            <Btn onClick={openCreate}>
              <Plus className="h-4 w-4" />
              New link
            </Btn>
          ) : null
        }
      />

      {loading ? (
        <SkeletonList />
      ) : items.length === 0 ? (
        <EmptyState onAdd={openCreate} />
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {items.map((x, i) => (
              <motion.div
                key={x.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ ...springSoft, delay: i * 0.02 }}
                className="group rounded-xl border border-neutral-200 bg-white p-4 hover:border-neutral-400 hover:shadow-sm transition-all flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">
                    {x.platform}
                  </div>
                  <a
                    href={x.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm truncate block text-neutral-800 hover:underline mt-0.5 inline-flex items-center gap-1"
                  >
                    {x.url}
                    <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />
                  </a>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(x)}
                    className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                    aria-label="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => remove(x.id, x.platform)}
                    className="p-1.5 rounded-md text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit link" : "New link"}</DialogTitle>
            <DialogDescription>
              Add a platform and paste the full URL.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4 mt-2">
            <Field label="Platform">
              <Select
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
              >
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </Select>
            </Field>

            <Field label="URL" required>
              <Input
                required autoFocus
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://github.com/yourname"
              />
            </Field>

            <div className="flex justify-end gap-2 pt-2">
              <Btn type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Btn>
              <Btn type="submit" loading={saving}>{editingId ? "Save changes" : "Add link"}</Btn>
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
      <Link2 className="h-10 w-10 mx-auto text-neutral-300" />
      <h3 className="mt-4 font-medium">No links yet</h3>
      <p className="text-sm text-neutral-500 mt-1 max-w-xs mx-auto">
        Add your GitHub, LinkedIn, and anywhere else you can be found.
      </p>
      <div className="mt-5"><Btn onClick={onAdd}><Plus className="h-4 w-4" />Add link</Btn></div>
    </motion.div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-neutral-200 bg-white p-4 h-16">
          <div className="h-3 w-1/4 bg-neutral-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
