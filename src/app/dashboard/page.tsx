import Link from "next/link";
import { redirect } from "next/navigation";
import {
  User as UserIcon,
  FolderKanban,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  Link2,
  FileText,
  ArrowRight,
} from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { prisma, withRetry } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Wrapped in withRetry so Neon cold-starts don't kill the dashboard
  const [projects, experiences, educations, skills, certificates, links, cv] =
    await withRetry(() =>
      Promise.all([
        prisma.project.count({ where: { userId: user.id } }),
        prisma.experience.count({ where: { userId: user.id } }),
        prisma.education.count({ where: { userId: user.id } }),
        prisma.skill.count({ where: { userId: user.id } }),
        prisma.certificate.count({ where: { userId: user.id } }),
        prisma.socialLink.count({ where: { userId: user.id } }),
        prisma.cvFile.findUnique({
          where: { userId: user.id },
          select: { id: true },
        }),
      ])
    );

  const profileComplete = Boolean(
    user.profile?.headline && user.profile?.bio
  );
  const published = user.profile?.isPublished ?? false;

  const completion = [
    profileComplete,
    projects > 0,
    experiences > 0,
    educations > 0,
    skills > 0,
    certificates > 0,
    links > 0,
    Boolean(cv),
  ];
  const completedCount = completion.filter(Boolean).length;
  const pct = Math.round((completedCount / completion.length) * 100);

  const cards = [
    {
      href: "/dashboard/profile",
      label: "Profile",
      icon: UserIcon,
      count: profileComplete ? 1 : 0,
      done: profileComplete,
    },
    { href: "/dashboard/projects", label: "Projects", icon: FolderKanban, count: projects },
    { href: "/dashboard/experience", label: "Experience", icon: Briefcase, count: experiences },
    { href: "/dashboard/education", label: "Education", icon: GraduationCap, count: educations },
    { href: "/dashboard/skills", label: "Skills", icon: Wrench, count: skills },
    { href: "/dashboard/certificates", label: "Certificates", icon: Award, count: certificates },
    { href: "/dashboard/links", label: "Social Links", icon: Link2, count: links },
    { href: "/dashboard/cv", label: "CV / Resume", icon: FileText, count: cv ? 1 : 0 },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user.profile?.fullName ?? user.username} 👋`}
        description="Manage your portfolio content and publish when you're ready."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Profile completion</h2>
            <span className="text-2xl font-bold tabular-nums">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
            <div
              className="h-full bg-neutral-900 transition-all duration-500 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-neutral-500 mt-3">
            {completedCount} of {completion.length} sections started
          </p>
        </div>

        <Link
          href={published ? `/u/${user.username}` : "/dashboard/profile"}
          target={published ? "_blank" : undefined}
          className="group rounded-2xl border border-neutral-200 bg-white p-6 hover:border-neutral-400 transition-all hover:shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Public portfolio</h2>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                published
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {published ? "Live" : "Draft"}
            </span>
          </div>
          <p className="text-sm text-neutral-600 mb-4">
            {published
              ? `Visible at /u/${user.username}`
              : "Not published yet. Enable it in Profile settings."}
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
            {published ? "View portfolio" : "Publish now"}
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>

      <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
        Your content
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          const done = c.done ?? c.count > 0;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-xl border border-neutral-200 bg-white p-4 hover:border-neutral-400 hover:-translate-y-0.5 hover:shadow-sm transition-all"
            >
              <Icon className="h-5 w-5 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
              <div className="mt-3 font-medium text-sm">{c.label}</div>
              <div className="text-xs text-neutral-500 mt-0.5">
                {c.label === "Profile"
                  ? done
                    ? "Complete"
                    : "Incomplete"
                  : c.count > 0
                  ? `${c.count} item${c.count === 1 ? "" : "s"}`
                  : "Empty"}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
