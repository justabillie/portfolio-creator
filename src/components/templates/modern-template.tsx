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

        <div className="relative max-w-6xl mx-auto px-6 sm:px-10 pt-14 sm:pt-20 pb-10 sm:pb-14">
          <Reveal>
            <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
              {profile?.photoUrl && (
                <div className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.photoUrl}
                    alt={profile.fullName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-white/10"
                  />
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-transparent pointer-events-none" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent"
                  style={{ lineHeight: 1.05, paddingBottom: "0.15em" }}
                >
                  {profile?.fullName ?? data.username}
                </h1>
                {profile?.headline && (
                  <p className="text-base sm:text-lg text-neutral-400 mt-2 font-light">
                    {profile.headline}
                  </p>
                )}

                {profile?.bio && (
                  <p className="mt-4 text-neutral-400 leading-relaxed whitespace-pre-line max-w-2xl">
                    {profile.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-5">
                  {profile?.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-neutral-950 text-sm font-semibold hover:bg-neutral-200 active:scale-[0.97] transition-all"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Get in touch
                    </a>
                  )}
                  {profile?.location && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur text-sm text-neutral-300">
                      <MapPin className="h-3.5 w-3.5" />
                      {profile.location}
                    </span>
                  )}
                  {profile?.phone && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur text-sm text-neutral-300">
                      <Phone className="h-3.5 w-3.5" />
                      {profile.phone}
                    </span>
                  )}
                </div>

                {socialLinks.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {socialLinks.map((l) => (
                      <a
                        key={l.id}
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-neutral-300 hover:text-white border border-transparent hover:border-white/20 transition-all"
                      >
                        {l.platform}
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12 sm:py-16 space-y-12 sm:space-y-14">
        {experiences.length > 0 && (
          <Reveal>
            <ModernHeading title="Experience" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
                  className="group text-left rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 hover:bg-white/[0.06] hover:border-white/20 transition-all"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="font-bold text-base group-hover:text-indigo-300 transition-colors">
                      {e.role}
                    </h3>
                    <span className="text-[11px] text-neutral-500 shrink-0 tabular-nums px-2 py-0.5 rounded-full border border-white/10">
                      {fmtMonth(e.startDate)} –{" "}
                      {e.endDate ? fmtMonth(e.endDate) : "Present"}
                    </span>
                  </div>
                  <p className="text-indigo-300 text-sm font-medium mt-0.5">
                    {e.company}
                    {e.location && (
                      <span className="text-neutral-500 font-normal">
                        {" · "}
                        {e.location}
                      </span>
                    )}
                  </p>
                  {e.description && (
                    <p className="text-sm text-neutral-400 mt-2 whitespace-pre-line leading-relaxed line-clamp-2">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {projects.map((p) => (
                <button
                  key={p.id}
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
                  className="group relative text-left rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden hover:border-white/20 transition-all flex flex-col"
                >
                  <div className="h-0.5 bg-gradient-to-r from-indigo-500/60 via-fuchsia-500/40 to-transparent" />
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-base group-hover:text-indigo-300 transition-colors">
                      {p.title}
                    </h3>
                    {p.role && (
                      <p className="text-xs text-indigo-300/70 mt-0.5 inline-flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {p.role}
                      </p>
                    )}
                    {p.description && (
                      <p className="text-sm text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                        {p.description}
                      </p>
                    )}

                    {p.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {p.techStack.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                          >
                            {t}
                          </span>
                        ))}
                        {p.techStack.length > 3 && (
                          <span className="text-[10px] px-2 py-0.5 text-neutral-500">
                            +{p.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {(p.demoUrl || p.repoUrl) && (
                      <div className="flex flex-wrap gap-3 mt-auto pt-3 border-t border-white/10 text-xs">
                        {p.demoUrl && (
                          <span className="inline-flex items-center gap-1 text-white hover:text-indigo-300 transition-colors font-medium">
                            <ExternalLink className="h-3 w-3" />
                            Live
                          </span>
                        )}
                        {p.repoUrl && (
                          <span className="inline-flex items-center gap-1 text-white hover:text-indigo-300 transition-colors font-medium">
                            <Code2 className="h-3 w-3" />
                            Source
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {educations.length > 0 && (
          <Reveal>
            <ModernHeading title="Education" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
                  className="text-left rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 hover:border-white/20 transition-all"
                >
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3 className="font-bold text-base">
                      {ed.degree}
                      {ed.field && (
                        <span className="text-neutral-400 font-normal">
                          {" "}
                          · {ed.field}
                        </span>
                      )}
                    </h3>
                    <span className="text-[11px] text-neutral-500 tabular-nums">
                      {fmtMonth(ed.startDate)} –{" "}
                      {ed.endDate ? fmtMonth(ed.endDate) : "Present"}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 mt-1">
                    {ed.institution}
                    {ed.gpa && ` · GPA ${ed.gpa}`}
                  </p>
                  {ed.description && (
                    <p className="text-sm text-neutral-500 mt-2 whitespace-pre-line leading-relaxed line-clamp-2">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {Object.entries(skillsByCategory).map(([cat, list]) => (
                <div key={cat}>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 mb-2">
                    {cat}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {list.map((s) => (
                      <span
                        key={s.id}
                        className="px-3 py-1.5 rounded-full bg-gradient-to-r from-white/[0.08] to-white/[0.03] border border-white/10 text-sm font-medium hover:border-indigo-500/50 hover:from-indigo-500/10 transition-all"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
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
                    className="group text-left rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-3 hover:border-white/20 hover:bg-white/[0.06] transition-all flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {c.imageUrl && !isPdf ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={c.imageUrl}
                          alt={c.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : isPdf ? (
                        <FileText className="h-5 w-5 text-indigo-400" />
                      ) : (
                        <Award className="h-5 w-5 text-neutral-500" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {c.title}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                        {c.issuer}
                        {c.issueDate && ` · ${fmtMonth(c.issueDate)}`}
                      </p>
                    </div>

                    <ArrowUpRight className="h-3.5 w-3.5 text-neutral-500 group-hover:text-indigo-300 shrink-0 transition-colors" />
                  </button>
                );
              })}
            </div>
          </Reveal>
        )}

        {cvFile && (
          <Reveal>
            <ModernHeading title="Resume" />
            <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">{cvFile.fileName}</p>
                <p className="text-sm text-neutral-500 mt-0.5">
                  View inline or download as PDF
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={cvFile.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Preview
                </a>
                <a
                  href={cvFile.fileUrl}
                  download={cvFile.fileName}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-neutral-950 text-sm font-semibold hover:bg-neutral-200 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
              </div>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.1}>
          <footer className="text-center text-xs text-neutral-600 pt-8 border-t border-white/10">
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
    <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">
      {title}
    </h2>
  );
}
