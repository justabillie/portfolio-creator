"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ExternalLink,
  Code2,
  MapPin,
  Calendar,
  Award,
  FileText,
  Users,
} from "lucide-react";

export type DashboardDetail =
  | {
      type: "project";
      title: string;
      role?: string | null;
      description?: string | null;
      techStack?: string[];
      demoUrl?: string | null;
      repoUrl?: string | null;
    }
  | {
      type: "experience";
      role: string;
      company: string;
      location?: string | null;
      description?: string | null;
      startDate: string | Date;
      endDate?: string | Date | null;
    }
  | {
      type: "education";
      degree: string;
      field?: string | null;
      institution: string;
      gpa?: string | null;
      description?: string | null;
      startDate: string | Date;
      endDate?: string | Date | null;
    }
  | {
      type: "certificate";
      title: string;
      issuer: string;
      issueDate?: string | Date | null;
      credentialUrl?: string | null;
      imageUrl?: string | null;
    };

function fmtMonth(iso: string | Date) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function DashboardDetailModal({
  content,
  onClose,
}: {
  content: DashboardDetail | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {content && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl shadow-2xl bg-white border border-neutral-200 text-neutral-900"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {content.type === "project" && <ProjectDetail content={content} />}
            {content.type === "experience" && (
              <ExperienceDetail content={content} />
            )}
            {content.type === "education" && (
              <EducationDetail content={content} />
            )}
            {content.type === "certificate" && (
              <CertificateDetail content={content} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const subtle = "text-neutral-500";
const subtext = "text-neutral-600";
const divider = "border-neutral-200";
const chipBg = "bg-neutral-100 text-neutral-700 border-neutral-200";

function ProjectDetail({
  content,
}: {
  content: Extract<DashboardDetail, { type: "project" }>;
}) {
  return (
    <div className="p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold pr-10">{content.title}</h2>

      {content.role && (
        <p className={`text-sm ${subtle} mt-2 inline-flex items-center gap-1.5`}>
          <Users className="h-3.5 w-3.5" />
          {content.role}
        </p>
      )}

      {content.description && (
        <p className={`mt-5 ${subtext} whitespace-pre-line leading-relaxed`}>
          {content.description}
        </p>
      )}

      {content.techStack && content.techStack.length > 0 && (
        <div className={`mt-6 pt-6 border-t ${divider}`}>
          <h3 className={`text-xs uppercase tracking-wider ${subtle} mb-3`}>
            Tech stack
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {content.techStack.map((t) => (
              <span
                key={t}
                className={`text-xs px-2.5 py-1 rounded-full border ${chipBg}`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {(content.demoUrl || content.repoUrl) && (
        <div className={`mt-6 pt-6 border-t ${divider} flex flex-wrap gap-3`}>
          {content.demoUrl && (
            <a
              href={content.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live demo
            </a>
          )}
          {content.repoUrl && (
            <a
              href={content.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium hover:bg-neutral-50 transition-colors"
            >
              <Code2 className="h-3.5 w-3.5" />
              Source code
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function ExperienceDetail({
  content,
}: {
  content: Extract<DashboardDetail, { type: "experience" }>;
}) {
  return (
    <div className="p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold pr-10">{content.role}</h2>
      <p className={`text-lg ${subtext} mt-1`}>{content.company}</p>

      <div className={`flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm ${subtle}`}>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {fmtMonth(content.startDate)} –{" "}
          {content.endDate ? fmtMonth(content.endDate) : "Present"}
        </span>
        {content.location && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {content.location}
          </span>
        )}
      </div>

      {content.description && (
        <div className={`mt-6 pt-6 border-t ${divider}`}>
          <h3 className={`text-xs uppercase tracking-wider ${subtle} mb-3`}>
            Details
          </h3>
          <p className={`${subtext} whitespace-pre-line leading-relaxed`}>
            {content.description}
          </p>
        </div>
      )}
    </div>
  );
}

function EducationDetail({
  content,
}: {
  content: Extract<DashboardDetail, { type: "education" }>;
}) {
  return (
    <div className="p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold pr-10">
        {content.degree}
        {content.field && (
          <span className={`font-normal ${subtle}`}> · {content.field}</span>
        )}
      </h2>
      <p className={`text-lg ${subtext} mt-1`}>{content.institution}</p>

      <div className={`flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm ${subtle}`}>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {fmtMonth(content.startDate)} –{" "}
          {content.endDate ? fmtMonth(content.endDate) : "Present"}
        </span>
        {content.gpa && <span>GPA {content.gpa}</span>}
      </div>

      {content.description && (
        <div className={`mt-6 pt-6 border-t ${divider}`}>
          <h3 className={`text-xs uppercase tracking-wider ${subtle} mb-3`}>
            Details
          </h3>
          <p className={`${subtext} whitespace-pre-line leading-relaxed`}>
            {content.description}
          </p>
        </div>
      )}
    </div>
  );
}

function CertificateDetail({
  content,
}: {
  content: Extract<DashboardDetail, { type: "certificate" }>;
}) {
  const isPdf = content.imageUrl?.toLowerCase().endsWith(".pdf");

  return (
    <div>
      {content.imageUrl && !isPdf && (
        <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.imageUrl}
            alt={content.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {content.imageUrl && isPdf && (
        <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
          <iframe
            src={`${content.imageUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=page-width`}
            className="w-full h-full"
            title={content.title}
          />
        </div>
      )}

      <div className="p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold pr-10 inline-flex items-start gap-2">
          <Award className={`h-6 w-6 mt-1 shrink-0 ${subtle}`} />
          {content.title}
        </h2>
        <p className={`text-lg ${subtext} mt-2`}>{content.issuer}</p>

        {content.issueDate && (
          <p className={`text-sm ${subtle} mt-2 inline-flex items-center gap-1.5`}>
            <Calendar className="h-3.5 w-3.5" />
            Issued {fmtMonth(content.issueDate)}
          </p>
        )}

        {(content.credentialUrl || isPdf) && (
          <div className={`mt-6 pt-6 border-t ${divider} flex flex-wrap gap-3`}>
            {content.credentialUrl && (
              <a
                href={content.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Verify credential
              </a>
            )}
            {content.imageUrl && isPdf && (
              <a
                href={content.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium hover:bg-neutral-50 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                Open PDF
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
