"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  Link2,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { springSoft } from "@/lib/motion";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/experience", label: "Experience", icon: Briefcase },
  { href: "/dashboard/education", label: "Education", icon: GraduationCap },
  { href: "/dashboard/skills", label: "Skills", icon: Wrench },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/links", label: "Social Links", icon: Link2 },
  { href: "/dashboard/cv", label: "CV / Resume", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar({
  username,
  displayName,
}: {
  username: string;
  displayName: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const SidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-neutral-200">
        <Link
          href="/dashboard"
          className="block font-bold text-lg tracking-tight hover:opacity-80 transition-opacity"
        >
          ポートフォリーヨ
        </Link>
        <p className="text-xs text-neutral-500 mt-1 truncate">
          @{username}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item, i) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springSoft, delay: i * 0.02 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "text-neutral-700 hover:bg-neutral-100 hover:translate-x-0.5"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-neutral-200 space-y-0.5">
        <Link
          href={`/u/${username}`}
          target="_blank"
          className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-100 hover:translate-x-0.5"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          <span className="truncate">View portfolio</span>
        </Link>
        <button
          type="button"
          onClick={logout}
          className="w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-red-50 hover:text-red-700 hover:translate-x-0.5"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="truncate">Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile topbar */}
      <div className="md:hidden sticky top-0 z-30 bg-white border-b border-neutral-200 flex items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="font-bold tracking-tight">
          ポートフォリーヨ
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="p-2 -mr-2 rounded-md hover:bg-neutral-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:shrink-0 md:sticky md:top-0 md:h-screen border-r border-neutral-200 bg-white">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={springSoft}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-neutral-200"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-neutral-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
