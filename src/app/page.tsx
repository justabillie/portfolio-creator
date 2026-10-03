import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Sparkles,
  FolderKanban,
  Briefcase,
  GraduationCap,
  FileText,
  Award,
  Link2,
  Check,
} from "lucide-react";
import { getSessionPayload } from "@/lib/session";

export const metadata = {
  title: "ポートフォリーヨ — Build your portfolio in minutes",
  description:
    "Create a beautiful, professional portfolio website in minutes. No coding required.",
};

export default async function HomePage() {
  // If the user is already logged in, send them to the dashboard
  const session = await getSessionPayload();
  if (session) redirect("/dashboard");

  const features = [
    {
      icon: FolderKanban,
      title: "Projects",
      description: "Showcase your best work with images, links, and tech stacks.",
    },
    {
      icon: Briefcase,
      title: "Experience",
      description: "Timeline of jobs, internships, and freelance work.",
    },
    {
      icon: GraduationCap,
      title: "Education",
      description: "Degrees, diplomas, and academic achievements.",
    },
    {
      icon: Award,
      title: "Certificates",
      description: "Credentials with images and verify links.",
    },
    {
      icon: Link2,
      title: "Social links",
      description: "GitHub, LinkedIn, Twitter — all in one place.",
    },
    {
      icon: FileText,
      title: "CV upload",
      description: "Upload your PDF resume with preview and download.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      {/* ─────── Header ─────── */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight">
            ポートフォリーヨ
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98] transition-all"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* ─────── Hero ─────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-100 via-white to-white"
        />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 pt-20 sm:pt-28 pb-16 sm:pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 bg-white text-xs font-medium text-neutral-600 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Build a portfolio in 5 minutes
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95]">
            Your portfolio,
            <br />
            <span className="bg-gradient-to-r from-neutral-500 to-neutral-900 bg-clip-text text-transparent">
              beautifully made.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            No coding. No design skills. Add your projects, experience, and
            certificates — then share one link that says everything about you.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 active:scale-[0.98] transition-all"
            >
              Create your portfolio — it's free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-neutral-200 bg-white font-medium hover:bg-neutral-50 active:scale-[0.98] transition-all"
            >
              Sign in
            </Link>
          </div>

          <p className="mt-5 text-xs text-neutral-500">
            No credit card required · Free forever for students
          </p>
        </div>
      </section>

      {/* ─────── Preview mockup ─────── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-20 sm:pb-28">
        <div className="relative rounded-2xl border border-neutral-200 bg-white shadow-2xl overflow-hidden">
          {/* Fake browser chrome */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-neutral-200 bg-neutral-50">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <div className="ml-3 flex-1 max-w-md rounded-md bg-white border border-neutral-200 px-3 py-1 text-xs text-neutral-500 truncate">
              yoursite.com/u/yourname
            </div>
          </div>

          {/* Fake portfolio preview */}
          <div className="p-8 sm:p-12 text-left">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-100 shrink-0" />
              <div className="min-w-0">
                <div className="h-5 w-40 bg-neutral-900/80 rounded" />
                <div className="h-3 w-32 bg-neutral-200 rounded mt-2" />
              </div>
            </div>
            <div className="space-y-2 max-w-2xl">
              <div className="h-3 w-full bg-neutral-100 rounded" />
              <div className="h-3 w-5/6 bg-neutral-100 rounded" />
              <div className="h-3 w-2/3 bg-neutral-100 rounded" />
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-neutral-200 overflow-hidden"
                >
                  <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-50" />
                  <div className="p-4 space-y-2">
                    <div className="h-3.5 w-1/2 bg-neutral-900/70 rounded" />
                    <div className="h-2.5 w-full bg-neutral-100 rounded" />
                    <div className="h-2.5 w-3/4 bg-neutral-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────── Features ─────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20 sm:pb-28">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need
          </h2>
          <p className="mt-3 text-neutral-600 max-w-2xl mx-auto">
            All the sections of a great portfolio — ready out of the box.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl border border-neutral-200 bg-white p-6 hover:border-neutral-400 hover:-translate-y-0.5 hover:shadow-sm transition-all"
              >
                <div className="h-10 w-10 rounded-lg bg-neutral-900 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold mt-4">{f.title}</h3>
                <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────── Why section ─────── */}
      <section className="bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 text-center">
            Made for students and early-career developers
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              "No sign-up friction — email and password",
              "Two beautiful templates: Minimal and Modern",
              "Upload images, PDFs, and your CV",
              "Share one link anywhere",
              "Mobile-friendly by default",
              "Free — no credit card ever",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-white" />
                </span>
                <span className="text-sm text-neutral-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─────── CTA ─────── */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-20 sm:py-28 text-center">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
          Ready to build yours?
        </h2>
        <p className="mt-4 text-neutral-600">
          Takes less than 5 minutes. Start with a project or your CV.
        </p>
        <Link
          href="/register"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 active:scale-[0.98] transition-all"
        >
          Get started free
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* ─────── Footer ─────── */}
      <footer className="border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-neutral-500">
          <div>© {new Date().getFullYear()} ポートフォリーヨ</div>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-neutral-900">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-neutral-900">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
