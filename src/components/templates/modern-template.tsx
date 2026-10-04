"use client";

import { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  Download,
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

export function ModernTemplate({ data }: { data: PortfolioData }) {
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
      <header className="relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full bg-fuchsia-500/20 blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-10 pt-20 sm:pt-28 pb-16 sm:pb-24">
          <Reveal>
            <div className="flex flex-col items-start gap-8">
              {profile?.photoUrl && (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.photoUrl}
                    alt={profile.fullName}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-white/10"
                  />
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-transparent pointer-events-none" />
                </div>
              )}
              <div>
                <h1
                  className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent"
                  style={{ lineHeight: 1.05, paddingBottom: "0.15em" }}
                >
                  {profile?.fullName ?? data.username}
                </h1>
                {profile?.headline && (
                  <p className="text-xl sm:text-2xl text-neutral-400 mt-6 font-light">
                    {profile.headline}
                  </p>
                )}
              </div>
            </div>

            {profile?.bio && (
              <p className="mt-10 text-neutral-400 leading-relaxed whitespace-pre-line max-w-2xl text-lg">
                {profile.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-3 mt-10">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-neutral-950 text-sm font-semibold hover:bg-neutral-200 active:scale-[0.97] transition-all"
                >
                  <Mail className="h-4 w-4" />
                  Get in touch
                </a>
              )}
              {profile?.location && (
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur text-sm text-neutral-300">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </span>
              )}
              {profile?.phone && (
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur text-sm text-neutral-300">
                  <Phone className="h-4 w-4" />
                  {profile.phone}
                </span>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {socialLinks.map((l) => (
                  <a
                    key={l.id}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-neutral-300 hover:text-white border border-transparent hover:border-white/20 transition-all"
                  >
                    {l.platform}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-16 sm:py-24 space-y-24">
        {experiences.length > 0 && (
          <Reveal>
            <ModernHeading title="Experience" />
            <div className="grid grid-cols-1 gap-4">
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
                  className="group relative text-left rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-bold text-xl group-hover:text-indigo-300 transition-colors">
                      {e.role}
                    </h3>
                    <span className="text-xs text-neutral-500 shrink-0 tabular-nums px-3 py-1 rounded-full border border-white/10">
                      {fmtMonth(e.startDate)} –{" "}
                      {e.endDate ? fmtMonth(e.endDate) : "Present"}
                    </span>
                  </div>
                  <p className="text-indigo-300 font-medium mt-1">
                    {e.company}
                    {e.location && (
                      <span className="text-neutral-500 font-normal">
                        {" · "}
                        {e.location}
                      </span>
                    )}
                  </p>
                  {e.description && (
                    <p className="text-neutral-400 mt-4 whitespace-pre-line leading-relaxed line-clamp-2">
                      {e.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {projects.length > 0 && (
          <Reveal>
            <ModernHeading title="Projects" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden hover:border-white/20 hover:-translate-y-1 transition-all flex flex-col"
                >
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
                    className="text-left"
                  >
                    <div className="h-1 bg-gradient-to-r from-indigo-500/60 via-fuchsia-500/40 to-transparent" />
                  </button>
                  <div className="p-6 flex-1 flex flex-col">
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
                      className="text-left"
                    >
                      <h3 className="font-bold text-lg group-hover:text-indigo-300 transition-colors">
                        {p.title}
                      </h3>
                      {p.role && (
                        <p className="text-xs text-indigo-300/70 mt-1 inline-flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {p.role}
                        </p>
                      )}
                      {p.description && (
                        <p className="text-sm text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                          {p.description}
                        </p>
                      )}
                    </button>

                    {p.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {p.techStack.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                          >
                            {t}
                          </span>
                        ))}
                        {p.techStack.length > 4 && (
                          <span className="text-[11px] px-2.5 py-1 text-neutral-500">
                            +{p.techStack.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {(p.demoUrl || p.repoUrl) && (
                      <div className="flex flex-wrap gap-3 mt-auto pt-4 border-t border-white/10 text-sm">
                        {p.demoUrl && (
                          <a
                            href={p.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-white hover:text-indigo-300 transition-colors font-medium"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Live demo
                          </a>
                        )}
                        {p.repoUrl && (
                          <a
                            href={p.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-white hover:text-indigo-300 transition-colors font-medium"
                          >
                            <Code2 className="h-3.5 w-3.5" />
                            Source
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {educations.length > 0 && (
          <Reveal>
            <ModernHeading title="Education" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="text-left rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 hover:border-white/20 hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <h3 className="font-bold text-lg">
                      {ed.degree}
                      {ed.field && (
                        <span className="text-neutral-400 font-normal">
                          {" "}
                          · {ed.field}
                        </span>
                      )}
                    </h3>
                    <span className="text-xs text-neutral-500 tabular-nums">
                      {fmtMonth(ed.startDate)} –{" "}
                      {ed.endDate ? fmtMonth(ed.endDate) : "Present"}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 mt-2">
                    {ed.institution}
                    {ed.gpa && ` · GPA ${ed.gpa}`}
                  </p>
                  {ed.description && (
                    <p className="text-sm text-neutral-500 mt-3 whitespace-pre-line leading-relaxed line-clamp-2">
                      {ed.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {skills.length > 0 && (
          <Reveal>
            <ModernHeading title="Skills" />
            <div className="space-y-8">
              {Object.entries(skillsByCategory).map(([cat, list]) => (
                <div key={cat}>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-3">
                    {cat}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {list.map((s) => (
                      <span
                        key={s.id}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-white/[0.08] to-white/[0.03] border border-white/10 text-sm font-medium hover:border-indigo-500/50 hover:from-indigo-500/10 transition-all"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {certificates.length > 0 && (
          <Reveal>
            <ModernHeading title="Certificates" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="group text-left rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-4 hover:border-white/20 hover:-translate-y-0.5 hover:bg-white/[0.06] transition-all flex items-start gap-4"
                  >
                    {/* Small fixed-size thumbnail */}
                    <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {c.imageUrl && !isPdf ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={c.imageUrl}
                          alt={c.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : isPdf ? (
                        <FileText className="h-6 w-6 text-indigo-400" />
                      ) : (
                        <Award className="h-6 w-6 text-neutral-500" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base group-hover:text-indigo-300 transition-colors line-clamp-2">
                        {c.title}
                      </h3>
                      <p className="text-sm text-neutral-400 mt-1 line-clamp-1">
                        {c.issuer}
                        {c.issueDate && ` · ${fmtMonth(c.issueDate)}`}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs font-medium">
                        {c.credentialUrl && (
                          <span className="inline-flex items-center gap-1 text-indigo-300">
                            <ExternalLink className="h-3 w-3" />
                            Verify
                          </span>
                        )}
                        {isPdf && (
                          <span className="inline-flex items-center gap-1 text-indigo-300">
                            <FileText className="h-3 w-3" />
                            PDF
                          </span>
                        )}
                      </div>
                    </div>

                    <ArrowUpRight className="h-4 w-4 text-neutral-500 group-hover:text-indigo-300 shrink-0 mt-1 transition-colors" />
                  </button>
                );
              })}
            </div>
          </Reveal>
        )}

        {cvFile && (
          <Reveal>
            <ModernHeading title="Resume" />
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">{cvFile.fileName}</p>
                <p className="text-sm text-neutral-500 mt-1">
                  View inline or download as PDF
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={cvFile.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Preview
                </a>
                <a
                  href={cvFile.fileUrl}
                  download={cvFile.fileName}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-neutral-950 text-sm font-semibold hover:bg-neutral-200 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.1}>
          <footer className="text-center text-xs text-neutral-600 pt-12 border-t border-white/10">
            © {new Date().getFullYear()} {profile?.fullName ?? data.username}{" "}
            · Built with{" "}
            <a href="/" className="text-neutral-400 hover:text-white">
              ポートフォリーヨ
            </a>
          </footer>
        </Reveal>
      </div>

      <PortfolioDetailModal
        content={detail}
        onClose={() => setDetail(null)}
        theme="modern"
      />
    </div>
  );
}

function ModernHeading({ title }: { title: string }) {
  return (
    <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-8">
      {title}
    </h2>
  );
}
