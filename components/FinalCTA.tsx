"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

// ── Tool icon SVGs ─────────────────────────────────────────────────────────

function ToolSVG({ slug }: { slug: string }) {
  const s = { width: 18, height: 18, viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.5 } as const;
  switch (slug) {
    case "pdf-toolkit":
      return <svg {...s}><path d="M12 2H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V8z" strokeLinecap="round"/><polyline points="12 2 12 8 18 8"/></svg>;
    case "image-compressor":
      return <svg {...s}><rect x="2" y="4" width="16" height="12" rx="2"/><circle cx="7" cy="9" r="1.5"/><path d="M2 14l4-4 3 3 2.5-2 6.5 4" strokeLinecap="round"/></svg>;
    case "qr-generator":
      return <svg {...s}><rect x="2" y="2" width="7" height="7" rx="1"/><rect x="4" y="4" width="3" height="3" fill="currentColor" stroke="none"/><rect x="11" y="2" width="7" height="7" rx="1"/><rect x="13" y="4" width="3" height="3" fill="currentColor" stroke="none"/><rect x="2" y="11" width="7" height="7" rx="1"/><rect x="4" y="13" width="3" height="3" fill="currentColor" stroke="none"/><rect x="11" y="11" width="3" height="3" fill="currentColor" stroke="none"/><rect x="16" y="11" width="2" height="2" fill="currentColor" stroke="none"/><rect x="11" y="16" width="2" height="2" fill="currentColor" stroke="none"/><rect x="15" y="15" width="3" height="3" fill="currentColor" stroke="none"/></svg>;
    case "password-generator":
      return <svg {...s}><rect x="4" y="9" width="12" height="9" rx="2"/><path d="M7 9V6.5a3 3 0 016 0V9" strokeLinecap="round"/><circle cx="10" cy="13.5" r="1.5" fill="currentColor" stroke="none"/></svg>;
    case "color-palette":
      return <svg {...s}><path d="M10 2a8 8 0 100 16c.9 0 1.6-.7 1.6-1.6 0-.4-.1-.7-.4-1-.2-.3-.4-.6-.4-1A1.5 1.5 0 0112.4 13H14c2.8 0 5-2.2 5-5 0-3.3-3.6-6-8-6z"/><circle cx="7" cy="8" r="1" fill="currentColor" stroke="none"/><circle cx="10" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="13" cy="8" r="1" fill="currentColor" stroke="none"/></svg>;
    case "word-counter":
      return <svg {...s}><polyline points="4 6 4 4 16 4 16 6" strokeLinecap="round"/><line x1="10" y1="4" x2="10" y2="16" strokeLinecap="round"/><line x1="7" y1="16" x2="13" y2="16" strokeLinecap="round"/></svg>;
    case "image-resizer":
      return <svg {...s}><path d="M15 3h4v4M9 11l10-8M5 17H1v-4M11 9l-10 8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "bg-remover":
      return <svg {...s}><circle cx="10" cy="10" r="8"/><path d="M10 6v8M6 10h8" strokeLinecap="round"/></svg>;
    case "resume-builder":
      return <svg {...s}><path d="M14 2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2z"/><circle cx="10" cy="8" r="2"/><path d="M6 16c0-2.2 1.8-4 4-4s4 1.8 4 4" strokeLinecap="round"/></svg>;
    case "age-calculator":
      return <svg {...s}><rect x="2" y="4" width="16" height="14" rx="2"/><line x1="14" y1="2" x2="14" y2="6" strokeLinecap="round"/><line x1="6" y1="2" x2="6" y2="6" strokeLinecap="round"/><line x1="2" y1="9" x2="18" y2="9" strokeLinecap="round"/></svg>;
    case "currency-converter":
      return <svg {...s}><circle cx="10" cy="10" r="8"/><path d="M10 6v8M8 8h3a1.5 1.5 0 010 3H9a1.5 1.5 0 010 3h4" strokeLinecap="round"/></svg>;
    case "unit-converter":
      return <svg {...s}><line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round"/><polyline points="12 5 19 12 12 19" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    default:
      return <svg {...s}><rect x="3" y="3" width="14" height="14" rx="2"/></svg>;
  }
}

const ALL_TOOLS = [
  { slug: "pdf-toolkit", name: "PDF Toolkit", popular: false },
  { slug: "image-compressor", name: "Image Compressor", popular: true },
  { slug: "qr-generator", name: "QR Generator", popular: false },
  { slug: "password-generator", name: "Password Gen.", popular: false },
  { slug: "color-palette", name: "Color Palette", popular: false },
  { slug: "word-counter", name: "Word Counter", popular: false },
  { slug: "image-resizer", name: "Image Resizer", popular: false },
  { slug: "bg-remover", name: "BG Remover", popular: false },
  { slug: "resume-builder", name: "Resume Builder", popular: false },
  { slug: "age-calculator", name: "Age Calculator", popular: false },
  { slug: "currency-converter", name: "Currency Conv.", popular: false },
  { slug: "unit-converter", name: "Unit Converter", popular: false },
];

const STATS = [
  { num: "12", suffix: "+", label: "Free Tools" },
  { num: "0", suffix: "", label: "Signups Required" },
  { num: "100", suffix: "%", label: "Browser-Based" },
];

function MiniCard({ tool, delay }: { tool: typeof ALL_TOOLS[0]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/tools/${tool.slug}`} style={{ textDecoration: "none", display: "block" }}>
        {tool.popular && (
          <div style={{ textAlign: "center", marginBottom: 4 }}>
            <span style={{
              background: "#DF0A09", color: "#fff", fontSize: 8,
              fontWeight: 800, padding: "2px 6px", borderRadius: 4,
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}>POPULAR</span>
          </div>
        )}
        <motion.div
          whileHover={{ backgroundColor: "#1A1A1A", borderColor: "#DF0A09", scale: 1.04 }}
          transition={{ duration: 0.2 }}
          style={{
            background: tool.popular ? "#1A1A1A" : "#161616",
            border: `1px solid ${tool.popular ? "#DF0A09" : "#1E1E1E"}`,
            borderRadius: 14, padding: "16px 12px", textAlign: "center", cursor: "pointer",
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: tool.popular ? "#DF0A09" : "#222",
            color: tool.popular ? "#fff" : "#444",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 8px",
          }}>
            <ToolSVG slug={tool.slug} />
          </div>
          <p style={{ fontSize: 10, fontWeight: 600, color: tool.popular ? "#fff" : "#333", lineHeight: 1.3 }}>
            {tool.name}
          </p>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{ background: "#111111", minHeight: 560 }} className="grid grid-cols-1 md:grid-cols-2">
      {/* ── LEFT ── */}
      <div
        ref={ref}
        style={{
          background: "#111111",
          padding: "clamp(56px, 8vw, 100px) clamp(20px, 6vw, 80px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: 520 }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: 24 }}
          >
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#1A1A1A", border: "1px solid #2A2A2A",
              borderRadius: 999, padding: "6px 14px",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#DF0A09", flexShrink: 0, animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.06em" }}>Free forever</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.08 }}
            style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(34px,10vw,60px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.04 }}
          >
            <span style={{ color: "#fff" }}>Start using a tool</span>
            <br />
            <span style={{ color: "#DF0A09" }}>right now.</span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.16 }}
            style={{ color: "#666", fontSize: 16, lineHeight: 1.65, marginTop: 16, maxWidth: 400 }}
          >
            Open a tool, do your work, close the tab. No signup. No download. No friction.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.24 }}
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 24, marginTop: 40 }}
          >
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                paddingRight: i < STATS.length - 1 ? 24 : 0,
                borderRight: i < STATS.length - 1 ? "1px solid #2A2A2A" : "none",
              }}>
                <p style={{ fontFamily: "var(--font-jakarta)", fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {s.num}<span style={{ color: "#DF0A09" }}>{s.suffix}</span>
                </p>
                <p style={{ fontSize: 12, color: "#444", marginTop: 4 }}>{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.32 }}
            style={{ marginTop: 40 }}
          >
            <motion.div whileHover={{ y: -3, boxShadow: "0 20px 50px rgba(223,10,9,0.4)" }} whileTap={{ scale: 0.96 }} style={{ display: "inline-block" }}>
              <Link href="/#tools" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                justifyContent: "center",
                background: "#DF0A09", color: "#fff",
                padding: "18px 40px", borderRadius: 12,
                fontSize: 16, fontWeight: 800, textDecoration: "none",
                maxWidth: "100%",
              }}>
                Explore all 12 tools
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </motion.div>
            <p style={{ fontSize: 12, color: "#333", marginTop: 14 }}>No account needed · No credit card · No ads</p>
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div
        style={{
          background: "#0A0A0A",
          padding: "clamp(40px, 7vw, 60px) clamp(16px, 6vw, 80px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(92px, 1fr))", gap: 12, width: "100%", maxWidth: 420 }}>
          {ALL_TOOLS.map((tool, i) => (
            <MiniCard key={tool.slug} tool={tool} delay={i * 0.04} />
          ))}
        </div>
      </div>
    </section>
  );
}
