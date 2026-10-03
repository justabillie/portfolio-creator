import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-50">
      <DashboardSidebar
        username={user.username}
        displayName={user.profile?.fullName ?? user.username}
      />
      <main className="flex-1 min-w-0">
        <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
