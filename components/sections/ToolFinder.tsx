"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Q1 = "images" | "documents" | "build" | "calculate";

interface Result {
  slug: string;
  name: string;
  desc: string;
}

// ── Option data ────────────────────────────────────────────────────────────

interface Q1Option {
  value: Q1;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

interface Q2Option {
  label: string;
  desc: string;
  value: string;
  icon: React.ReactNode;
}

function ImgOpt() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="16" height="12" rx="2"/>
      <circle cx="7" cy="9" r="1.5"/>
      <path d="M2 14l4.5-4.5 3 3 2.5-2 6 5" strokeLinecap="round"/>
    </svg>
  );
}
function DocOpt() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V8z" strokeLinecap="round"/>
      <polyline points="12 2 12 8 18 8"/>
      <line x1="6" y1="12" x2="14" y2="12" strokeLinecap="round"/>
      <line x1="6" y1="15" x2="10" y2="15" strokeLinecap="round"/>
    </svg>
  );
}
function BuildOpt() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 20h9" strokeLinecap="round"/>
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function CalcOpt() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="14" height="16" rx="2"/>
      <line x1="6" y1="7" x2="14" y2="7" strokeLinecap="round"/>
      <line x1="6" y1="11" x2="9" y2="11" strokeLinecap="round"/>
      <line x1="11" y1="11" x2="14" y2="11" strokeLinecap="round"/>
      <line x1="6" y1="14" x2="9" y2="14" strokeLinecap="round"/>
      <line x1="11" y1="14" x2="14" y2="14" strokeLinecap="round"/>
    </svg>
  );
}
function CompressOpt() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="16" height="12" rx="2"/>
      <path d="M8 8l-3 3 3 3M12 8l3 3-3 3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function BgOpt() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0z"/>
      <path d="M10 6v8M6 10h8" strokeLinecap="round"/>
    </svg>
  );
}
function ResizeOpt() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 3h4v4M9 11l10-8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 17H1v-4M11 9l-10 8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function MergeOpt() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="7" height="9" rx="1"/>
      <rect x="11" y="3" width="7" height="9" rx="1"/>
      <path d="M5.5 12v3h9v-3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function QrOpt() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="6" height="6" rx="1"/>
      <rect x="3" y="3" width="4" height="4" rx="0.5" stroke="none" fill="currentColor"/>
      <rect x="12" y="2" width="6" height="6" rx="1"/>
      <rect x="13" y="3" width="4" height="4" rx="0.5" stroke="none" fill="currentColor"/>
      <rect x="2" y="12" width="6" height="6" rx="1"/>
      <rect x="3" y="13" width="4" height="4" rx="0.5" stroke="none" fill="currentColor"/>
      <rect x="12" y="12" width="3" height="3" rx="0.5"/>
      <rect x="17" y="12" width="1" height="1" rx="0.2" stroke="none" fill="currentColor"/>
      <rect x="12" y="17" width="1" height="1" rx="0.2" stroke="none" fill="currentColor"/>
      <rect x="15" y="15" width="3" height="3" rx="0.5"/>
    </svg>
  );
}
function PaletteOpt() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 2a8 8 0 100 16c.92 0 1.64-.7 1.64-1.58 0-.4-.16-.76-.4-1.03-.26-.26-.4-.6-.4-1.03A1.5 1.5 0 0112.37 13H14c2.76 0 5-2.24 5-5 0-3.31-3.58-6-8-6z"/>
      <circle cx="7" cy="8" r="1" fill="currentColor" stroke="none"/>
      <circle cx="10" cy="6" r="1" fill="currentColor" stroke="none"/>
      <circle cx="13" cy="8" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function LockOpt() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="9" width="12" height="9" rx="2"/>
      <path d="M7 9V6.5a3 3 0 016 0V9" strokeLinecap="round"/>
      <circle cx="10" cy="13.5" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function TextOpt() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="4 6 4 4 16 4 16 6" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="10" y1="4" x2="10" y2="16" strokeLinecap="round"/>
      <line x1="7" y1="16" x2="13" y2="16" strokeLinecap="round"/>
    </svg>
  );
}
function CurrencyOpt() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="10" r="8"/>
      <path d="M10 6v8M8 8h3a1.5 1.5 0 010 3H9a1.5 1.5 0 010 3h4" strokeLinecap="round"/>
    </svg>
  );
}
function RulerOpt() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 17L17 3M6 17l1-1M9 14l1-1M12 11l1-1M15 8l1-1M3 14l1-1M6 11l1-1M9 8l1-1M12 5l1-1" strokeLinecap="round"/>
    </svg>
  );
}
function AgeOpt() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="16" height="14" rx="2"/>
      <line x1="14" y1="2" x2="14" y2="6" strokeLinecap="round"/>
      <line x1="6" y1="2" x2="6" y2="6" strokeLinecap="round"/>
      <line x1="2" y1="9" x2="18" y2="9" strokeLinecap="round"/>
    </svg>
  );
}
function ResumeOpt() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2z"/>
      <circle cx="10" cy="8" r="2"/>
      <path d="M6 16c0-2.21 1.79-4 4-4s4 1.79 4 4" strokeLinecap="round"/>
    </svg>
  );
}

const Q1_OPTIONS: Q1Option[] = [
  {
    value: "images",
    label: "Work with images",
    desc: "Compress, resize, remove backgrounds & more",
    icon: <ImgOpt />,
  },
  {
    value: "documents",
    label: "Handle documents",
    desc: "Merge, split, and compress PDF files",
    icon: <DocOpt />,
  },
  {
    value: "build",
    label: "Build or create",
    desc: "Generate QR codes, color palettes & passwords",
    icon: <BuildOpt />,
  },
  {
    value: "calculate",
    label: "Calculate something",
    desc: "Currency, units, age, word count & more",
    icon: <CalcOpt />,
  },
];

const Q2_OPTIONS: Record<Q1, Q2Option[]> = {
  images: [
    { label: "Make files smaller", desc: "Compress without quality loss", value: "compress", icon: <CompressOpt /> },
    { label: "Remove the background", desc: "AI-powered, browser-only", value: "bg", icon: <BgOpt /> },
    { label: "Resize for social media", desc: "Preset dimensions for any platform", value: "resize", icon: <ResizeOpt /> },
    { label: "Convert to another format", desc: "PNG, JPG, WebP", value: "compress", icon: <ImgOpt /> },
  ],
  documents: [
    { label: "Merge multiple PDFs", desc: "Combine into one file", value: "pdf", icon: <MergeOpt /> },
    { label: "Split a large PDF", desc: "Extract specific pages", value: "pdf", icon: <DocOpt /> },
    { label: "Compress PDF size", desc: "Reduce file size", value: "pdf", icon: <CompressOpt /> },
  ],
  build: [
    { label: "Generate a QR code", desc: "From any URL or text", value: "qr", icon: <QrOpt /> },
    { label: "Create a color palette", desc: "HEX, CSS, harmonies", value: "color", icon: <PaletteOpt /> },
    { label: "Generate a password", desc: "Cryptographically secure", value: "password", icon: <LockOpt /> },
    { label: "Write content", desc: "Count words & reading time", value: "words", icon: <TextOpt /> },
  ],
  calculate: [
    { label: "Convert currencies", desc: "150+ currencies, live rates", value: "currency", icon: <CurrencyOpt /> },
    { label: "Convert units", desc: "Length, weight, temp, speed", value: "unit", icon: <RulerOpt /> },
    { label: "Calculate my age", desc: "Exact days, hours, minutes", value: "age", icon: <AgeOpt /> },
    { label: "Count words", desc: "Characters, sentences, time", value: "words", icon: <TextOpt /> },
  ],
};

const RESULTS: Record<string, Result> = {
  compress: { slug: "image-compressor", name: "Image Compressor", desc: "Compress PNG/JPG to WebP — up to 90% smaller, fully in-browser." },
  bg: { slug: "bg-remover", name: "Background Remover", desc: "AI-powered background removal. No upload, no account." },
  resize: { slug: "image-resizer", name: "Image Resizer", desc: "Resize to exact px or social media presets instantly." },
  qr: { slug: "qr-generator", name: "QR Code Generator", desc: "Instant QR from any URL, text, or contact." },
  pdf: { slug: "pdf-toolkit", name: "PDF Toolkit", desc: "Merge, split & compress PDFs in your browser." },
  words: { slug: "word-counter", name: "Word Counter", desc: "Count words, characters, sentences & reading time." },
  resume: { slug: "resume-builder", name: "Resume Builder", desc: "ATS-friendly templates, PDF export, no account." },
  color: { slug: "color-palette", name: "Color Palette Generator", desc: "Generate, explore & export HEX/CSS palettes." },
  password: { slug: "password-generator", name: "Password Generator", desc: "Cryptographically secure custom passwords." },
  currency: { slug: "currency-converter", name: "Currency Converter", desc: "Live rates, 150+ currencies." },
  unit: { slug: "unit-converter", name: "Unit Converter", desc: "Length, weight, temp, speed — all in one." },
  age: { slug: "age-calculator", name: "Age Calculator", desc: "Calculate age, date differences & countdowns." },
};

// Tool grid data for right panel
const TOOL_GRID = [
  { slug: "pdf-toolkit", icon: <DocOpt /> },
  { slug: "image-compressor", icon: <ImgOpt /> },
  { slug: "qr-generator", icon: <QrOpt /> },
  { slug: "password-generator", icon: <LockOpt /> },
  { slug: "color-palette", icon: <PaletteOpt /> },
  { slug: "word-counter", icon: <TextOpt /> },
  { slug: "image-resizer", icon: <ResizeOpt /> },
  { slug: "bg-remover", icon: <BgOpt /> },
  { slug: "resume-builder", icon: <ResumeOpt /> },
  { slug: "age-calculator", icon: <AgeOpt /> },
  { slug: "currency-converter", icon: <CurrencyOpt /> },
  { slug: "unit-converter", icon: <RulerOpt /> },
];

// ── Progress steps ─────────────────────────────────────────────────────────

function ProgressSteps({ step }: { step: 0 | 1 | 2 }) {
  const steps = ["WHAT?", "GOAL?", "RESULT"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {steps.map((label, i) => (
        <div key={label} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 24, height: 24, borderRadius: "50%",
                background: step >= i ? "#DF0A09" : "#E8E8E8",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700,
                color: step >= i ? "#fff" : "#aaa",
                flexShrink: 0,
              }}
            >
              {step > i ? "✓" : i + 1}
            </div>
            <span
              style={{
                fontSize: 11, fontWeight: 700,
                color: step === i ? "#DF0A09" : step > i ? "#111" : "#CCC",
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}
            >
              {label}
            </span>
          </div>
          {i < 2 && (
            <div style={{ flex: 1, height: 2, background: "#E8E8E8", margin: "0 12px", overflow: "hidden", borderRadius: 1 }}>
              <motion.div
                style={{ height: "100%", background: "#DF0A09", transformOrigin: "left" }}
                animate={{ scaleX: step > i ? 1 : 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Option card ────────────────────────────────────────────────────────────

function OptionCard({
  label, desc, icon, selected, onClick,
}: {
  label: string; desc: string; icon: React.ReactNode;
  selected: boolean; onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={!selected ? {
        borderColor: "#DF0A09",
        y: -3,
        boxShadow: "0 12px 40px rgba(223,10,9,0.1)",
      } : {}}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "relative",
        background: "#fff",
        border: `2px solid ${selected ? "#DF0A09" : "#EBEBEB"}`,
        borderRadius: 16, padding: "22px 24px",
        cursor: "pointer", textAlign: "left",
        boxShadow: selected ? "0 12px 40px rgba(223,10,9,0.1)" : "none",
      }}
    >
      {/* Selected checkmark badge */}
      {selected && (
        <div
          style={{
            position: "absolute", top: -10, left: -10,
            width: 22, height: 22, background: "#DF0A09",
            borderRadius: "50%", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      )}

      {/* Icon box */}
      <div
        style={{
          width: 44, height: 44, borderRadius: 10,
          background: selected ? "#DF0A09" : "#F5F5F5",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: selected ? "#fff" : "#666",
        }}
      >
        {icon}
      </div>

      <p style={{ fontSize: 16, fontWeight: 800, color: "#111", marginTop: 12 }}>{label}</p>
      <p style={{ fontSize: 13, color: "#888", lineHeight: 1.5, marginTop: 4 }}>{desc}</p>
    </motion.button>
  );
}

// ── Right panel ────────────────────────────────────────────────────────────

function RightPanel() {
  const [activeIdx, setActiveIdx] = useState(1); // image-compressor pre-highlighted

  useEffect(() => {
    const t = setInterval(() => {
      setActiveIdx((v) => (v + 1) % TOOL_GRID.length);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        background: "#fff", border: "1.5px solid #EBEBEB",
        borderRadius: 24, padding: "clamp(24px, 4vw, 36px)", height: "100%",
        display: "flex", flexDirection: "column", gap: 28,
      }}
    >
      <div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#111", lineHeight: 1.2 }}>
          Find the right tool in 2 clicks.
        </h3>
        <p style={{ fontSize: 14, color: "#888", marginTop: 8, lineHeight: 1.6 }}>
          Answer 2 quick questions — we&apos;ll point you straight to the tool you need. No browsing required.
        </p>
      </div>

      {/* Tool icon grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(54px, 1fr))", gap: 10 }}>
        {TOOL_GRID.map((tool, i) => (
          <motion.div
            key={tool.slug}
            animate={
              i === activeIdx
                ? { scale: 1.1 }
                : { scale: 1 }
            }
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "100%", maxWidth: 60, aspectRatio: "1 / 1", borderRadius: 12,
              background: i === activeIdx ? "#DF0A09" : "#F5F5F5",
              border: `1.5px solid ${i === activeIdx ? "#DF0A09" : "#EBEBEB"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: i === activeIdx ? "#fff" : "#888",
            }}
          >
            {tool.icon}
          </motion.div>
        ))}
      </div>

      {/* Trust chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { label: "No signup needed", icon: (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
              <polyline points="2 7 5.5 10.5 12 4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )},
          { label: "100% browser-based", icon: (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M12 7H2M2 7l3-3M2 7l3 3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )},
          { label: "Free forever", icon: (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M2 7c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2s-.9 2-2 2H4c-1.1 0-2-.9-2-2z"/>
            </svg>
          )},
        ].map(({ label, icon }) => (
          <div
            key={label}
            style={{
              background: "#F5F5F5", borderRadius: 8,
              padding: "8px 14px", fontSize: 12, fontWeight: 600,
              color: "#555", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {icon}
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

const QUESTIONS = ["What are you trying to do?", "What's your goal?", "Perfect. Here's your tool."];

export default function ToolFinder() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [q1, setQ1] = useState<Q1 | null>(null);
  const [selectedQ2, setSelectedQ2] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const reset = () => { setStep(0); setQ1(null); setSelectedQ2(null); setResult(null); };

  const selectQ1 = (v: Q1) => { setQ1(v); setStep(1); };
  const selectQ2 = (v: string) => {
    setSelectedQ2(v);
    setResult(RESULTS[v] ?? null);
    setStep(2);
  };

  const q2Options = q1 ? Q2_OPTIONS[q1] : [];

  return (
    <section style={{ background: "#F7F7F7", padding: "clamp(72px, 10vw, 120px) 0" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "clamp(32px, 6vw, 80px)",
            alignItems: "center",
          }}
        >
          {/* ── LEFT: Quiz ── */}
          <div>
            {/* Progress */}
            <ProgressSteps step={step} />

            {/* Question heading */}
            <h2
              style={{
                fontFamily: "var(--font-jakarta)",
                fontSize: "clamp(22px, 2.5vw, 28px)",
                fontWeight: 900, color: "#111",
                letterSpacing: "-0.02em", lineHeight: 1.1,
                marginTop: 32, marginBottom: 24,
              }}
            >
              {QUESTIONS[step]}
            </h2>

            {/* Options */}
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="q1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: 12 }}
                >
                  {Q1_OPTIONS.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      label={opt.label}
                      desc={opt.desc}
                      icon={opt.icon}
                      selected={false}
                      onClick={() => selectQ1(opt.value)}
                    />
                  ))}
                </motion.div>
              )}

              {step === 1 && q1 && (
                <motion.div
                  key="q2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: 12 }}
                >
                  {q2Options.map((opt) => (
                    <OptionCard
                      key={opt.value + opt.label}
                      label={opt.label}
                      desc={opt.desc}
                      icon={opt.icon}
                      selected={false}
                      onClick={() => selectQ2(opt.value)}
                    />
                  ))}
                </motion.div>
              )}

              {step === 2 && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-4"
                >
                  {/* Result card */}
                  <div
                    style={{
                      background: "#fff", border: "2px solid #DF0A09",
                      borderRadius: 20, padding: "clamp(20px, 5vw, 28px)",
                      display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        width: 64, height: 64, borderRadius: 14,
                        background: "#DF0A09", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff",
                      }}
                    >
                      {TOOL_GRID.find((t) => t.slug === result.slug)?.icon}
                    </div>
                    <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                      <p style={{ fontSize: 11, color: "#DF0A09", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Recommended for you
                      </p>
                      <p style={{ fontSize: 22, fontWeight: 900, color: "#111", marginTop: 4 }}>{result.name}</p>
                      <p style={{ fontSize: 14, color: "#666", marginTop: 4 }}>{result.desc}</p>
                    </div>
                    <Link
                      href={`/tools/${result.slug}`}
                      style={{
                        background: "#DF0A09", color: "#fff",
                        padding: "12px 24px", borderRadius: 10,
                        fontSize: 14, fontWeight: 700,
                        whiteSpace: "nowrap", textDecoration: "none",
                        flexShrink: 0,
                      }}
                    >
                      Open tool →
                    </Link>
                  </div>

                  {/* Start over */}
                  <button
                    onClick={reset}
                    style={{
                      background: "none", border: "none",
                      fontSize: 13, color: "#888", cursor: "pointer",
                      textDecoration: "underline", textUnderlineOffset: 3,
                      alignSelf: "flex-start",
                    }}
                  >
                    Start over
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Back button for step 1 */}
            {step === 1 && (
              <button
                onClick={() => setStep(0)}
                style={{
                  background: "none", border: "none",
                  fontSize: 13, color: "#888", cursor: "pointer",
                  marginTop: 16, textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                ← Back
              </button>
            )}
          </div>

          {/* ── RIGHT: Static visual panel ── */}
          <div className="hidden md:block" style={{ alignSelf: "stretch" }}>
            <RightPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
