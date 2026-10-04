import Link from "next/link";
import { MinimalTemplate } from "@/components/templates/minimal-template";
import { ModernTemplate } from "@/components/templates/modern-template";
import type { PortfolioData } from "@/lib/portfolio";

type Params = Promise<{ theme?: string }>;
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
    fullName: "Alex Tanaka",
    headline: "Full-Stack Developer · React & Node",
    bio: "I build calm, functional web apps that people actually enjoy using. Currently studying Computer Science and shipping side projects on weekends.",
    photoUrl: null,
    location: "Yangon, Myanmar",
    email: "alex@example.com",
    phone: "+95 9 123 456 789",
    theme: "minimal",
    isPublished: true,
    updatedAt: new Date(),
  },
  projects: [
    {
      id: "p1",
      userId: "demo",
      title: "ポートフォリーヨ",
      role: "Solo Project",
      description:
        "A portfolio builder for students. Add projects, experience, and certificates — then share one link that says everything about you. Includes two themes and file uploads.",
      techStack: ["Next.js", "TypeScript", "Tailwind", "Prisma", "PostgreSQL"],
      imageUrl: null,
      demoUrl: "https://portfolio-creator-nu.vercel.app",
      repoUrl: "https://github.com/justabillie/portfolio-creator",
      sortOrder: 0,
      createdAt: new Date(),
    },
    {
      id: "p2",
      userId: "demo",
      title: "Filter-X",
      role: "UI Developer",
      description:
        "A web app that filters and processes data based on user-defined rules. Built to practice React state management and backend integration.",
      techStack: ["React", "TypeScript", "Tailwind", "Node.js"],
      imageUrl: null,
      demoUrl: null,
      repoUrl: "https://github.com/example/filter-x",
      sortOrder: 1,
      createdAt: new Date(),
    },
    {
      id: "p3",
      userId: "demo",
      title: "Dorabola",
      role: "Solo Project",
      description:
        "A desktop application that recommends Korean dramas based on personal viewing history and ratings. Users can rate dramas they've watched, and the app learns their preferences over time.",
      techStack: ["Python", "Tkinter", "Pandas", "SQLite"],
      imageUrl: null,
      demoUrl: null,
      repoUrl: "https://github.com/example/dorabola",
      sortOrder: 2,
      createdAt: new Date(),
    },
    {
      id: "p4",
      userId: "demo",
      title: "DBitual",
      role: "Team of 3 · Backend",
      description:
        "A personal habit diary that helps track daily activities through custom timelines. Features a monthly calendar view, time-block tracking, and exportable reports.",
      techStack: ["Python", "Flask", "SQLite", "JavaScript"],
      imageUrl: null,
      demoUrl: null,
      repoUrl: "https://github.com/example/dbitual",
      sortOrder: 3,
      createdAt: new Date(),
    },
  ],
  experiences: [
    {
      id: "e1",
      userId: "demo",
      company: "TechCorp Myanmar",
      role: "Software Engineer Intern",
      location: "Yangon (Hybrid)",
      startDate: new Date("2025-06-01"),
      endDate: null,
      description:
        "Building internal tools with React and Node. Shipped a dashboard that reduced manual reporting time by 40%.",
      sortOrder: 0,
    },
    {
      id: "e2",
      userId: "demo",
      company: "Freelance",
      role: "Web Developer",
      location: "Remote",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-05-31"),
      description:
        "Built landing pages and small business websites for local clients. Handled design, development, and deployment.",
      sortOrder: 1,
    },
  ],
  educations: [
    {
      id: "ed1",
      userId: "demo",
      institution: "University of Information Technology",
      degree: "B.Sc.",
      field: "Computer Science",
      startDate: new Date("2023-11-01"),
      endDate: new Date("2028-10-31"),
      gpa: "3.9",
      description:
        "Relevant coursework: Data Structures, Algorithms, Databases, Web Development.",
      sortOrder: 0,
    },
  ],
  skills: [
    { id: "s1", userId: "demo", name: "TypeScript", category: "Languages", proficiency: 5, sortOrder: 0 },
    { id: "s2", userId: "demo", name: "Python", category: "Languages", proficiency: 4, sortOrder: 1 },
    { id: "s3", userId: "demo", name: "JavaScript", category: "Languages", proficiency: 5, sortOrder: 2 },
    { id: "s4", userId: "demo", name: "React", category: "Frameworks", proficiency: 5, sortOrder: 3 },
    { id: "s5", userId: "demo", name: "Next.js", category: "Frameworks", proficiency: 4, sortOrder: 4 },
    { id: "s6", userId: "demo", name: "Tailwind CSS", category: "Frameworks", proficiency: 5, sortOrder: 5 },
    { id: "s7", userId: "demo", name: "PostgreSQL", category: "Databases", proficiency: 4, sortOrder: 6 },
    { id: "s8", userId: "demo", name: "Git & GitHub", category: "Tools", proficiency: 5, sortOrder: 7 },
    { id: "s9", userId: "demo", name: "Docker", category: "Tools", proficiency: 3, sortOrder: 8 },
    { id: "s10", userId: "demo", name: "Figma", category: "Tools", proficiency: 4, sortOrder: 9 },
  ],
  certificates: [
    {
      id: "c1",
      userId: "demo",
      title: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      issueDate: new Date("2025-03-15"),
      credentialUrl: "https://aws.amazon.com/verification",
      imageUrl: null,
      sortOrder: 0,
    },
    {
      id: "c2",
      userId: "demo",
      title: "Meta Front-End Developer",
      issuer: "Coursera",
      issueDate: new Date("2024-11-20"),
      credentialUrl: "https://coursera.org/verify",
      imageUrl: null,
      sortOrder: 1,
    },
  ],
  socialLinks: [
    { id: "l1", userId: "demo", platform: "GitHub", url: "https://github.com/justabillie", sortOrder: 0 },
    { id: "l2", userId: "demo", platform: "LinkedIn", url: "https://linkedin.com", sortOrder: 1 },
    { id: "l3", userId: "demo", platform: "Twitter", url: "https://twitter.com", sortOrder: 2 },
  ],
  cvFile: null,
};

export default async function DemoPage({
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const sp = await searchParams;
  const theme = sp.theme === "modern" ? "modern" : "minimal";

  return (
    <>
      {/* Floating switcher */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-1 rounded-full bg-neutral-900/90 backdrop-blur-md border border-white/10 shadow-lg">
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

      {/* Top padding so the floating switcher doesn't cover content */}
      <div className="pt-16">
        {theme === "modern" ? (
          <ModernTemplate data={demoData} />
        ) : (
          <MinimalTemplate data={demoData} />
        )}
      </div>
    </>
  );
}
