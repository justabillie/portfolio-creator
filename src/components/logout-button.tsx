"use client";

export function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm text-neutral-600 hover:text-neutral-900"
    >
      Sign out
    </button>
  );
}
