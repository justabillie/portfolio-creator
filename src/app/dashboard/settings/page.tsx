"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, KeyRound, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Field, Input } from "@/components/form-field";
import { Btn } from "@/components/button";
import { PageHeader } from "@/components/page-header";
import { springSoft } from "@/lib/motion";

type User = { id: string; email: string; username: string };

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Account form
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [savingAccount, setSavingAccount] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    if (data.user) {
      setUser(data.user);
      setEmail(data.user.email);
      setUsername(data.user.username);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function saveAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSavingAccount(true);
    const res = await fetch("/api/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username }),
    });
    const data = await res.json();
    setSavingAccount(false);
    if (!res.ok) {
      toast.error(data.error ?? "Failed to save");
      return;
    }
    toast.success("Account updated");
    setUser({ ...user, email, username });
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setSavingPassword(true);
    const res = await fetch("/api/account/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setSavingPassword(false);
    if (!res.ok) {
      toast.error(data.error ?? "Failed to update password");
      return;
    }
    toast.success("Password updated");
    setCurrentPassword("");
    setNewPassword("");
  }

  async function deleteAccount() {
    if (deleteConfirm !== user?.username) {
      toast.error("Type your username exactly to confirm");
      return;
    }
    if (!confirm("This will permanently delete your account and all data. Continue?")) return;
    setDeleting(true);
    const res = await fetch("/api/account", { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete");
      setDeleting(false);
      return;
    }
    toast.success("Account deleted");
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Settings" />
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 h-64 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Settings"
        description="Manage your account credentials and preferences."
      />

      <div className="space-y-6">
        {/* ─────── Account ─────── */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springSoft}
          className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 mb-5">
            <UserIcon className="h-4 w-4 text-neutral-500" />
            <h2 className="font-semibold">Account</h2>
          </div>

          <form onSubmit={saveAccount} className="space-y-4">
            <Field label="Username" hint="Used in your public URL: /u/username">
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="billie"
              />
            </Field>

            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            <div className="flex justify-end pt-1">
              <Btn type="submit" loading={savingAccount} size="sm">
                Save changes
              </Btn>
            </div>
          </form>
        </motion.section>

        {/* ─────── Password ─────── */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSoft, delay: 0.05 }}
          className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 mb-5">
            <KeyRound className="h-4 w-4 text-neutral-500" />
            <h2 className="font-semibold">Password</h2>
          </div>

          <form onSubmit={savePassword} className="space-y-4">
            <Field label="Current password" required>
              <Input
                required
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Field>

            <Field label="New password" required hint="At least 8 characters">
              <Input
                required
                type="password"
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Field>

            <div className="flex justify-end pt-1">
              <Btn type="submit" loading={savingPassword} size="sm">
                Update password
              </Btn>
            </div>
          </form>
        </motion.section>

        {/* ─────── Danger zone ─────── */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSoft, delay: 0.1 }}
          className="rounded-2xl border border-red-200 bg-red-50/30 p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 mb-2 text-red-700">
            <AlertTriangle className="h-4 w-4" />
            <h2 className="font-semibold">Delete account</h2>
          </div>
          <p className="text-sm text-neutral-600 mb-4">
            This permanently deletes your account, portfolio, projects, CV, and
            all uploaded files. This action cannot be undone.
          </p>

          <Field
            label={`Type your username (${user?.username}) to confirm`}
          >
            <Input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={user?.username}
            />
          </Field>

          <div className="flex justify-end mt-4">
            <Btn
              variant="danger"
              onClick={deleteAccount}
              loading={deleting}
              disabled={deleteConfirm !== user?.username}
              className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-40"
            >
              Delete my account
            </Btn>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
