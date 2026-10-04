"use client";

import { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  ExternalLink,
  Code2,
  Users,
  Award,
  FileText,
} from "lucide-react";
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
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
        {/* Header — 2 columns on desktop */}
        <Reveal>
          <header>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8 md:gap-12">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-none">
                  {profile?.fullName ?? data.username}
                </h1>
                {profile?.headline && (
                  <p className="text-lg text-neutral-500 mt-3 leading-snug">
                    {profile.headline}
                  </p>
                )}
                {profile?.bio && (
                  <p className="mt-5 text-[15px] leading-7 text-neutral-700 whitespace-pre-line">
                    {profile.bio}
                  </p>
                )}
              </div>

              <aside className="md:pt-2">
                {profile?.photoUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={profile.photoUrl}
                    alt={profile.fullName}
                    className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover mb-5 ring-1 ring-neutral-200"
                  />
                )}

                <div className="space-y-2 text-sm">
                  {profile?.location && (
                    <div className="flex items-center gap-2 text-neutral-500">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{profile.email}</span>
                    </a>
                  )}
                  {profile?.phone && (
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>

                {socialLinks.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
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
              </aside>
            </div>
          </header>
        </Reveal>

        {/* Two-column layout below the header */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 lg:gap-12">
          {/* Main column */}
          <div className="space-y-12">
            {experiences.length > 0 && (
              <Reveal delay={0.05}>
                <section>
                  <Heading>Experience</Heading>
                  <div className="relative border-l border-neutral-200 ml-1 space-y-6">
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
                        className="relative pl-5 text-left w-full group hover:opacity-80 transition-opacity"
                      >
                        <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-neutral-900 -translate-x-[4.5px] ring-4 ring-white" />
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <h3 className="font-semibold text-[15px] group-hover:underline underline-offset-4">
                            {e.role}
                          </h3>
                          <span className="text-xs text-neutral-400 tabular-nums">
                            {fmtMonth(e.startDate)} –{" "}
                            {e.endDate ? fmtMonth(e.endDate) : "Present"}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-0.5">
                          {e.company}
                          {e.location && (
                            <span className="text-neutral-400">
                              {" "}
                              · {e.location}
                            </span>
                          )}
                        </p>
                        {e.description && (
                          <p className="text-sm text-neutral-600 mt-1.5 whitespace-pre-line leading-relaxed line-clamp-3">
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
                <section>
                  <Heading>Projects</Heading>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                    {projects.map((p) => (
                      <div key={p.id} className="group">
                        <button
                          onClick={() =>
                            setDetail({
                              type: "project",
                              title: p.title,
                              role: p.role,
                              description: p.description,
                              techStack: p.techStack,
                              demoUrl: p.demoUrl,
                              repoUrl: p.repoUrl,
                            })
                          }
                          className="text-left w-full"
                        >
                          <h3 className="font-semibold text-[15px] group-hover:underline underline-offset-4 decoration-neutral-300">
                            {p.title}
                          </h3>
                          {p.role && (
                            <p className="text-xs text-neutral-400 mt-0.5 inline-flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {p.role}
                            </p>
                          )}
                          {p.description && (
                            <p className="text-sm text-neutral-600 mt-1.5 whitespace-pre-line leading-relaxed line-clamp-4">
                              {p.description}
                            </p>
                          )}
                          {p.techStack.length > 0 && (
                            <p className="text-xs text-neutral-400 mt-1.5">
                              {p.techStack.join(" · ")}
                            </p>
                          )}
                        </button>

                        {(p.demoUrl || p.repoUrl) && (
                          <div className="flex flex-wrap gap-3 mt-2 text-xs">
                            {p.demoUrl && (
                              <a
                                href={p.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900 underline underline-offset-4"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Live
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
                                Source
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
                <section>
                  <Heading>Education</Heading>
                  <div className="relative border-l border-neutral-200 ml-1 space-y-4">
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
                        className="relative pl-5 text-left w-full group hover:opacity-80 transition-opacity"
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
                        <p className="text-sm text-neutral-600 mt-0.5">
                          {ed.institution}
                          {ed.gpa && (
                            <span className="text-neutral-400">
                              {" "}
                              · GPA {ed.gpa}
                            </span>
                          )}
                        </p>
                      </button>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {certificates.length > 0 && (
              <Reveal delay={0.05}>
                <section>
                  <Heading>Certificates</Heading>
                  <div className="space-y-2">
                    {certificates.map((c) => {
                      const isPdf = c.imageUrl?.toLowerCase().endsWith(".pdf");
                      return (
                        <button
                          key={c.id}
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
                          className="group w-full text-left rounded-lg border border-neutral-200 p-2.5 hover:border-neutral-400 hover:bg-neutral-50/50 transition-all flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 overflow-hidden">
                            {c.imageUrl && !isPdf ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={c.imageUrl}
                                alt={c.title}
                                className="w-full h-full object-cover"
                              />
                            ) : isPdf ? (
                              <FileText className="h-4 w-4 text-neutral-500" />
                            ) : (
                              <Award className="h-4 w-4 text-neutral-400" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold group-hover:underline underline-offset-4 line-clamp-1">
                              {c.title}
                            </h3>
                            <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                              {c.issuer}
                              {c.issueDate && ` · ${fmtMonth(c.issueDate)}`}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </Reveal>
            )}
          </div>

          {/* Sidebar column */}
          <aside className="space-y-10">
            {skills.length > 0 && (
              <Reveal delay={0.05}>
                <section>
                  <Heading>Skills</Heading>
                  <div className="space-y-3">
                    {Object.entries(skillsByCategory).map(([cat, list]) => (
                      <div key={cat}>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-400 mb-1">
                          {cat}
                        </div>
                        <div className="text-sm text-neutral-800 leading-relaxed">
                          {list.map((s) => s.name).join(" · ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {cvFile && (
              <Reveal delay={0.05}>
                <section>
                  <Heading>Resume</Heading>
                  <div className="flex flex-col gap-2 text-sm">
                    <a
                      href={cvFile.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-4 w-fit"
                    >
                      Open PDF
                    </a>
                    <a
                      href={cvFile.fileUrl}
                      download={cvFile.fileName}
                      className="underline underline-offset-4 w-fit"
                    >
                      Download
                    </a>
                  </div>
                </section>
              </Reveal>
            )}
          </aside>
        </div>

        <Reveal delay={0.1}>
          <footer className="mt-16 pt-6 border-t border-neutral-200 text-xs text-neutral-400">
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
    <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-4 pb-2 border-b border-neutral-200">
      {children}
    </h2>
  );
}
