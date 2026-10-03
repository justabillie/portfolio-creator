"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, ExternalLink, Code2 } from "lucide-react";
import type { PortfolioData } from "@/lib/portfolio";
import { Reveal } from "@/components/reveal";
import {
  PortfolioDetailModal,
  type DetailContent,
} from "@/components/portfolio-detail-modal";

function fmtMonth(iso: string | Date) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function MinimalTemplate({ data }: { data: PortfolioData }) {
  const {
    profile,
    projects,
    experiences,
    educations,
    skills,
    certificates,
    socialLinks,
    cvFile,
  } = data;

  const [detail, setDetail] = useState<DetailContent | null>(null);

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>(
    (acc, s) => {
      const k = s.category ?? "Other";
      acc[k] = acc[k] ?? [];
      acc[k].push(s);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <div className="max-w-2xl mx-auto px-6 sm:px-8 py-14 sm:py-20">
        <Reveal>
          <header>
            {profile?.photoUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profile.photoUrl}
                alt={profile.fullName}
                className="w-16 h-16 rounded-full object-cover mb-6"
              />
            )}
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-none">
              {profile?.fullName ?? data.username}
            </h1>
            {profile?.headline && (
              <p className="text-lg text-neutral-500 mt-4 leading-snug">
                {profile.headline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-sm text-neutral-500">
              {profile?.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" />
                  {profile.location}
                </span>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-neutral-900"
                >
                  <Mail className="h-3 w-3" />
                  {profile.email}
                </a>
              )}
              {profile?.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3 w-3" />
                  {profile.phone}
                </span>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm">
                {socialLinks.map((l) => (
                  <a
                    key={l.id}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-900 hover:text-neutral-500 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900 transition-colors"
                  >
                    {l.platform}
                  </a>
                ))}
              </div>
            )}

            {profile?.bio && (
              <p className="mt-8 text-[15px] leading-7 text-neutral-700 whitespace-pre-line">
                {profile.bio}
              </p>
            )}
          </header>
        </Reveal>

        {experiences.length > 0 && (
          <Reveal delay={0.05}>
            <section className="mt-16">
              <Heading>Experience</Heading>
              <div className="relative border-l border-neutral-200 ml-1 space-y-8">
                {experiences.map((e) => (
                  <button
                    key={e.id}
                    onClick={() =>
                      setDetail({
                        type: "experience",
                        role: e.role,
                        company: e.company,
                        location: e.location,
                        description: e.description,
                        startDate: e.startDate,
                        endDate: e.endDate,
                      })
                    }
                    className="relative pl-6 text-left w-full group hover:opacity-80 transition-opacity"
                  >
                    <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-neutral-900 -translate-x-[4.5px] ring-4 ring-white" />
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="font-semibold text-base group-hover:underline underline-offset-4">
                        {e.role}
                      </h3>
                      <span className="text-xs text-neutral-400 tabular-nums">
                        {fmtMonth(e.startDate)} –{" "}
                        {e.endDate ? fmtMonth(e.endDate) : "Present"}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">
                      {e.company}
                      {e.location && (
                        <span className="text-neutral-400"> · {e.location}</span>
                      )}
                    </p>
                    {e.description && (
                      <p className="text-sm text-neutral-600 mt-2 whitespace-pre-line leading-relaxed line-clamp-3">
                        {e.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {projects.length > 0 && (
          <Reveal delay={0.05}>
            <section className="mt-16">
              <Heading>Projects</Heading>
              <div className="space-y-8">
                {projects.map((p) => (
                  <div key={p.id} className="group">
                    <button
                      onClick={() =>
                        setDetail({
                          type: "project",
                          title: p.title,
                          description: p.description,
                          techStack: p.techStack,
                          imageUrl: p.imageUrl,
                          demoUrl: p.demoUrl,
                          repoUrl: p.repoUrl,
                          startDate: p.startDate,
                          endDate: p.endDate,
                        })
                      }
                      className="text-left w-full"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="font-semibold text-base group-hover:underline underline-offset-4 decoration-neutral-300">
                          {p.title}
                        </h3>
                      </div>
                      {p.description && (
                        <p className="text-sm text-neutral-600 mt-2 whitespace-pre-line leading-relaxed line-clamp-3">
                          {p.description}
                        </p>
                      )}
                      {p.techStack.length > 0 && (
                        <p className="text-xs text-neutral-400 mt-2">
                          {p.techStack.join(" · ")}
                        </p>
                      )}
                    </button>

                    {/* Links row — always visible */}
                    {(p.demoUrl || p.repoUrl) && (
                      <div className="flex flex-wrap gap-3 mt-3 text-xs">
                        {p.demoUrl && (
                          <a
                            href={p.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900 underline underline-offset-4"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Live demo
                          </a>
                        )}
                        {p.repoUrl && (
                          <a
                            href={p.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900 underline underline-offset-4"
                          >
                            <Code2 className="h-3 w-3" />
                            Source code
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {educations.length > 0 && (
          <Reveal delay={0.05}>
            <section className="mt-16">
              <Heading>Education</Heading>
              <div className="relative border-l border-neutral-200 ml-1 space-y-6">
                {educations.map((ed) => (
                  <button
                    key={ed.id}
                    onClick={() =>
                      setDetail({
                        type: "education",
                        degree: ed.degree,
                        field: ed.field,
                        institution: ed.institution,
                        gpa: ed.gpa,
                        description: ed.description,
                        startDate: ed.startDate,
                        endDate: ed.endDate,
                      })
                    }
                    className="relative pl-6 text-left w-full group hover:opacity-80 transition-opacity"
                  >
                    <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-neutral-900 -translate-x-[4.5px] ring-4 ring-white" />
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="font-semibold group-hover:underline underline-offset-4">
                        {ed.degree}
                        {ed.field && ` · ${ed.field}`}
                      </h3>
                      <span className="text-xs text-neutral-400 tabular-nums">
                        {fmtMonth(ed.startDate)} –{" "}
                        {ed.endDate ? fmtMonth(ed.endDate) : "Present"}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">
                      {ed.institution}
                      {ed.gpa && (
                        <span className="text-neutral-400"> · GPA {ed.gpa}</span>
                      )}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {skills.length > 0 && (
          <Reveal delay={0.05}>
            <section className="mt-16">
              <Heading>Skills</Heading>
              <div className="space-y-3">
                {Object.entries(skillsByCategory).map(([cat, list]) => (
                  <div
                    key={cat}
                    className="grid grid-cols-[90px_1fr] gap-4 text-sm"
                  >
                    <span className="text-neutral-400 text-xs uppercase tracking-widest pt-0.5">
                      {cat}
                    </span>
                    <span className="text-neutral-800">
                      {list.map((s) => s.name).join(" · ")}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {certificates.length > 0 && (
          <Reveal delay={0.05}>
            <section className="mt-16">
              <Heading>Certificates</Heading>
              <div className="space-y-4">
                {certificates.map((c) => (
                  <div key={c.id}>
                    <button
                      onClick={() =>
                        setDetail({
                          type: "certificate",
                          title: c.title,
                          issuer: c.issuer,
                          issueDate: c.issueDate,
                          credentialUrl: c.credentialUrl,
                          imageUrl: c.imageUrl,
                        })
                      }
                      className="text-left w-full group hover:opacity-80 transition-opacity block"
                    >
                      <div className="flex items-baseline justify-between gap-4 flex-wrap">
                        <h3 className="text-sm font-semibold group-hover:underline underline-offset-4">
                          {c.title}
                        </h3>
                        <span className="text-xs text-neutral-400 tabular-nums">
                          {c.issueDate && fmtMonth(c.issueDate)}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">{c.issuer}</p>
                    </button>
                    {(c.credentialUrl ||
                      (c.imageUrl && c.imageUrl.toLowerCase().endsWith(".pdf"))) && (
                      <div className="flex gap-3 mt-1.5 text-xs">
                        {c.credentialUrl && (
                          <a
                            href={c.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900 underline underline-offset-4"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Verify
                          </a>
                        )}
                        {c.imageUrl && c.imageUrl.toLowerCase().endsWith(".pdf") && (
                          <a
                            href={c.imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900 underline underline-offset-4"
                          >
                            PDF
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {cvFile && (
          <Reveal delay={0.05}>
            <section className="mt-16">
              <Heading>Resume</Heading>
              <div className="flex gap-4 text-sm">
                <a
                  href={cvFile.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4"
                >
                  Open PDF
                </a>
                <a
                  href={cvFile.fileUrl}
                  download={cvFile.fileName}
                  className="underline underline-offset-4"
                >
                  Download
                </a>
              </div>
            </section>
          </Reveal>
        )}

        <Reveal delay={0.1}>
          <footer className="mt-20 pt-8 border-t border-neutral-200 text-xs text-neutral-400">
            © {new Date().getFullYear()} {profile?.fullName ?? data.username}{" "}
            · Built with{" "}
            <a href="/" className="hover:text-neutral-700">
              ポートフォリーヨ
            </a>
          </footer>
        </Reveal>
      </div>

      <PortfolioDetailModal
        content={detail}
        onClose={() => setDetail(null)}
        theme="minimal"
      />
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-6 pb-3 border-b border-neutral-200">
      {children}
    </h2>
  );
}
