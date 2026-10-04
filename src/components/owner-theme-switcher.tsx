"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function OwnerThemeSwitcher({
  currentTheme,
}: {
  currentTheme: "minimal" | "modern";
}) {
  const router = useRouter();
  const [theme, setTheme] = useState<"minimal" | "modern">(currentTheme);
  const [pending, startTransition] = useTransition();

  async function switchTo(next: "minimal" | "modern") {
    if (next === theme) return;
    setTheme(next);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: next }),
    });
    if (!res.ok) {
      toast.error("Failed to switch theme");
      setTheme(theme);
      return;
    }
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1 p-1 rounded-full bg-neutral-900/90 backdrop-blur-md border border-white/10 shadow-lg">
      <span className="flex items-center gap-1.5 pl-3 pr-2 text-[11px] text-neutral-400">
        {pending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Eye className="h-3 w-3" />
        )}
        Owner view
      </span>
      <button
        onClick={() => switchTo("minimal")}
        disabled={pending}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          theme === "minimal"
            ? "bg-white text-neutral-900"
            : "text-neutral-300 hover:text-white"
        }`}
      >
        Minimal
      </button>
      <button
        onClick={() => switchTo("modern")}
        disabled={pending}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          theme === "modern"
            ? "bg-white text-neutral-900"
            : "text-neutral-300 hover:text-white"
        }`}
      >
        Modern
      </button>
    </div>
  );
}
