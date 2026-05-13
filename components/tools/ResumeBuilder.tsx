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
  Code2,
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
  github: "",
  location: "",
  summary: "",
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
  let score = 0;
  if (d.fullName) score++;
  if (d.jobTitle) score++;
  if (d.email) score++;
  if (d.phone) score++;
  if (d.location) score++;
  if (d.summary) score++;
  if (d.skills.some((s) => s.category && s.skills)) score++;
  if (d.projects.some((p) => p.name)) score++;
  if (d.education.some((e) => e.institution)) score++;
  if (d.certifications.some((c) => c.provider && c.course)) score++;
  return Math.round((score / 10) * 100);
}

// ── Section accordion ─────────────────────────────────────────────────────────

const SECTION_ICONS = [User, AlignLeft, Code2, FolderOpen, GraduationCap, Award, Briefcase];

const SECTION_TIPS = [
  "Fill your name and email first — they appear at the top of your resume.",
  "Keep it under 3 sentences. Focus on your biggest strengths.",
  "Group skills by category for better ATS readability.",
  "Include GitHub links — recruiters always check.",
  "List most recent education first.",
  "Add relevant certs to stand out from applicants.",
  "Use action verbs: Built, Led, Improved, Reduced.",
];

function Section({
  index,
  title,
  open,
  onToggle,
  complete,
  badge,
  children,
}: {
  index: number;
  title: string;
  open: boolean;
  onToggle: () => void;
  complete?: boolean;
  badge?: string;
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
        <span style={{ fontSize: 14, fontWeight: 600, color: "#111", flex: 1, minWidth: 0 }}>{title}</span>
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
        <FInput label="Project Name *" value={proj.name} onChange={(v) => onChange({ ...proj, name: v })} placeholder="E-Commerce Platform" />
        <FInput label="GitHub / Live URL" value={proj.url} onChange={(v) => onChange({ ...proj, url: v })} placeholder="https://github.com/..." />
        <FInput
          label="Description (one bullet per line)"
          value={proj.bullets}
          onChange={(v) => onChange({ ...proj, bullets: v })}
          placeholder={"Built with Laravel and Vue.js\nIntegrated Stripe payments"}
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

const RES: Record<string, React.CSSProperties> = {
  wrap: {
    width: "100%",
    maxWidth: 660,
    background: "#ffffff",
    border: "1px solid #E0E0E0",
    borderRadius: 8,
    margin: "0 20px 20px",
    padding: "40px 48px",
    fontFamily: "'Times New Roman', Georgia, serif",
    fontSize: "11pt",
    lineHeight: 1.45,
    color: "#000000",
    boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
    minHeight: 400,
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
  },
  name: { fontSize: "24pt", fontWeight: "bold", textAlign: "center", color: "#000", marginBottom: 5 },
  jobTitle: { fontSize: "11pt", textAlign: "center", color: "#444", marginBottom: 6, fontStyle: "italic" },
  contactLine: { textAlign: "center", fontSize: "9.5pt", color: "#333", marginBottom: 14, lineHeight: 1.7 },
  sectionTitle: {
    fontSize: "10.5pt",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#000",
    marginTop: 14,
    marginBottom: 3,
  },
  sectionRule: { borderTop: "1.5px solid #000", marginBottom: 7 },
  body: { fontSize: "10pt", color: "#111", lineHeight: 1.5 },
  bullet: { fontSize: "10pt", color: "#111", lineHeight: 1.5, marginBottom: 2 },
  row: { display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 4 },
  entryMargin: { marginBottom: 9 },
};

function SectionRule() {
  return <hr style={RES.sectionRule} />;
}

function ResumePreview({ data }: { data: ResumeData }) {
  const contactParts: { label: string; href?: string }[] = [];
  if (data.phone) contactParts.push({ label: data.phone });
  if (data.email) contactParts.push({ label: data.email, href: `mailto:${data.email}` });
  if (data.linkedIn) contactParts.push({ label: "LinkedIn Profile", href: data.linkedIn });
  if (data.github) contactParts.push({ label: "GitHub Profile", href: data.github });
  if (data.location) contactParts.push({ label: data.location });

  const filledSkills = data.skills.filter((s) => s.category && s.skills);
  const filledProjects = data.projects.filter((p) => p.name);
  const filledEdu = data.education.filter((e) => e.institution);
  const filledCerts = data.certifications.filter((c) => c.provider && c.course);
  const filledExp = data.experience.filter((e) => e.company && e.role);

  const isEmpty =
    !data.fullName &&
    !data.summary &&
    filledSkills.length === 0 &&
    filledProjects.length === 0 &&
    filledEdu.length === 0 &&
    filledExp.length === 0;

  if (isEmpty) {
    return (
      <div style={{ ...RES.wrap, display: "flex", flexDirection: "column" }}>
        <FileText size={40} color="#E0E0E0" style={{ alignSelf: "center", marginBottom: 12 }} />
        <p style={{ fontSize: 13, color: "#ccc", textAlign: "center", maxWidth: 280, lineHeight: 1.6, alignSelf: "center", marginBottom: 20 }}>
          Start filling in the form on the left — your resume will appear here instantly.
        </p>
        <GhostSection label="your name and headline" />
        <GhostSection label="a professional summary" />
        <GhostSection label="skills" />
        <GhostSection label="experience" />
        <GhostSection label="projects" />
        <GhostSection label="education" />
        <GhostSection label="certifications" />
      </div>
    );
  }

  return (
    <div style={RES.wrap}>
      <div style={RES.name}>{data.fullName || "Your Name"}</div>
      {data.jobTitle ? <div style={RES.jobTitle}>{data.jobTitle}</div> : <GhostSection label="your job title" />}

      {contactParts.length > 0 ? (
        <div style={RES.contactLine}>
          {contactParts.map((p, i) => (
            <span key={i}>
              {i > 0 && <span style={{ color: "#999", margin: "0 4px" }}>|</span>}
              {p.href ? (
                <a href={p.href} style={{ color: "#0000EE" }} target="_blank" rel="noreferrer">
                  {p.label}
                </a>
              ) : (
                p.label
              )}
            </span>
          ))}
        </div>
      ) : (
        <GhostSection label="contact details" />
      )}

      {data.summary ? (
        <>
          <div style={RES.sectionTitle}>Professional Summary</div>
          <SectionRule />
          <p style={RES.body}>{data.summary}</p>
        </>
      ) : (
        <>
          <div style={RES.sectionTitle}>Professional Summary</div>
          <SectionRule />
          <GhostSection label="a professional summary" />
        </>
      )}

      {filledSkills.length > 0 ? (
        <>
          <div style={RES.sectionTitle}>Technical Skills</div>
          <SectionRule />
          {filledSkills.map((sk) => (
            <p key={sk.id} style={{ ...RES.bullet, marginBottom: 2 }}>
              {"• "}<strong>{sk.category}</strong>{": "}{sk.skills}
            </p>
          ))}
        </>
      ) : (
        <>
          <div style={RES.sectionTitle}>Technical Skills</div>
          <SectionRule />
          <GhostSection label="skills" />
        </>
      )}

      {filledExp.length > 0 ? (
        <>
          <div style={RES.sectionTitle}>Experience</div>
          <SectionRule />
          {filledExp.map((exp) => (
            <div key={exp.id} style={RES.entryMargin}>
              <div style={RES.row}>
                <span style={{ fontSize: "10.5pt" }}>
                  <strong>{exp.company}</strong>{exp.role ? ` — ${exp.role}` : ""}
                </span>
                <span style={{ fontSize: "9.5pt", color: "#444" }}>{exp.duration}</span>
              </div>
              {exp.bullets.split("\n").filter(Boolean).map((b, i) => (
                <p key={i} style={RES.bullet}>{"• "}{b}</p>
              ))}
            </div>
          ))}
        </>
      ) : (
        <>
          <div style={RES.sectionTitle}>Experience</div>
          <SectionRule />
          <GhostSection label="experience" />
        </>
      )}

      {filledProjects.length > 0 ? (
        <>
          <div style={RES.sectionTitle}>Projects</div>
          <SectionRule />
          {filledProjects.map((proj) => (
            <div key={proj.id} style={RES.entryMargin}>
              <div style={RES.row}>
                <strong style={{ fontSize: "10.5pt" }}>{proj.name}</strong>
                {proj.url && (
                  <a href={proj.url} style={{ color: "#0000EE", fontSize: "9.5pt" }} target="_blank" rel="noreferrer">
                    {proj.url.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
              {proj.bullets.split("\n").filter(Boolean).map((b, i) => (
                <p key={i} style={RES.bullet}>{"• "}{b}</p>
              ))}
            </div>
          ))}
        </>
      ) : (
        <>
          <div style={RES.sectionTitle}>Projects</div>
          <SectionRule />
          <GhostSection label="projects" />
        </>
      )}

      {filledEdu.length > 0 ? (
        <>
          <div style={RES.sectionTitle}>Education</div>
          <SectionRule />
          {filledEdu.map((edu) => (
            <div key={edu.id} style={{ ...RES.row, marginBottom: 5 }}>
              <span style={RES.body}>
                <strong>{edu.institution}</strong>
                {edu.degree ? ` — ${edu.degree}` : ""}
              </span>
              <span style={{ fontSize: "9.5pt", color: "#444" }}>
                {[edu.yearFrom, edu.yearTo].filter(Boolean).join(" – ")}
              </span>
            </div>
          ))}
        </>
      ) : (
        <>
          <div style={RES.sectionTitle}>Education</div>
          <SectionRule />
          <GhostSection label="education" />
        </>
      )}

      {filledCerts.length > 0 ? (
        <>
          <div style={RES.sectionTitle}>Certifications</div>
          <SectionRule />
          {filledCerts.map((cert) => (
            <div key={cert.id} style={{ ...RES.row, marginBottom: 5 }}>
              <span style={RES.body}>
                <strong>{cert.provider}</strong>{cert.course ? ` · ${cert.course}` : ""}
              </span>
              <span style={{ fontSize: "9.5pt", color: "#444" }}>{cert.year}</span>
            </div>
          ))}
        </>
      ) : (
        <>
          <div style={RES.sectionTitle}>Certifications</div>
          <SectionRule />
          <GhostSection label="certifications" />
        </>
      )}
    </div>
  );
}

// ── Root component ────────────────────────────────────────────────────────────

const SECTIONS = [
  "Personal Information",
  "Professional Summary",
  "Technical Skills",
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
      if (raw) setData(JSON.parse(raw) as ResumeData);
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
      <div className="grid w-full max-w-full grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-[42%_58%]">
        {/* ── LEFT PANEL ───────────────────────────────────────────────────── */}
        <div className="flex flex-col overflow-hidden border-b border-gray-100 bg-neutral-50 md:border-b-0 md:border-r md:border-gray-100">
          {/* Header — does not scroll */}
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
                <FInput label="Full Name *" value={data.fullName} onChange={(v) => update({ ...data, fullName: v })} placeholder="Jane Smith" />
                <FInput label="Job Title *" value={data.jobTitle} onChange={(v) => update({ ...data, jobTitle: v })} placeholder="Software Engineer" />
              </FieldRow>
              <FieldRow>
                <FInput label="Phone" value={data.phone} onChange={(v) => update({ ...data, phone: v })} placeholder="+1 555 000 0000" />
                <FInput label="Email" value={data.email} onChange={(v) => update({ ...data, email: v })} placeholder="you@example.com" />
              </FieldRow>
              <FieldRow>
                <FInput label="LinkedIn URL" value={data.linkedIn} onChange={(v) => update({ ...data, linkedIn: v })} placeholder="linkedin.com/in/..." />
                <FInput label="GitHub URL" value={data.github} onChange={(v) => update({ ...data, github: v })} placeholder="github.com/..." />
              </FieldRow>
              <FInput label="Location" value={data.location} onChange={(v) => update({ ...data, location: v })} placeholder="New York, NY" />
            </Section>

            {/* Section 2: Summary */}
            <Section index={1} title={SECTIONS[1]} open={openSections[1]} onToggle={() => toggleSection(1)} complete={isSectionComplete(1)}>
              <FInput
                label="Write 2–4 sentences about your expertise"
                value={data.summary}
                onChange={(v) => update({ ...data, summary: v })}
                placeholder="Experienced developer with 3+ years building scalable web applications..."
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
                    placeholder="Languages"
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
                    placeholder="PHP, JavaScript, SQL"
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
                  icon={Code2}
                />
              )}
              <AddButton label="Add Category" onClick={addSkill} />
            </Section>

            {/* Section 4: Projects */}
            <Section index={3} title={SECTIONS[3]} open={openSections[3]} onToggle={() => toggleSection(3)} complete={isSectionComplete(3)} badge={sectionBadge(3)}>
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
                  <FInput label="Degree / Level *" value={edu.degree} onChange={(v) => updateEducation(edu.id, "degree", v)} placeholder="B.Sc. Computer Science" />
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
            <Section index={5} title={SECTIONS[5]} open={openSections[5]} onToggle={() => toggleSection(5)} complete={isSectionComplete(5)} badge={sectionBadge(5)}>
              {data.certifications.map((cert) => (
                <EntryCard key={cert.id} onRemove={() => removeCert(cert.id)}>
                  <FieldRow>
                    <FInput label="Provider *" value={cert.provider} onChange={(v) => updateCert(cert.id, "provider", v)} placeholder="Meta" />
                    <FInput label="Year" value={cert.year} onChange={(v) => updateCert(cert.id, "year", v)} placeholder="2024" />
                  </FieldRow>
                  <FInput label="Certificate Name *" value={cert.course} onChange={(v) => updateCert(cert.id, "course", v)} placeholder="Back-End Development Professional Certificate" />
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
            <Section index={6} title={SECTIONS[6]} open={openSections[6]} onToggle={() => toggleSection(6)} complete={isSectionComplete(6)} badge={sectionBadge(6)}>
              {data.experience.map((exp) => (
                <EntryCard key={exp.id} onRemove={() => removeExp(exp.id)}>
                  <FieldRow>
                    <FInput label="Company *" value={exp.company} onChange={(v) => updateExp(exp.id, "company", v)} placeholder="Acme Corp" />
                    <FInput label="Role / Title *" value={exp.role} onChange={(v) => updateExp(exp.id, "role", v)} placeholder="Software Engineer" />
                  </FieldRow>
                  <FInput label="Duration" value={exp.duration} onChange={(v) => updateExp(exp.id, "duration", v)} placeholder="Jan 2023 – Present" />
                  <FInput
                    label="Description (one bullet per line)"
                    value={exp.bullets}
                    onChange={(v) => updateExp(exp.id, "bullets", v)}
                    placeholder={"Built REST APIs with Node.js\nReduced latency by 30%"}
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

          {/* Bottom bar — does not scroll */}
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
        <div className="flex flex-col bg-gray-100 bg-[radial-gradient(circle,_#DCDCDC_1px,_transparent_1px)] bg-[length:20px_20px]">
          {/* Live Preview label row + export */}
          <div className="relative box-border flex w-full max-w-[700px] shrink-0 items-center justify-between self-center px-5 pb-3 pt-4">
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

          <div className="flex w-full justify-center pb-5">
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
