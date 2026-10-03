"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Pencil, Mail, MapPin, Phone, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, Input, Textarea, Select } from "@/components/form-field";
import { Btn } from "@/components/button";
import { PageHeader } from "@/components/page-header";
import { FileUpload } from "@/components/file-upload";
import { springSoft } from "@/lib/motion";

type Profile = {
  fullName: string;
  headline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  photoUrl: string;
  theme: "minimal" | "modern";
  isPublished: boolean;
};

const empty: Profile = {
  fullName: "",
  headline: "",
  bio: "",
  location: "",
  email: "",
  phone: "",
  photoUrl: "",
  theme: "minimal",
  isPublished: false,
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(empty);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Profile>(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/profile");
    const data = await res.json();
    if (data.profile) {
      const p: Profile = {
        fullName: data.profile.fullName ?? "",
        headline: data.profile.headline ?? "",
        bio: data.profile.bio ?? "",
        location: data.profile.location ?? "",
        email: data.profile.email ?? "",
        phone: data.profile.phone ?? "",
        photoUrl: data.profile.photoUrl ?? "",
        theme: data.profile.theme ?? "minimal",
        isPublished: data.profile.isPublished ?? false,
      };
      setProfile(p);
      setForm(p);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openEdit() {
    setForm(profile);
    setModalOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      toast.error(data.error ?? "Failed to save");
      return;
    }
    toast.success("Profile updated");
    setProfile(form);
    setModalOpen(false);
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Profile" />
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 h-64 animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Your public identity. This appears at the top of your portfolio."
        action={
          <Btn onClick={openEdit}>
            <Pencil className="h-4 w-4" />
            Edit profile
          </Btn>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springSoft}
        className="rounded-2xl border border-neutral-200 bg-white overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {profile.photoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profile.photoUrl}
                alt={profile.fullName}
                className="h-24 w-24 rounded-2xl object-cover shrink-0 ring-1 ring-neutral-200"
              />
            ) : (
              <div className="h-24 w-24 rounded-2xl bg-neutral-100 flex items-center justify-center shrink-0">
                <UserIcon className="h-8 w-8 text-neutral-300" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold">
                {profile.fullName || "No name set"}
              </h2>
              {profile.headline && (
                <p className="text-neutral-600 mt-1">{profile.headline}</p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-neutral-500">
                {profile.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location}
                  </span>
                )}
                {profile.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {profile.email}
                  </span>
                )}
                {profile.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {profile.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {profile.bio && (
            <p className="mt-6 text-neutral-700 leading-relaxed whitespace-pre-line">
              {profile.bio}
            </p>
          )}
        </div>

        <div className="border-t border-neutral-100 bg-neutral-50/50 px-6 sm:px-8 py-4 flex flex-wrap items-center gap-4 text-xs">
          <span className="text-neutral-500">Theme:</span>
          <span className="font-medium capitalize">{profile.theme}</span>
          <span className="text-neutral-300">·</span>
          <span className="text-neutral-500">Status:</span>
          <span
            className={`font-medium ${
              profile.isPublished ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            {profile.isPublished ? "Published" : "Draft"}
          </span>
        </div>
      </motion.div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update your public information. Changes appear on your portfolio
              immediately.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-5 mt-2">
            <FileUpload
              label="Profile photo"
              value={form.photoUrl || null}
              onChange={(url) => setForm({ ...form, photoUrl: url ?? "" })}
              folder="profile"
              accept="image/*"
              aspectClass="aspect-square max-w-[180px]"
              hint="Square images look best. Max 5 MB."
            />

            <Field label="Full name" required>
              <Input
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Billie Doe"
              />
            </Field>

            <Field label="Headline" hint="One line describing what you do.">
              <Input
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="Software Engineer · React & Node"
              />
            </Field>

            <Field label="Bio">
              <Textarea
                rows={5}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="A short intro about yourself…"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Location">
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Yangon, Myanmar"
                />
              </Field>
              <Field label="Contact email">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Phone">
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+95…"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Portfolio theme">
                <Select
                  value={form.theme}
                  onChange={(e) =>
                    setForm({ ...form, theme: e.target.value as "minimal" | "modern" })
                  }
                >
                  <option value="minimal">Minimal</option>
                  <option value="modern">Modern</option>
                </Select>
              </Field>
              <Field
                label="Publish"
                hint="Toggle on to make your portfolio public."
              >
                <label className="flex items-center gap-2 mt-2 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) =>
                      setForm({ ...form, isPublished: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-neutral-300 accent-neutral-900"
                  />
                  Publish my portfolio
                </label>
              </Field>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Btn type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Btn>
              <Btn type="submit" loading={saving}>
                Save changes
              </Btn>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
