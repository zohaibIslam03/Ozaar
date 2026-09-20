"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  X,
  Download,
  RotateCcw,
  GripVertical,
  Loader2,
  FileText,
  User,
  AlignLeft,
  Layers,
  FolderOpen,
  GraduationCap,
  Award,
  Briefcase,
  Lightbulb,
  Clock,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  ResumeData,
  SkillCategory,
  Project,
  Education,
  Certification,
  Experience,
} from "@/types/resume";
import {
  RESUME_TEMPLATES,
  getResumeTemplate,
  type ResumeTemplate,
} from "@/lib/resumeTemplates";

// ── Constants ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "resume-data-v2";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const EMPTY_DATA: ResumeData = {
  fullName: "",
  jobTitle: "",
  phone: "",
  email: "",
  linkedIn: "",
  website: "",
  location: "",
  summary: "",
  templateId: "classic",
  skills: [],
  projects: [],
  education: [],
  certifications: [],
  experience: [],
};

// ── Input component ───────────────────────────────────────────────────────────

function FInput({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  rows = 4,
  maxLength,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
  maxLength?: number;
  hint?: string;
}) {
  const [focused, setFocused] = useState(false);

  const base: React.CSSProperties = {
    width: "100%",
    background: focused ? "#fff" : "#FAFAFA",
    border: `1.5px solid ${focused ? "#DF0A09" : "#EBEBEB"}`,
    borderRadius: 10,
    padding: textarea ? "11px 14px" : "11px 14px",
    fontSize: 13,
    color: "#111",
    boxSizing: "border-box",
    outline: "none",
    transition: "all 0.2s ease",
    boxShadow: focused ? "0 0 0 3px rgba(223,10,9,0.08)" : "none",
    resize: textarea ? ("vertical" as const) : undefined,
    lineHeight: textarea ? 1.55 : undefined,
    fontFamily: "inherit",
  };

  return (
    <div className="rb-field" style={{ marginBottom: 10 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#888",
          display: "block",
          marginBottom: 6,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={base}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={base}
        />
      )}
      {(maxLength || hint) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
          {hint && <span style={{ fontSize: 10.5, color: "#aaa" }}>{hint}</span>}
          {maxLength && <span style={{ fontSize: 10.5, color: "#aaa", marginLeft: "auto" }}>{value.length}/{maxLength}</span>}
        </div>
      )}
    </div>
  );
}

// ── 2-col field row ───────────────────────────────────────────────────────────

function FieldRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {children}
    </div>
  );
}

// ── Add button ────────────────────────────────────────────────────────────────

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        padding: "9px 0",
        border: `1.5px dashed ${hovered ? "#DF0A09" : "#D0D0D0"}`,
        borderRadius: 8,
        background: hovered ? "rgba(223,10,9,0.03)" : "transparent",
        color: hovered ? "#DF0A09" : "#888",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.15s",
        marginTop: 4,
      }}
    >
      + {label}
    </button>
  );
}

// ── Entry card (Education / Cert / Experience) ────────────────────────────────

function EntryCard({ onRemove, children }: { onRemove: () => void; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #EBEBEB",
        borderRadius: 10,
        padding: "14px 14px 4px 14px",
        marginBottom: 10,
        position: "relative",
      }}
    >
      <button
        onClick={onRemove}
        style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: "pointer", color: "#ccc", padding: 2, lineHeight: 1 }}
      >
        <X size={13} />
      </button>
      {children}
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function calcProgress(d: ResumeData): number {
  // Core fields only. Projects, experience, and certifications are optional.
  let score = 0;
  if (d.fullName) score++;
  if (d.jobTitle) score++;
  if (d.email) score++;
  if (d.phone) score++;
  if (d.location) score++;
  if (d.summary) score++;
  if (d.skills.some((s) => s.category && s.skills)) score++;
  if (d.education.some((e) => e.institution)) score++;
  return Math.round((score / 8) * 100);
}

// ── Section accordion ─────────────────────────────────────────────────────────

const SECTION_ICONS = [User, AlignLeft, Layers, FolderOpen, GraduationCap, Award, Briefcase];

const SECTION_TIPS = [
  "Fill your name and email first so they appear at the top of your resume.",
  "Keep it under 3 sentences. Focus on your biggest strengths.",
  "Group skills by category so they are easy to scan.",
  "Optional. Add a portfolio, case study, or work sample only if you have one.",
  "List most recent education first.",
  "Optional. Skip if you do not have certifications yet.",
  "Optional. Skip if you are early-career or changing fields.",
];

function Section({
  index,
  title,
  open,
  onToggle,
  complete,
  badge,
  optional,
  children,
}: {
  index: number;
  title: string;
  open: boolean;
  onToggle: () => void;
  complete?: boolean;
  badge?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = SECTION_ICONS[index];
  const tip = SECTION_TIPS[index];
  const iconOpen = open;

  return (
    <div style={{ borderBottom: "1px solid #F0F0F0" }}>
      <div
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          margin: "2px 8px",
          cursor: "pointer",
          userSelect: "none",
          borderRadius: 10,
          background: open ? "#F8F8F8" : hovered ? "#F5F5F5" : "transparent",
          transition: "background 0.15s ease",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: iconOpen ? "#111" : "#F0F0F0",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s ease",
          }}
        >
          <Icon size={14} strokeWidth={1.75} color={iconOpen ? "#fff" : "#888"} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#111", flex: 1, minWidth: 0 }}>
          {title}
          {optional && (
            <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Optional
            </span>
          )}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto", flexShrink: 0 }}>
          {complete && (
            <span
              style={{
                background: "#DCFCE7",
                color: "#166534",
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 99,
              }}
            >
              ✓ Done
            </span>
          )}
          {!complete && badge && !open && (
            <span style={{ fontSize: 10, color: "#999", background: "#F0F0F0", borderRadius: 99, padding: "2px 7px", fontWeight: 600 }}>
              {badge}
            </span>
          )}
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: "flex" }}>
            <ChevronDown size={16} color="#CCC" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="border-t border-neutral-100 px-5 pb-5 pt-1">
              <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-2 text-xs text-gray-500">
                <span className="flex shrink-0 text-red-600">
                  <Lightbulb className="h-3 w-3" strokeWidth={2} aria-hidden />
                </span>
                <span>{tip}</span>
              </div>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sortable project item ─────────────────────────────────────────────────────

function SortableProject({
  proj,
  onChange,
  onRemove,
}: {
  proj: Project;
  onChange: (p: Project) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: proj.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: "#fff",
        border: "1.5px solid #EBEBEB",
        borderRadius: 10,
        padding: "14px 14px 4px 10px",
        marginBottom: 10,
        position: "relative",
        display: "flex",
        gap: 8,
      }}
    >
      <div
        {...attributes}
        {...listeners}
        style={{ cursor: isDragging ? "grabbing" : "grab", color: "#ccc", paddingTop: 1, flexShrink: 0, touchAction: "none" }}
      >
        <GripVertical size={15} />
      </div>
      <div style={{ flex: 1 }}>
        <button
          onClick={onRemove}
          style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: "pointer", color: "#ccc", padding: 2, lineHeight: 1 }}
        >
          <X size={13} />
        </button>
        <FInput label="Project Name *" value={proj.name} onChange={(v) => onChange({ ...proj, name: v })} placeholder="Community Outreach Campaign" />
        <FInput label="Link / Portfolio URL" value={proj.url} onChange={(v) => onChange({ ...proj, url: v })} placeholder="https://example.com/project" />
        <FInput
          label="Description (one bullet per line)"
          value={proj.bullets}
          onChange={(v) => onChange({ ...proj, bullets: v })}
          placeholder={"Increased engagement by 40%\nCoordinated a team of 8 volunteers"}
          textarea
          rows={3}
          hint="Each line becomes a bullet point"
        />
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({
  message,
  hint,
  icon: Icon,
}: {
  message: string;
  hint?: string;
  icon: typeof FolderOpen;
}) {
  return (
    <div
      style={{
        background: "#F7F7F7",
        border: "1.5px dashed #E0E0E0",
        borderRadius: 10,
        padding: 24,
        textAlign: "center",
        marginBottom: 8,
      }}
    >
      <Icon size={28} color="#CCC" strokeWidth={1.5} style={{ display: "block", margin: "0 auto 8px" }} />
      <p style={{ fontSize: 13, color: "#AAA", fontWeight: 500, margin: 0 }}>{message}</p>
      {hint && <p style={{ fontSize: 12, color: "#CCC", marginTop: 4, marginBottom: 0 }}>{hint}</p>}
    </div>
  );
}

// ── Template thumbnail (visual mock before user fills data) ───────────────────

function TemplateThumbnail({ template }: { template: ResumeTemplate }) {
  const p = template.preview;
  const align = p.nameAlign;
  const isBand = p.headerVariant === "band";
  const isTopBar = p.headerVariant === "top-bar";
  const isDouble = p.headerVariant === "double-rule";
  const isExec = p.sectionVariant === "band";
  const isLeftBar = p.sectionVariant === "left-bar";
  const isThick = p.sectionVariant === "thick-rule";
  const isSubtle = p.sectionVariant === "subtle";

  const sectionLabel = (label: string) => {
    if (isExec) {
      return (
        <div
          style={{
            fontSize: 5,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#fff",
            background: p.sectionBandBg || template.accent,
            padding: "2px 4px",
            marginTop: 5,
            marginBottom: 3,
            textAlign: "left",
          }}
        >
          {label}
        </div>
      );
    }
    if (isLeftBar) {
      return (
        <div style={{ display: "flex", alignItems: "stretch", gap: 4, marginTop: 5, marginBottom: 3 }}>
          <div style={{ width: 2.5, background: template.accent, borderRadius: 1, flexShrink: 0 }} />
          <div>
            <div
              style={{
                fontSize: 5,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: template.accent,
                textAlign: "left",
              }}
            >
              {label}
            </div>
            <div style={{ height: 1, background: template.accent, marginTop: 1 }} />
          </div>
        </div>
      );
    }
    return (
      <>
        <div
          style={{
            fontSize: isSubtle ? 4.5 : 5.5,
            fontWeight: isSubtle ? 600 : 700,
            textTransform: "uppercase",
            letterSpacing: isSubtle ? "0.16em" : isThick ? "0.12em" : "0.1em",
            color: (p.sectionTitle.color as string) || template.accent,
            textAlign: p.sectionTitle.textAlign === "center" ? "center" : align,
            marginTop: isSubtle ? 7 : 5,
            marginBottom: 1,
          }}
        >
          {label}
        </div>
        <div
          style={{
            height: isThick ? 2.5 : isSubtle ? 0.75 : 1,
            background: isSubtle ? "#E2E8F0" : template.accent,
            marginBottom: isSubtle ? 4 : 3,
          }}
        />
      </>
    );
  };

  const headerInner = (
    <>
      <div
        style={{
          fontSize: template.id === "executive" ? 13 : template.id === "minimal" ? 9 : 11,
          fontWeight: p.nameWeight === 800 ? 800 : p.nameWeight === 500 ? 500 : 700,
          lineHeight: 1.1,
          marginBottom: 2,
          letterSpacing: p.nameLetterSpacing,
          color: isBand ? (p.headerTextColor || "#fff") : p.nameColor,
          textAlign: align,
        }}
      >
        Alex Rivera
      </div>
      <div
        style={{
          fontSize: 5.5,
          color: isBand ? "#B8D4F0" : (p.jobTitleStyle.color as string) || "#555",
          fontStyle: (p.jobTitleStyle.fontStyle as string) || "normal",
          fontWeight: (p.jobTitleStyle.fontWeight as number) || 400,
          textTransform: (p.jobTitleStyle.textTransform as string) || "none",
          letterSpacing: (p.jobTitleStyle.letterSpacing as string) || undefined,
          marginBottom: 2,
          textAlign: align,
        }}
      >
        Marketing Manager
      </div>
      <div
        style={{
          fontSize: 4,
          color: isBand ? "#D6E6F5" : p.contactColor,
          marginBottom: isDouble ? 0 : isSubtle ? 6 : 4,
          lineHeight: 1.35,
          textAlign: align,
        }}
      >
        you@email.com · City
      </div>
      {isDouble && (
        <div style={{ marginTop: 4, marginBottom: 4 }}>
          <div style={{ height: 2, background: template.accent }} />
          <div style={{ height: 1, background: template.accent, marginTop: 1.5 }} />
        </div>
      )}
    </>
  );

  return (
    <div
      aria-hidden
      style={{
        width: "100%",
        aspectRatio: "3 / 4",
        background: "#fff",
        border: "1px solid #E8E8E8",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
        fontFamily: p.fontFamily,
        color: "#111",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isTopBar && (
        <div style={{ height: 5, background: template.accent, flexShrink: 0 }} />
      )}
      {isBand ? (
        <div style={{ background: p.headerBg || template.accent, padding: "8px 8px 6px" }}>
          {headerInner}
        </div>
      ) : (
        <div
          style={{
            padding: isSubtle ? "14px 12px 0" : isTopBar ? "7px 8px 0" : "9px 9px 0",
          }}
        >
          {headerInner}
        </div>
      )}
      <div style={{ padding: isSubtle ? "0 12px 8px" : "0 8px 7px", flex: 1 }}>
        {sectionLabel("Summary")}
        <p style={{ fontSize: 4.5, lineHeight: 1.35, color: "#333", margin: "0 0 4px", textAlign: "left" }}>
          Results-driven pro with 5+ years delivering outcomes.
        </p>
        {sectionLabel("Experience")}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1, textAlign: "left" }}>
          <span style={{ fontSize: 5.5, fontWeight: 700 }}>Acme Co, Lead</span>
          <span style={{ fontSize: 4.5, color: "#666" }}>2021–Now</span>
        </div>
        <p style={{ fontSize: 4.5, lineHeight: 1.3, color: "#333", margin: "0 0 1px", textAlign: "left" }}>
          • Grew engagement 40% YoY
        </p>
        <p style={{ fontSize: 4.5, lineHeight: 1.3, color: "#333", margin: "0 0 3px", textAlign: "left" }}>
          • Led a team of 6
        </p>
        {sectionLabel("Education")}
        <div style={{ display: "flex", justifyContent: "space-between", textAlign: "left" }}>
          <span style={{ fontSize: 5.5, fontWeight: 700 }}>State University</span>
          <span style={{ fontSize: 4.5, color: "#666" }}>2019</span>
        </div>
      </div>
    </div>
  );
}

function TemplatePicker({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="m-0 text-sm font-bold text-gray-900">Choose an ATS-friendly template</p>
          <p className="m-0 mt-0.5 text-xs text-gray-500">
            Five distinct layouts. Switch anytime — your content stays. Experience, projects, and certifications stay off the page until you fill them.
          </p>
        </div>
        <p className="m-0 text-xs font-semibold text-brand-red">
          Selected: {getResumeTemplate(selectedId).name}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {RESUME_TEMPLATES.map((t) => {
          const active = selectedId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={`group rounded-xl border p-2.5 text-left transition-all ${
                active
                  ? "border-brand-red bg-brand-red/[0.04] ring-2 ring-brand-red/25"
                  : "border-gray-200 bg-neutral-50 hover:border-gray-300 hover:bg-white"
              }`}
            >
              <TemplateThumbnail template={t} />
              <p className={`m-0 mt-2.5 text-xs font-bold ${active ? "text-brand-red" : "text-gray-900"}`}>
                {t.name}
              </p>
              <p className="m-0 mt-0.5 text-[10px] leading-snug text-gray-500">{t.tagline}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Resume preview ────────────────────────────────────────────────────────────

function GhostSection({ label }: { label: string }) {
  return (
    <div
      style={{
        background: "#F9F9F9",
        border: "1px dashed #E8E8E8",
        borderRadius: 4,
        minHeight: 36,
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        color: "#CCC",
        fontStyle: "italic",
        padding: "0 8px",
        textAlign: "center",
      }}
    >
      Add {label} to see it here
    </div>
  );
}

function PreviewSectionHeading({
  title,
  template,
}: {
  title: string;
  template: ResumeTemplate;
}) {
  const p = template.preview;
  const v = p.sectionVariant;

  if (v === "band") {
    return (
      <div
        style={{
          ...p.sectionTitle,
          background: p.sectionBandBg || template.accent,
          color: p.sectionBandColor || "#fff",
          marginBottom: 10,
        }}
      >
        {title}
      </div>
    );
  }

  if (v === "left-bar") {
    return (
      <div style={{ display: "flex", alignItems: "stretch", gap: 10, marginTop: 16, marginBottom: 8 }}>
        <div
          style={{
            width: p.sectionLeftBarWidth || 4,
            background: template.accent,
            borderRadius: 1,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ ...p.sectionTitle, marginTop: 0, paddingLeft: 0 }}>{title}</div>
          <hr style={{ ...p.sectionRule, marginTop: 4 }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={p.sectionTitle}>{title}</div>
      <hr style={p.sectionRule} />
    </>
  );
}

function PreviewHeader({
  template,
  fullName,
  jobTitle,
  contactParts,
  showGhosts,
}: {
  template: ResumeTemplate;
  fullName: string;
  jobTitle: string;
  contactParts: { label: string; href?: string }[];
  showGhosts: boolean;
}) {
  const p = template.preview;
  const isBand = p.headerVariant === "band";

  const nameEl = (
    <div
      style={{
        fontSize: p.nameSize,
        fontWeight: p.nameWeight,
        textAlign: p.nameAlign,
        color: isBand ? p.headerTextColor || "#fff" : p.nameColor,
        marginBottom: 5,
        letterSpacing: p.nameLetterSpacing,
      }}
    >
      {fullName}
    </div>
  );

  const titleEl = jobTitle ? (
    <div style={p.jobTitleStyle}>{jobTitle}</div>
  ) : showGhosts ? (
    <GhostSection label="your job title" />
  ) : null;

  const contactEl =
    contactParts.length > 0 ? (
      <div
        style={{
          textAlign: p.contactAlign,
          fontSize: "9.5pt",
          color: p.contactColor,
          marginBottom: p.headerVariant === "double-rule" ? 0 : 14,
          lineHeight: 1.7,
        }}
      >
        {contactParts.map((part, i) => (
          <span key={i}>
            {i > 0 && (
              <span style={{ color: isBand ? "rgba(255,255,255,0.45)" : "#999" }}>{p.contactSep}</span>
            )}
            {part.href ? (
              <a
                href={part.href}
                style={{ color: isBand ? p.contactColor : "#0000EE" }}
                target="_blank"
                rel="noreferrer"
              >
                {part.label}
              </a>
            ) : (
              part.label
            )}
          </span>
        ))}
      </div>
    ) : showGhosts ? (
      <GhostSection label="contact details" />
    ) : null;

  const doubleRule =
    p.headerVariant === "double-rule" ? (
      <div style={{ marginTop: 10, marginBottom: 14 }}>
        <div style={{ height: 2.5, background: template.accent }} />
        <div style={{ height: 1, background: template.accent, marginTop: 3 }} />
      </div>
    ) : null;

  if (isBand) {
    return (
      <div style={{ background: p.headerBg || template.accent, padding: p.headerPad || "28px 42px 24px" }}>
        {nameEl}
        {titleEl}
        {contactEl}
      </div>
    );
  }

  return (
    <>
      {nameEl}
      {titleEl}
      {contactEl}
      {doubleRule}
    </>
  );
}

function ResumePreview({ data }: { data: ResumeData }) {
  const template = getResumeTemplate(data.templateId);
  const p = template.preview;
  const isBand = p.headerVariant === "band";
  const isTopBar = p.headerVariant === "top-bar";
  const edgeToEdge = isBand || isTopBar;

  const wrap: React.CSSProperties = {
    width: "100%",
    maxWidth: 660,
    background: "#ffffff",
    border: "1px solid #E0E0E0",
    borderRadius: 8,
    margin: "0 auto",
    padding: edgeToEdge ? 0 : p.pagePad,
    fontFamily: p.fontFamily,
    fontSize: "11pt",
    lineHeight: 1.45,
    color: "#000000",
    boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
    minHeight: 400,
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
  };

  const contactParts: { label: string; href?: string }[] = [];
  if (data.phone) contactParts.push({ label: data.phone });
  if (data.email) contactParts.push({ label: data.email, href: `mailto:${data.email}` });
  if (data.linkedIn) contactParts.push({ label: "LinkedIn Profile", href: data.linkedIn });
  if (data.website) contactParts.push({ label: "Website", href: data.website });
  if (data.location) contactParts.push({ label: data.location });

  const filledSkills = data.skills.filter((s) => s.category && s.skills);
  const filledProjects = data.projects.filter((pr) => pr.name);
  const filledEdu = data.education.filter((e) => e.institution);
  const filledCerts = data.certifications.filter((c) => c.provider && c.course);
  const filledExp = data.experience.filter((e) => e.company && e.role);

  const isEmpty =
    !data.fullName &&
    !data.summary &&
    filledSkills.length === 0 &&
    filledProjects.length === 0 &&
    filledEdu.length === 0 &&
    filledExp.length === 0 &&
    filledCerts.length === 0;

  const body = p.body;
  const bullet: React.CSSProperties = { ...body, marginBottom: 2 };
  const row: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: 4,
  };
  const entryMargin: React.CSSProperties = { marginBottom: 9 };
  const contentPad: React.CSSProperties = edgeToEdge ? { padding: p.pagePad } : {};

  const sampleContact = [
    { label: "you@email.com" },
    { label: "+1 555 000 0000" },
    { label: "City, Country" },
  ];

  const sections = (
    showGhosts: boolean,
    opts: {
      summary?: string;
      skills?: { id: string; category: string; skills: string }[];
      exp?: { id: string; company: string; role: string; duration: string; bullets: string }[];
      projects?: { id: string; name: string; url: string; bullets: string }[];
      edu?: { id: string; institution: string; degree: string; yearFrom: string; yearTo: string }[];
      certs?: { id: string; provider: string; course: string; year: string }[];
    }
  ) => (
    <>
      {(opts.summary || showGhosts) && (
        <>
          <PreviewSectionHeading title="Professional Summary" template={template} />
          {opts.summary ? <p style={body}>{opts.summary}</p> : <GhostSection label="a professional summary" />}
        </>
      )}

      {(opts.skills?.length || showGhosts) && (
        <>
          <PreviewSectionHeading title="Skills" template={template} />
          {opts.skills && opts.skills.length > 0 ? (
            opts.skills.map((sk) => (
              <p key={sk.id} style={bullet}>
                {"• "}
                <strong>{sk.category}</strong>
                {": "}
                {sk.skills}
              </p>
            ))
          ) : (
            <GhostSection label="skills" />
          )}
        </>
      )}

      {opts.exp && opts.exp.length > 0 && (
        <>
          <PreviewSectionHeading title="Experience" template={template} />
          {opts.exp.map((exp) => (
            <div key={exp.id} style={entryMargin}>
              <div style={row}>
                <span style={{ fontSize: "10.5pt" }}>
                  <strong>{exp.company}</strong>
                  {exp.role ? `, ${exp.role}` : ""}
                </span>
                <span style={{ fontSize: "9.5pt", color: "#444" }}>{exp.duration}</span>
              </div>
              {exp.bullets
                .split("\n")
                .filter(Boolean)
                .map((b, i) => (
                  <p key={i} style={bullet}>
                    {"• "}
                    {b}
                  </p>
                ))}
            </div>
          ))}
        </>
      )}

      {opts.projects && opts.projects.length > 0 && (
        <>
          <PreviewSectionHeading title="Projects" template={template} />
          {opts.projects.map((proj) => (
            <div key={proj.id} style={entryMargin}>
              <div style={row}>
                <strong style={{ fontSize: "10.5pt" }}>{proj.name}</strong>
                {proj.url && (
                  <a href={proj.url} style={{ color: "#0000EE", fontSize: "9.5pt" }} target="_blank" rel="noreferrer">
                    {proj.url.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
              {proj.bullets
                .split("\n")
                .filter(Boolean)
                .map((b, i) => (
                  <p key={i} style={bullet}>
                    {"• "}
                    {b}
                  </p>
                ))}
            </div>
          ))}
        </>
      )}

      {(opts.edu?.length || showGhosts) && (
        <>
          <PreviewSectionHeading title="Education" template={template} />
          {opts.edu && opts.edu.length > 0 ? (
            opts.edu.map((edu) => (
              <div key={edu.id} style={{ ...row, marginBottom: 5 }}>
                <span style={body}>
                  <strong>{edu.institution}</strong>
                  {edu.degree ? `, ${edu.degree}` : ""}
                </span>
                <span style={{ fontSize: "9.5pt", color: "#444" }}>
                  {[edu.yearFrom, edu.yearTo].filter(Boolean).join(" - ")}
                </span>
              </div>
            ))
          ) : (
            <GhostSection label="education" />
          )}
        </>
      )}

      {opts.certs && opts.certs.length > 0 && (
        <>
          <PreviewSectionHeading title="Certifications" template={template} />
          {opts.certs.map((cert) => (
            <div key={cert.id} style={{ ...row, marginBottom: 5 }}>
              <span style={body}>
                <strong>{cert.provider}</strong>
                {cert.course ? ` · ${cert.course}` : ""}
              </span>
              <span style={{ fontSize: "9.5pt", color: "#444" }}>{cert.year}</span>
            </div>
          ))}
        </>
      )}
    </>
  );

  const headerAndBody = (
    fullName: string,
    jobTitle: string,
    contacts: { label: string; href?: string }[],
    showGhosts: boolean,
    sectionOpts: Parameters<typeof sections>[1]
  ) => (
    <>
      {isTopBar && (
        <div style={{ height: p.topBarHeight || 8, background: template.accent, width: "100%" }} />
      )}
      {isBand ? (
        <PreviewHeader
          template={template}
          fullName={fullName}
          jobTitle={jobTitle}
          contactParts={contacts}
          showGhosts={showGhosts}
        />
      ) : null}
      <div style={contentPad}>
        {!isBand && (
          <PreviewHeader
            template={template}
            fullName={fullName}
            jobTitle={jobTitle}
            contactParts={contacts}
            showGhosts={showGhosts}
          />
        )}
        {sections(showGhosts, sectionOpts)}
      </div>
    </>
  );

  if (isEmpty) {
    return (
      <div style={wrap}>
        <p
          style={{
            fontSize: 11,
            color: "#999",
            textAlign: "center",
            margin: 0,
            padding: "10px 16px 0",
            fontFamily: "system-ui, sans-serif",
            position: "relative",
            zIndex: 1,
          }}
        >
          Sample look · <strong style={{ color: template.accent }}>{template.name}</strong> template
          {" · "}start filling the form to replace this
        </p>
        {headerAndBody("Alex Rivera", "Marketing Manager", sampleContact, false, {
          summary:
            "Results-driven professional with 5+ years of experience delivering measurable outcomes across teams and projects. Known for clear communication and reliable execution.",
          skills: [
            { id: "1", category: "Core", skills: "Communication, Leadership, Planning" },
            { id: "2", category: "Tools", skills: "Excel, CRM, Presentation software" },
          ],
          exp: [
            {
              id: "1",
              company: "Acme Company",
              role: "Marketing Manager",
              duration: "2021 - Present",
              bullets: "Grew campaign engagement by 40% year over year\nLed a cross-functional team of 6",
            },
          ],
          edu: [
            {
              id: "1",
              institution: "State University",
              degree: "Bachelor of Business Administration",
              yearFrom: "2017",
              yearTo: "2021",
            },
          ],
        })}
      </div>
    );
  }

  return (
    <div style={wrap}>
      {headerAndBody(data.fullName || "Your Name", data.jobTitle, contactParts, true, {
        summary: data.summary || undefined,
        skills: filledSkills,
        exp: filledExp,
        projects: filledProjects,
        edu: filledEdu,
        certs: filledCerts,
      })}
    </div>
  );
}

// ── Root component ────────────────────────────────────────────────────────────

const SECTIONS = [
  "Personal Information",
  "Professional Summary",
  "Skills",
  "Projects",
  "Education",
  "Certifications",
  "Experience",
];

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(EMPTY_DATA);
  const [openSections, setOpenSections] = useState<boolean[]>([true, false, false, false, false, false, false]);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ResumeData & { github?: string };
      setData({
        ...EMPTY_DATA,
        ...parsed,
        website: parsed.website || parsed.github || "",
        templateId: parsed.templateId || "classic",
      });
    } catch {}
  }, []);

  const update = useCallback((next: ResumeData) => {
    setData(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        const now = new Date();
        setSavedAt(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`);
      } catch {}
    }, 800);
  }, []);

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(EMPTY_DATA);
    setSavedAt(null);
  };

  const toggleSection = (i: number) =>
    setOpenSections((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const isSectionComplete = (i: number): boolean => {
    switch (i) {
      case 0: return !!(data.fullName && data.jobTitle && data.email);
      case 1: return !!data.summary;
      case 2: return data.skills.some((s) => s.category && s.skills);
      case 3: return data.projects.some((p) => p.name);
      case 4: return data.education.some((e) => e.institution);
      case 5: return data.certifications.some((c) => c.provider && c.course);
      case 6: return data.experience.some((e) => e.company && e.role);
      default: return false;
    }
  };

  const sectionBadge = (i: number): string | undefined => {
    switch (i) {
      case 2: { const n = data.skills.filter((s) => s.category && s.skills).length; return n ? `${n} skill${n > 1 ? "s" : ""}` : undefined; }
      case 3: { const n = data.projects.filter((p) => p.name).length; return n ? `${n} project${n > 1 ? "s" : ""}` : undefined; }
      case 4: { const n = data.education.filter((e) => e.institution).length; return n ? `${n} entry` : undefined; }
      case 5: { const n = data.certifications.filter((c) => c.provider).length; return n ? `${n} cert${n > 1 ? "s" : ""}` : undefined; }
      case 6: { const n = data.experience.filter((e) => e.company).length; return n ? `${n} role${n > 1 ? "s" : ""}` : undefined; }
      default: return undefined;
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleProjectDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = data.projects.findIndex((p) => p.id === active.id);
      const newIdx = data.projects.findIndex((p) => p.id === over.id);
      update({ ...data, projects: arrayMove(data.projects, oldIdx, newIdx) });
    }
  };

  const downloadPdf = async () => {
    setPdfBusy(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { ResumeDocument } = await import("@/lib/resumePDF");
      const blob = await pdf(<ResumeDocument data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(data.fullName || "Resume").replace(/\s+/g, "-")}-Resume.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setPdfBusy(false);
    }
  };

  const progress = calcProgress(data);
  const completedCount = SECTIONS.filter((_, i) => isSectionComplete(i)).length;

  // Dynamic list helpers
  const addSkill = () => update({ ...data, skills: [...data.skills, { id: uid(), category: "", skills: "" }] });
  const removeSkill = (id: string) => update({ ...data, skills: data.skills.filter((s) => s.id !== id) });
  const updateSkill = (id: string, field: keyof SkillCategory, val: string) =>
    update({ ...data, skills: data.skills.map((s) => (s.id === id ? { ...s, [field]: val } : s)) });

  const addProject = () => update({ ...data, projects: [...data.projects, { id: uid(), name: "", url: "", bullets: "" }] });
  const removeProject = (id: string) => update({ ...data, projects: data.projects.filter((p) => p.id !== id) });
  const updateProject = (proj: Project) =>
    update({ ...data, projects: data.projects.map((p) => (p.id === proj.id ? proj : p)) });

  const addEducation = () =>
    update({ ...data, education: [...data.education, { id: uid(), institution: "", degree: "", yearFrom: "", yearTo: "" }] });
  const removeEducation = (id: string) => update({ ...data, education: data.education.filter((e) => e.id !== id) });
  const updateEducation = (id: string, field: keyof Education, val: string) =>
    update({ ...data, education: data.education.map((e) => (e.id === id ? { ...e, [field]: val } : e)) });

  const addCert = () =>
    update({ ...data, certifications: [...data.certifications, { id: uid(), provider: "", course: "", year: "" }] });
  const removeCert = (id: string) => update({ ...data, certifications: data.certifications.filter((c) => c.id !== id) });
  const updateCert = (id: string, field: keyof Certification, val: string) =>
    update({ ...data, certifications: data.certifications.map((c) => (c.id === id ? { ...c, [field]: val } : c)) });

  const addExp = () =>
    update({ ...data, experience: [...data.experience, { id: uid(), company: "", role: "", duration: "", bullets: "" }] });
  const removeExp = (id: string) => update({ ...data, experience: data.experience.filter((e) => e.id !== id) });
  const updateExp = (id: string, field: keyof Experience, val: string) =>
    update({ ...data, experience: data.experience.map((e) => (e.id === id ? { ...e, [field]: val } : e)) });

  return (
    <motion.div
      className="resume-builder-root w-full max-w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Template picker */}
      <TemplatePicker
        selectedId={data.templateId}
        onSelect={(id) => update({ ...data, templateId: id })}
      />

      <div className="grid w-full max-w-full grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:min-h-[min(85vh,920px)] md:grid-cols-[42%_58%]">
        {/* ── LEFT PANEL ───────────────────────────────────────────────────── */}
        <div className="flex flex-col overflow-hidden border-b border-gray-100 bg-neutral-50 md:border-b-0 md:border-r md:border-gray-100">
          {/* Header, does not scroll */}
          <div className="shrink-0 bg-gray-900 px-6 py-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-brand-red">
                  <FileText className="h-5 w-5 text-white" strokeWidth={2} aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="m-0 text-[15px] font-bold leading-tight text-white">
                    {data.fullName || "Your Resume"}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-gray-500">
                    {completedCount} of {SECTIONS.length} sections · {progress}% done
                  </p>
                </div>
              </div>
              {savedAt ? (
                <div className="flex shrink-0 items-center gap-1.5 text-[11px] text-gray-500">
                  <Clock className="h-3 w-3 shrink-0 text-gray-600" strokeWidth={2} aria-hidden />
                  <span className="whitespace-nowrap">Saved {savedAt}</span>
                </div>
              ) : (
                <div className="flex shrink-0 items-center gap-1.5 text-[11px] text-gray-500 opacity-70">
                  <Clock className="h-3 w-3 shrink-0 text-gray-600" strokeWidth={2} aria-hidden />
                  <span className="whitespace-nowrap">Auto-save on</span>
                </div>
              )}
            </div>

            <div className="mt-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500">Resume progress</span>
                <span className="text-[11px] font-bold text-brand-red">{progress}%</span>
              </div>
              <div className="relative mt-1.5">
                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full rounded-full bg-brand-red"
                  />
                </div>
                {[
                  { id: "25", leftClass: "left-[25%]", filled: progress >= 25 },
                  { id: "50", leftClass: "left-1/2", filled: progress >= 50 },
                  { id: "75", leftClass: "left-[75%]", filled: progress >= 75 },
                  { id: "100", leftClass: "left-full", filled: progress >= 100 },
                ].map(({ id, leftClass, filled }) => (
                  <span
                    key={id}
                    aria-hidden
                    className={`pointer-events-none absolute top-1/2 box-border h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-900 ${leftClass} ${filled ? "bg-brand-red" : "bg-zinc-800"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Scrollable form */}
          <div className="space-y-2 px-5 py-4">
            {/* Section 1: Personal */}
            <Section index={0} title={SECTIONS[0]} open={openSections[0]} onToggle={() => toggleSection(0)} complete={isSectionComplete(0)}>
              <FieldRow>
                <FInput label="Full Name *" value={data.fullName} onChange={(v) => update({ ...data, fullName: v })} placeholder="Alex Rivera" />
                <FInput label="Job Title *" value={data.jobTitle} onChange={(v) => update({ ...data, jobTitle: v })} placeholder="Marketing Manager" />
              </FieldRow>
              <FieldRow>
                <FInput label="Phone" value={data.phone} onChange={(v) => update({ ...data, phone: v })} placeholder="+1 555 000 0000" />
                <FInput label="Email" value={data.email} onChange={(v) => update({ ...data, email: v })} placeholder="you@example.com" />
              </FieldRow>
              <FieldRow>
                <FInput label="LinkedIn URL" value={data.linkedIn} onChange={(v) => update({ ...data, linkedIn: v })} placeholder="linkedin.com/in/..." />
                <FInput label="Website / Portfolio" value={data.website} onChange={(v) => update({ ...data, website: v })} placeholder="yoursite.com" />
              </FieldRow>
              <FInput label="Location" value={data.location} onChange={(v) => update({ ...data, location: v })} placeholder="City, Country" />
            </Section>

            {/* Section 2: Summary */}
            <Section index={1} title={SECTIONS[1]} open={openSections[1]} onToggle={() => toggleSection(1)} complete={isSectionComplete(1)}>
              <FInput
                label="Write 2-4 sentences about your expertise"
                value={data.summary}
                onChange={(v) => update({ ...data, summary: v })}
                placeholder="Results-driven professional with 5+ years of experience delivering measurable outcomes across teams and projects..."
                textarea
                rows={5}
                maxLength={500}
              />
            </Section>

            {/* Section 3: Skills */}
            <Section index={2} title={SECTIONS[2]} open={openSections[2]} onToggle={() => toggleSection(2)} complete={isSectionComplete(2)} badge={sectionBadge(2)}>
              {data.skills.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 16px", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em" }}>Skills</span>
                  <span />
                </div>
              )}
              {data.skills.map((sk) => (
                <div key={sk.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 24px", gap: 6, alignItems: "center", marginBottom: 6 }}>
                  <input
                    className="rb-skill-input"
                    style={{
                      width: "100%",
                      background: "#FAFAFA",
                      border: "1.5px solid #EBEBEB",
                      borderRadius: 10,
                      padding: "11px 14px",
                      fontSize: 13,
                      color: "#111",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      transition: "all 0.2s ease",
                    }}
                    placeholder="Category (e.g. Communication)"
                    value={sk.category}
                    onChange={(e) => updateSkill(sk.id, "category", e.target.value)}
                  />
                  <input
                    className="rb-skill-input"
                    style={{
                      width: "100%",
                      background: "#FAFAFA",
                      border: "1.5px solid #EBEBEB",
                      borderRadius: 10,
                      padding: "11px 14px",
                      fontSize: 13,
                      color: "#111",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      transition: "all 0.2s ease",
                    }}
                    placeholder="Public speaking, Excel, Negotiation"
                    value={sk.skills}
                    onChange={(e) => updateSkill(sk.id, "skills", e.target.value)}
                  />
                  <button onClick={() => removeSkill(sk.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", padding: 0, display: "flex", alignItems: "center" }}>
                    <X size={13} />
                  </button>
                </div>
              ))}
              {data.skills.length === 0 && (
                <EmptyState
                  message="No skill categories yet"
                  hint={`Click '+ Add Category' below to get started`}
                  icon={Layers}
                />
              )}
              <AddButton label="Add Category" onClick={addSkill} />
            </Section>

            {/* Section 4: Projects */}
            <Section index={3} title={SECTIONS[3]} open={openSections[3]} onToggle={() => toggleSection(3)} complete={isSectionComplete(3)} badge={sectionBadge(3)} optional>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleProjectDragEnd}>
                <SortableContext items={data.projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                  {data.projects.map((proj) => (
                    <SortableProject
                      key={proj.id}
                      proj={proj}
                      onChange={updateProject}
                      onRemove={() => removeProject(proj.id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
              {data.projects.length === 0 && (
                <EmptyState
                  message="No projects added yet"
                  hint={`Click '+ Add Project' below to get started`}
                  icon={FolderOpen}
                />
              )}
              <AddButton label="Add Project" onClick={addProject} />
            </Section>

            {/* Section 5: Education */}
            <Section index={4} title={SECTIONS[4]} open={openSections[4]} onToggle={() => toggleSection(4)} complete={isSectionComplete(4)} badge={sectionBadge(4)}>
              {data.education.map((edu) => (
                <EntryCard key={edu.id} onRemove={() => removeEducation(edu.id)}>
                  <FInput label="Institution *" value={edu.institution} onChange={(v) => updateEducation(edu.id, "institution", v)} placeholder="University of XYZ" />
                  <FInput label="Degree / Level *" value={edu.degree} onChange={(v) => updateEducation(edu.id, "degree", v)} placeholder="Bachelor of Business Administration" />
                  <FieldRow>
                    <FInput label="Year From" value={edu.yearFrom} onChange={(v) => updateEducation(edu.id, "yearFrom", v)} placeholder="2020" />
                    <FInput label="Year To" value={edu.yearTo} onChange={(v) => updateEducation(edu.id, "yearTo", v)} placeholder="2024" />
                  </FieldRow>
                </EntryCard>
              ))}
              {data.education.length === 0 && (
                <EmptyState
                  message="No education added yet"
                  hint={`Click '+ Add Education' below to get started`}
                  icon={GraduationCap}
                />
              )}
              <AddButton label="Add Education" onClick={addEducation} />
            </Section>

            {/* Section 6: Certifications */}
            <Section index={5} title={SECTIONS[5]} open={openSections[5]} onToggle={() => toggleSection(5)} complete={isSectionComplete(5)} badge={sectionBadge(5)} optional>
              {data.certifications.map((cert) => (
                <EntryCard key={cert.id} onRemove={() => removeCert(cert.id)}>
                  <FieldRow>
                    <FInput label="Provider *" value={cert.provider} onChange={(v) => updateCert(cert.id, "provider", v)} placeholder="Google" />
                    <FInput label="Year" value={cert.year} onChange={(v) => updateCert(cert.id, "year", v)} placeholder="2024" />
                  </FieldRow>
                  <FInput label="Certificate Name *" value={cert.course} onChange={(v) => updateCert(cert.id, "course", v)} placeholder="Digital Marketing Certificate" />
                </EntryCard>
              ))}
              {data.certifications.length === 0 && (
                <EmptyState
                  message="No certifications added yet"
                  hint={`Click '+ Add Certification' below to get started`}
                  icon={Award}
                />
              )}
              <AddButton label="Add Certification" onClick={addCert} />
            </Section>

            {/* Section 7: Experience */}
            <Section index={6} title={SECTIONS[6]} open={openSections[6]} onToggle={() => toggleSection(6)} complete={isSectionComplete(6)} badge={sectionBadge(6)} optional>
              {data.experience.map((exp) => (
                <EntryCard key={exp.id} onRemove={() => removeExp(exp.id)}>
                  <FieldRow>
                    <FInput label="Company *" value={exp.company} onChange={(v) => updateExp(exp.id, "company", v)} placeholder="Acme Corp" />
                    <FInput label="Role / Title *" value={exp.role} onChange={(v) => updateExp(exp.id, "role", v)} placeholder="Operations Lead" />
                  </FieldRow>
                  <FInput label="Duration" value={exp.duration} onChange={(v) => updateExp(exp.id, "duration", v)} placeholder="Jan 2023 - Present" />
                  <FInput
                    label="Description (one bullet per line)"
                    value={exp.bullets}
                    onChange={(v) => updateExp(exp.id, "bullets", v)}
                    placeholder={"Grew revenue by 25% year over year\nLed a team of 6 across two regions"}
                    textarea
                    rows={3}
                    hint="Each line → one bullet point"
                  />
                </EntryCard>
              ))}
              {data.experience.length === 0 && (
                <EmptyState
                  message="No experience added yet"
                  hint={`Click '+ Add Experience' below to get started`}
                  icon={Briefcase}
                />
              )}
              <AddButton label="Add Experience" onClick={addExp} />
            </Section>

            <div className="h-5 shrink-0" aria-hidden />
          </div>

          {/* Bottom bar, does not scroll */}
          <div className="flex shrink-0 gap-3 border-t border-gray-100 bg-white p-4">
            <button
              type="button"
              className="rb-btn-download flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-brand-red px-6 py-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-80"
              onClick={downloadPdf}
              disabled={pdfBusy}
            >
              {pdfBusy ? <Loader2 className="h-4 w-4 shrink-0 animate-spin text-white" aria-hidden /> : <Download className="h-4 w-4 shrink-0 text-white" strokeWidth={2} aria-hidden />}
              {pdfBusy ? "Generating..." : "Download PDF"}
            </button>
            <button
              type="button"
              className="rb-btn-reset flex shrink-0 items-center gap-2 rounded-[10px] border border-gray-300 bg-neutral-100 px-5 py-3.5 text-sm font-semibold text-gray-600"
              onClick={reset}
              title="Clear all data"
            >
              <RotateCcw className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden /> Reset
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL ──────────────────────────────────────────────────── */}
        <div className="flex min-h-[520px] flex-col bg-gray-100 bg-[radial-gradient(circle,_#DCDCDC_1px,_transparent_1px)] bg-[length:20px_20px] md:min-h-0">
          {/* Live Preview label row + export */}
          <div className="relative box-border flex w-full shrink-0 items-center justify-between px-5 pb-3 pt-4">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 shrink-0 animate-pulse rounded-full bg-green-500" aria-hidden />
              <span className="text-[13px] font-semibold text-gray-600">Live Preview</span>
            </div>
            <button
              type="button"
              className="rb-btn-export flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-red px-5 py-2 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-80"
              onClick={downloadPdf}
              disabled={pdfBusy}
            >
              {pdfBusy ? <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-white" aria-hidden /> : <Download className="h-3.5 w-3.5 shrink-0 text-white" strokeWidth={2} aria-hidden />}
              Export PDF
            </button>
          </div>

          <div className="flex min-h-0 flex-1 w-full items-start justify-center overflow-auto px-5 pb-5 pt-0">
            <ResumePreview data={data} />
          </div>
        </div>
      </div>

      <style>{`
        .resume-builder-root input::placeholder,
        .resume-builder-root textarea::placeholder {
          color: #CCC;
        }
        .resume-builder-root .rb-skill-input:focus {
          outline: none;
          background: #fff;
          border-color: #DF0A09;
          box-shadow: 0 0 0 3px rgba(223, 10, 9, 0.08);
        }
        .resume-builder-root .rb-btn-download:not(:disabled):hover {
          background: #B30807 !important;
          transform: translateY(-1px);
        }
        .resume-builder-root .rb-btn-download:active:not(:disabled) {
          transform: translateY(0);
        }
        .resume-builder-root .rb-btn-reset:hover {
          background: #EBEBEB !important;
          color: #111 !important;
        }
        .resume-builder-root .rb-btn-export:not(:disabled):hover {
          background: #B30807 !important;
        }
      `}</style>
    </motion.div>
  );
}
