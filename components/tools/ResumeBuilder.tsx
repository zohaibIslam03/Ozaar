"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  X,
  Download,
  RotateCcw,
  GripVertical,
  CheckCircle2,
  Loader2,
  FileText,
  User,
  AlignLeft,
  Code2,
  FolderOpen,
  GraduationCap,
  Award,
  Briefcase,
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
    background: "#fff",
    border: `1.5px solid ${focused ? "#DF0A09" : "#E2E2E2"}`,
    borderRadius: 8,
    padding: textarea ? "10px 12px" : "9px 12px",
    fontSize: 13,
    color: "#111",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    boxShadow: focused ? "0 0 0 3px rgba(223,10,9,0.07)" : "none",
    resize: textarea ? ("vertical" as const) : undefined,
    lineHeight: textarea ? 1.55 : undefined,
    fontFamily: "inherit",
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#666", display: "block", marginBottom: 4, letterSpacing: "0.03em", textTransform: "uppercase" }}>
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
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
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
        borderLeft: "3px solid #DF0A09",
        borderRadius: 8,
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

  return (
    <div
      style={{
        borderBottom: "1px solid #EBEBEB",
        borderLeft: open ? "2px solid #DF0A09" : "2px solid transparent",
        marginLeft: -1,
        paddingLeft: open ? 10 : 0,
        transition: "border-color 0.2s, padding-left 0.2s",
      }}
    >
      <div
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 0",
          cursor: "pointer",
          userSelect: "none",
          background: hovered && !open ? "rgba(0,0,0,0.01)" : "transparent",
          transition: "background 0.15s",
          borderRadius: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: open ? "#DF0A09" : complete ? "#f0fdf4" : "#F5F5F5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            {complete && !open ? (
              <CheckCircle2 size={13} color="#22c55e" />
            ) : (
              <Icon size={13} color={open ? "#fff" : "#888"} />
            )}
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: open ? "#111" : "#333" }}>{title}</span>
          {badge && !open && (
            <span style={{ fontSize: 10, color: "#999", background: "#F0F0F0", borderRadius: 99, padding: "2px 7px", fontWeight: 600 }}>
              {badge}
            </span>
          )}
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={15} color={open ? "#DF0A09" : "#aaa"} />
        </motion.div>
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
            <div style={{ paddingBottom: 16 }}>{children}</div>
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
        borderLeft: "3px solid #DF0A09",
        borderRadius: 8,
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

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ textAlign: "center", padding: "16px 0 8px", color: "#bbb", fontSize: 12 }}>
      {message}
    </div>
  );
}

// ── Resume preview ────────────────────────────────────────────────────────────

const RES: Record<string, React.CSSProperties> = {
  wrap: {
    width: "100%",
    maxWidth: 660,
    background: "#ffffff",
    border: "1px solid #E0E0E0",
    borderRadius: 2,
    padding: "40px 48px",
    fontFamily: "'Times New Roman', Georgia, serif",
    fontSize: "11pt",
    lineHeight: 1.45,
    color: "#000000",
    boxShadow: "0 2px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)",
    minHeight: 860,
    boxSizing: "border-box",
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
      <div style={{ ...RES.wrap, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <FileText size={40} color="#E0E0E0" />
        <p style={{ fontSize: 13, color: "#ccc", textAlign: "center", maxWidth: 220, lineHeight: 1.6 }}>
          Start filling in the form on the left — your resume will appear here instantly.
        </p>
      </div>
    );
  }

  return (
    <div style={RES.wrap}>
      <div style={RES.name}>{data.fullName || "Your Name"}</div>
      {data.jobTitle && <div style={RES.jobTitle}>{data.jobTitle}</div>}

      {contactParts.length > 0 && (
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
      )}

      {data.summary && (
        <>
          <div style={RES.sectionTitle}>Professional Summary</div>
          <SectionRule />
          <p style={RES.body}>{data.summary}</p>
        </>
      )}

      {filledSkills.length > 0 && (
        <>
          <div style={RES.sectionTitle}>Technical Skills</div>
          <SectionRule />
          {filledSkills.map((sk) => (
            <p key={sk.id} style={{ ...RES.bullet, marginBottom: 2 }}>
              {"• "}<strong>{sk.category}</strong>{": "}{sk.skills}
            </p>
          ))}
        </>
      )}

      {filledExp.length > 0 && (
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
      )}

      {filledProjects.length > 0 && (
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
      )}

      {filledEdu.length > 0 && (
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
      )}

      {filledCerts.length > 0 && (
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
  const [isMobile, setIsMobile] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        width: isMobile ? "100%" : "80vw",
        marginLeft: isMobile ? 0 : "calc(50% - 40vw)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "38% 62%",
          minHeight: "82vh",
          border: "1.5px solid #E2E2E2",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
        }}
      >
        {/* ── LEFT PANEL ───────────────────────────────────────────────────── */}
        <div
          style={{
            background: "#FAFAFA",
            borderRight: isMobile ? "none" : "1.5px solid #E8E8E8",
            borderBottom: isMobile ? "1.5px solid #E8E8E8" : "none",
            display: "flex",
            flexDirection: "column",
            maxHeight: isMobile ? "none" : "85vh",
          }}
        >
          {/* Panel header */}
          <div style={{ padding: "20px 22px 0", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={15} color="#fff" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#111", lineHeight: 1.2 }}>
                    {data.fullName || "Your Resume"}
                  </p>
                  <p style={{ fontSize: 10.5, color: "#999", lineHeight: 1 }}>
                    {completedCount} of {SECTIONS.length} sections done
                  </p>
                </div>
              </div>
              {savedAt && (
                <span style={{ fontSize: 10, color: "#bbb", whiteSpace: "nowrap" }}>
                  Saved {savedAt}
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ background: "#EBEBEB", borderRadius: 99, height: 5, overflow: "hidden" }}>
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{
                    height: "100%",
                    background: progress === 100 ? "#22c55e" : "linear-gradient(90deg, #DF0A09 0%, #ff4444 100%)",
                    borderRadius: 99,
                  }}
                />
              </div>
              <p style={{ fontSize: 10.5, color: "#aaa", marginTop: 4 }}>{progress}% complete</p>
            </div>

            <div style={{ height: 1, background: "#EBEBEB", marginBottom: 4, marginLeft: -22, marginRight: -22 }} />
          </div>

          {/* Scrollable sections */}
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 22px 0" }}>
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
                    style={{ width: "100%", background: "#fff", border: "1.5px solid #E2E2E2", borderRadius: 7, padding: "8px 10px", fontSize: 12, color: "#111", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                    placeholder="Languages"
                    value={sk.category}
                    onChange={(e) => updateSkill(sk.id, "category", e.target.value)}
                  />
                  <input
                    style={{ width: "100%", background: "#fff", border: "1.5px solid #E2E2E2", borderRadius: 7, padding: "8px 10px", fontSize: 12, color: "#111", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                    placeholder="PHP, JavaScript, SQL"
                    value={sk.skills}
                    onChange={(e) => updateSkill(sk.id, "skills", e.target.value)}
                  />
                  <button onClick={() => removeSkill(sk.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", padding: 0, display: "flex", alignItems: "center" }}>
                    <X size={13} />
                  </button>
                </div>
              ))}
              {data.skills.length === 0 && <EmptyState message="No skill categories yet" />}
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
              {data.projects.length === 0 && <EmptyState message="No projects yet — drag to reorder once added" />}
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
              {data.education.length === 0 && <EmptyState message="No education entries yet" />}
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
              {data.certifications.length === 0 && <EmptyState message="No certifications yet" />}
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
              {data.experience.length === 0 && <EmptyState message="No experience entries yet" />}
              <AddButton label="Add Experience" onClick={addExp} />
            </Section>

            <div style={{ height: 20 }} />
          </div>

          {/* Action bar */}
          <div
            style={{
              background: "#fff",
              borderTop: "1.5px solid #EBEBEB",
              padding: "14px 22px",
              display: "flex",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <button
              onClick={downloadPdf}
              disabled={pdfBusy}
              style={{
                flex: 1,
                background: "#111",
                color: "#fff",
                border: "none",
                borderRadius: 9,
                padding: "11px 0",
                fontSize: 13,
                fontWeight: 700,
                cursor: pdfBusy ? "not-allowed" : "pointer",
                opacity: pdfBusy ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                transition: "opacity 0.15s",
              }}
            >
              {pdfBusy ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Download size={14} />}
              {pdfBusy ? "Generating…" : "Download PDF"}
            </button>
            <button
              onClick={reset}
              title="Clear all data"
              style={{
                background: "transparent",
                color: "#aaa",
                border: "1.5px solid #E8E8E8",
                borderRadius: 9,
                padding: "11px 14px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                transition: "color 0.15s, border-color 0.15s",
              }}
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL ──────────────────────────────────────────────────── */}
        <div
          style={{
            background: "#F4F4F4",
            backgroundImage: "radial-gradient(circle, #DCDCDC 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            padding: "28px 20px",
            overflowY: isMobile ? "visible" : "auto",
            maxHeight: isMobile ? "none" : "85vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Header bar */}
          <div style={{ width: "100%", maxWidth: 660, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#666", letterSpacing: "0.02em" }}>Live Preview</span>
            </div>
            <button
              onClick={downloadPdf}
              disabled={pdfBusy}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "#DF0A09",
                color: "#fff",
                border: "none",
                borderRadius: 7,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 700,
                cursor: pdfBusy ? "not-allowed" : "pointer",
                opacity: pdfBusy ? 0.7 : 1,
              }}
            >
              {pdfBusy ? <Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} /> : <Download size={11} />}
              Export PDF
            </button>
          </div>

          <ResumePreview data={data} />
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
}
