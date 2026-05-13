"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ChevronLeft, ChevronRight, Download, RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Experience {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  start: string;
  end: string;
}

interface ResumeData {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
    website: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
}

const EMPTY: ResumeData = {
  personal: { name: "", email: "", phone: "", location: "", title: "", summary: "", website: "" },
  experience: [],
  education: [],
  skills: [],
};

const STORAGE_KEY = "resume_builder_v1";

function uid() { return Math.random().toString(36).slice(2); }

// ── PDF doc (dynamically imported to avoid SSR issues) ───────────────────────

// We keep PDF rendering client-only
const ResumePdf = dynamic(() => import("./ResumePdf"), { ssr: false });

// ── Field helpers ─────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  type?: string;
}) {
  const base = "w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-red/50 transition-colors";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-brand-muted uppercase tracking-wider">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${base} resize-y`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  );
}

// ── Step indicator ───────────────────────────────────────────────────────────

const STEPS = ["Personal", "Experience", "Education", "Skills", "Preview"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-1 sm:gap-2">
          <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-all ${
            i === current ? "bg-brand-red text-white" :
            i < current  ? "bg-brand-red/20 text-brand-red border border-brand-red/30" :
            "bg-[#1a1a1a] text-brand-muted/60 border border-brand-border"
          }`}>
            {i < current ? "✓" : i + 1}
          </div>
          <span className={`text-xs hidden sm:block ${i === current ? "text-brand-text" : "text-brand-muted/60"}`}>{step}</span>
          {i < STEPS.length - 1 && <div className="w-4 sm:w-8 h-px bg-[#333333]" />}
        </div>
      ))}
    </div>
  );
}

// ── Personal step ────────────────────────────────────────────────────────────

function PersonalStep({ data, onChange }: { data: ResumeData["personal"]; onChange: (d: ResumeData["personal"]) => void }) {
  const set = (k: keyof ResumeData["personal"]) => (v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-brand-text">Personal Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name"    value={data.name}     onChange={set("name")}     placeholder="Jane Doe" />
        <Field label="Job Title"    value={data.title}    onChange={set("title")}    placeholder="Software Engineer" />
        <Field label="Email"        value={data.email}    onChange={set("email")}    placeholder="jane@example.com" type="email" />
        <Field label="Phone"        value={data.phone}    onChange={set("phone")}    placeholder="+1 555 000 0000" type="tel" />
        <Field label="Location"     value={data.location} onChange={set("location")} placeholder="San Francisco, CA" />
        <Field label="Website / LinkedIn" value={data.website} onChange={set("website")} placeholder="linkedin.com/in/jane" />
      </div>
      <Field label="Summary"   value={data.summary}  onChange={set("summary")}  placeholder="A brief professional summary…" textarea />
    </div>
  );
}

// ── Experience step ───────────────────────────────────────────────────────────

function ExperienceStep({ data, onChange }: { data: Experience[]; onChange: (d: Experience[]) => void }) {
  const add = () => onChange([...data, { id: uid(), company: "", role: "", start: "", end: "", current: false, description: "" }]);
  const remove = (id: string) => onChange(data.filter((e) => e.id !== id));
  const update = (id: string, field: keyof Experience, val: string | boolean) =>
    onChange(data.map((e) => e.id === id ? { ...e, [field]: val } : e));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-brand-text">Work Experience</h2>
        <button onClick={add} className="flex items-center gap-1.5 text-xs text-brand-red hover:text-brand-red/80 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      {data.length === 0 && (
        <p className="text-sm text-brand-muted/60">No experience added yet. Click Add to get started.</p>
      )}
      {data.map((exp, idx) => (
        <div key={exp.id} className="flex flex-col gap-3 bg-brand-surface border border-brand-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-muted/60">Position {idx + 1}</span>
            <button onClick={() => remove(exp.id)} className="text-brand-muted/60 hover:text-red-500 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Company" value={exp.company} onChange={(v) => update(exp.id, "company", v)} placeholder="Acme Corp" />
            <Field label="Role"    value={exp.role}    onChange={(v) => update(exp.id, "role",    v)} placeholder="Senior Engineer" />
            <Field label="Start"   value={exp.start}   onChange={(v) => update(exp.id, "start",   v)} placeholder="Jan 2022" />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-muted uppercase tracking-wider">End</label>
              <input
                type="text"
                value={exp.current ? "Present" : exp.end}
                disabled={exp.current}
                onChange={(e) => update(exp.id, "end", e.target.value)}
                placeholder="Dec 2024"
                className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-red/50 transition-colors disabled:opacity-40"
              />
              <label className="flex items-center gap-2 cursor-pointer text-xs text-brand-muted">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => update(exp.id, "current", e.target.checked)}
                  className="accent-brand-red"
                />
                Currently working here
              </label>
            </div>
          </div>
          <Field label="Description" value={exp.description} onChange={(v) => update(exp.id, "description", v)}
            placeholder="Key achievements and responsibilities…" textarea />
        </div>
      ))}
    </div>
  );
}

// ── Education step ────────────────────────────────────────────────────────────

function EducationStep({ data, onChange }: { data: Education[]; onChange: (d: Education[]) => void }) {
  const add = () => onChange([...data, { id: uid(), school: "", degree: "", field: "", start: "", end: "" }]);
  const remove = (id: string) => onChange(data.filter((e) => e.id !== id));
  const update = (id: string, field: keyof Education, val: string) =>
    onChange(data.map((e) => e.id === id ? { ...e, [field]: val } : e));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-brand-text">Education</h2>
        <button onClick={add} className="flex items-center gap-1.5 text-xs text-brand-red hover:text-brand-red/80 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      {data.length === 0 && (
        <p className="text-sm text-brand-muted/60">No education added yet. Click Add to get started.</p>
      )}
      {data.map((edu, idx) => (
        <div key={edu.id} className="flex flex-col gap-3 bg-brand-surface border border-brand-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-brand-muted/60">Education {idx + 1}</span>
            <button onClick={() => remove(edu.id)} className="text-brand-muted/60 hover:text-red-500 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="School"  value={edu.school}  onChange={(v) => update(edu.id, "school",  v)} placeholder="MIT" />
            <Field label="Degree"  value={edu.degree}  onChange={(v) => update(edu.id, "degree",  v)} placeholder="Bachelor of Science" />
            <Field label="Field"   value={edu.field}   onChange={(v) => update(edu.id, "field",   v)} placeholder="Computer Science" />
            <Field label="Start"   value={edu.start}   onChange={(v) => update(edu.id, "start",   v)} placeholder="Sep 2018" />
            <Field label="End"     value={edu.end}     onChange={(v) => update(edu.id, "end",     v)} placeholder="Jun 2022" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Skills step ───────────────────────────────────────────────────────────────

function SkillsStep({ data, onChange }: { data: string[]; onChange: (d: string[]) => void }) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed || data.includes(trimmed)) return;
    onChange([...data, trimmed]);
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-brand-text">Skills</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a skill and press Enter or comma…"
          className="flex-1 bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-red/50 transition-colors"
        />
        <button
          onClick={add}
          className="px-4 py-2 bg-brand-red text-white text-sm rounded-lg hover:bg-brand-red/90 transition-colors"
        >
          Add
        </button>
      </div>
      {data.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-surface border border-brand-border rounded-full text-sm text-brand-text"
            >
              {skill}
              <button
                onClick={() => onChange(data.filter((s) => s !== skill))}
                className="text-brand-muted/60 hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      {data.length === 0 && (
        <p className="text-sm text-brand-muted/60">No skills added yet.</p>
      )}
    </div>
  );
}

// ── Preview step ─────────────────────────────────────────────────────────────

function PreviewStep({ data }: { data: ResumeData }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-brand-text">Preview & Download</h2>
      <ResumePdf data={data} />
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────

export default function ResumeBuilder() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ResumeData>(EMPTY);
  const [showConfirm, setShowConfirm] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw) as ResumeData);
    } catch {}
  }, []);

  // Auto-save every 2 seconds after last change
  const updateData = useCallback((next: ResumeData) => {
    setData(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
    }, 2000);
  }, []);

  const clearData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(EMPTY);
    setStep(0);
    setShowConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      {/* Step indicator */}
      <StepIndicator current={step} />

      {/* Auto-save badge */}
      <p className="text-xs text-brand-muted/60">Progress is auto-saved to your browser.</p>

      {/* Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && <PersonalStep    data={data.personal}   onChange={(p) => updateData({ ...data, personal: p })}    />}
          {step === 1 && <ExperienceStep  data={data.experience} onChange={(e) => updateData({ ...data, experience: e })}  />}
          {step === 2 && <EducationStep   data={data.education}  onChange={(e) => updateData({ ...data, education: e })}   />}
          {step === 3 && <SkillsStep      data={data.skills}     onChange={(s) => updateData({ ...data, skills: s })}      />}
          {step === 4 && <PreviewStep     data={data}                                                                       />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-brand-border pt-4">
        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-brand-border text-sm text-brand-muted hover:text-brand-text hover:border-brand-text/30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 text-xs text-brand-muted/60 hover:text-red-500 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          {step < STEPS.length - 1 && (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-red text-white text-sm font-medium hover:bg-brand-red/90 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Confirm dialog */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-surface border border-brand-border rounded-2xl p-6 max-w-sm w-full flex flex-col gap-4"
            >
              <h3 className="text-base font-semibold text-brand-text">Clear resume data?</h3>
              <p className="text-sm text-brand-muted">This will permanently delete all your saved resume data. This cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2 rounded-lg border border-brand-border text-sm text-brand-muted hover:text-brand-text transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={clearData}
                  className="flex-1 py-2 rounded-lg bg-red-600 text-brand-text text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Clear all
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
