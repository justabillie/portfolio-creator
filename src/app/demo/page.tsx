import Link from "next/link";
import { MinimalTemplate } from "@/components/templates/minimal-template";
import { ModernTemplate } from "@/components/templates/modern-template";
import type { PortfolioData } from "@/lib/portfolio";

type Search = Promise<{ theme?: string }>;

export const metadata = {
  title: "Demo — ポートフォリーヨ",
  description: "See what a portfolio built with ポートフォリーヨ looks like.",
};

const demoData: PortfolioData = {
  id: "demo",
  username: "demo",
  email: "demo@example.com",
  profile: {
    id: "demo-profile",
    userId: "demo",
    fullName: "Mia Chen",
    headline: "Frontend Developer · Design Systems & Motion",
    bio: "I craft interfaces that feel calm and considered. Currently building design systems at a small product studio, and shipping side projects on weekends.",
    photoUrl: "/portfolio_profile.jpg",
    location: "Singapore",
    email: "mia@example.com",
    phone: "+65 8123 4567",
    theme: "minimal",
    isPublished: true,
    updatedAt: new Date(),
  },
  projects: [
    {
      id: "p1",
      userId: "demo",
      title: "Lumen",
      role: "Solo project · Design + Dev",
      description:
        "A lightweight image editor that runs entirely in the browser. Built as an experiment with the Canvas API and Web Workers. No backend, no uploads — everything stays on your device.",
      techStack: ["Svelte", "TypeScript", "Canvas API", "Vite"],
      imageUrl: null,
      demoUrl: "https://example.com/lumen",
      repoUrl: "https://github.com/example/lumen",
      sortOrder: 0,
      createdAt: new Date(),
    },
    {
      id: "p2",
      userId: "demo",
      title: "Cadence",
      role: "Team of 3 · Frontend lead",
      description:
        "A habit tracker that focuses on streaks over stats. Designed and built with two friends over a two-week sprint. My role covered the UI, animations, and the offline-first sync layer.",
      techStack: ["React", "Zustand", "IndexedDB", "Tailwind"],
      imageUrl: null,
      demoUrl: null,
      repoUrl: "https://github.com/example/cadence",
      sortOrder: 1,
      createdAt: new Date(),
    },
    {
      id: "p3",
      userId: "demo",
      title: "Stillpoint",
      role: "Solo project",
      description:
        "A minimal meditation timer for people who dislike apps. One screen, no accounts, no notifications. Just a ring that expands as you breathe.",
      techStack: ["React Native", "Expo", "Reanimated"],
      imageUrl: null,
      demoUrl: "https://example.com/stillpoint",
      repoUrl: "https://github.com/example/stillpoint",
      sortOrder: 2,
      createdAt: new Date(),
    },
    {
      id: "p4",
      userId: "demo",
      title: "Atlas Notes",
      role: "Contract work · Frontend",
      description:
        "A notes app that maps related ideas to each other. Built the entire frontend including the graph view, keyboard-first interaction model, and offline caching.",
      techStack: ["Next.js", "D3.js", "PostgreSQL", "tRPC"],
      imageUrl: null,
      demoUrl: null,
      repoUrl: null,
      sortOrder: 3,
      createdAt: new Date(),
    },
  ],
  experiences: [
    {
      id: "e1",
      userId: "demo",
      company: "Foundry Studio",
      role: "Frontend Developer",
      location: "Singapore (Hybrid)",
      startDate: new Date("2024-08-01"),
      endDate: null,
      description:
        "Building design systems and marketing sites for early-stage startups. Shipped a component library used across six client projects.",
      sortOrder: 0,
    },
    {
      id: "e2",
      userId: "demo",
      company: "Paper Kite",
      role: "Junior Developer",
      location: "Remote",
      startDate: new Date("2023-03-01"),
      endDate: new Date("2024-07-31"),
      description:
        "Worked on customer-facing dashboards in React. Learned a lot about performance profiling and accessibility.",
      sortOrder: 1,
    },
  ],
  educations: [
    {
      id: "ed1",
      userId: "demo",
      institution: "National University of Singapore",
      degree: "B.Comp.",
      field: "Computer Science",
      startDate: new Date("2021-08-01"),
      endDate: new Date("2025-06-30"),
      gpa: "4.2",
      description:
        "Focus on human-computer interaction and web technologies. Led the design team for the student hackathon.",
      sortOrder: 0,
    },
  ],
  skills: [
    { id: "s1", userId: "demo", name: "TypeScript", category: "Languages", proficiency: 5, sortOrder: 0 },
    { id: "s2", userId: "demo", name: "JavaScript", category: "Languages", proficiency: 5, sortOrder: 1 },
    { id: "s3", userId: "demo", name: "Python", category: "Languages", proficiency: 3, sortOrder: 2 },
    { id: "s4", userId: "demo", name: "React", category: "Frameworks", proficiency: 5, sortOrder: 3 },
    { id: "s5", userId: "demo", name: "Next.js", category: "Frameworks", proficiency: 4, sortOrder: 4 },
    { id: "s6", userId: "demo", name: "Svelte", category: "Frameworks", proficiency: 4, sortOrder: 5 },
    { id: "s7", userId: "demo", name: "Tailwind CSS", category: "Frameworks", proficiency: 5, sortOrder: 6 },
    { id: "s8", userId: "demo", name: "PostgreSQL", category: "Databases", proficiency: 3, sortOrder: 7 },
    { id: "s9", userId: "demo", name: "Figma", category: "Tools", proficiency: 5, sortOrder: 8 },
    { id: "s10", userId: "demo", name: "Git & GitHub", category: "Tools", proficiency: 5, sortOrder: 9 },
    { id: "s11", userId: "demo", name: "Playwright", category: "Tools", proficiency: 3, sortOrder: 10 },
  ],
  certificates: [
    {
      id: "c1",
      userId: "demo",
      title: "Google UX Design Professional",
      issuer: "Coursera",
      issueDate: new Date("2024-11-10"),
      credentialUrl: "https://coursera.org/verify",
      imageUrl: null,
      sortOrder: 0,
    },
    {
      id: "c2",
      userId: "demo",
      title: "JavaScript Algorithms and Data Structures",
      issuer: "freeCodeCamp",
      issueDate: new Date("2023-05-20"),
      credentialUrl: "https://freecodecamp.org/certification",
      imageUrl: null,
      sortOrder: 1,
    },
    {
      id: "c3",
      userId: "demo",
      title: "Accessibility Fundamentals",
      issuer: "Deque University",
      issueDate: new Date("2024-02-05"),
      credentialUrl: "https://dequeuniversity.com/verify",
      imageUrl: null,
      sortOrder: 2,
    },
  ],
  socialLinks: [
    { id: "l1", userId: "demo", platform: "GitHub", url: "https://github.com/example", sortOrder: 0 },
    { id: "l2", userId: "demo", platform: "LinkedIn", url: "https://linkedin.com/in/example", sortOrder: 1 },
    { id: "l3", userId: "demo", platform: "Website", url: "https://example.com", sortOrder: 2 },
  ],
  cvFile: null,
};

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const sp = await searchParams;
  const theme = sp.theme === "modern" ? "modern" : "minimal";

  return (
    <>
      {theme === "modern" ? (
        <ModernTemplate data={demoData} />
      ) : (
        <MinimalTemplate data={demoData} />
      )}

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-1 rounded-full bg-neutral-900/90 backdrop-blur-md border border-white/10 shadow-2xl">
        <Link
          href="/demo?theme=minimal"
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            theme === "minimal"
              ? "bg-white text-neutral-900"
              : "text-neutral-300 hover:text-white"
          }`}
        >
          Minimal theme
        </Link>
        <Link
          href="/demo?theme=modern"
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            theme === "modern"
              ? "bg-white text-neutral-900"
              : "text-neutral-300 hover:text-white"
          }`}
        >
          Modern theme
        </Link>
        <Link
          href="/"
          className="px-4 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white transition-colors"
        >
          ← Back
        </Link>
      </div>
    </>
  );
}
