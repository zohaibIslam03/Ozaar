"use client";

import { motion } from "framer-motion";
import { slideLeft, slideRight, stagger, fadeUp } from "@/lib/animations";

const FEATURES = [
  {
    title: "Nothing leaves your device",
    desc: "Every tool processes files using browser APIs — WebAssembly, Canvas, Web Workers. Your files never touch our servers.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="10" width="16" height="10" rx="2.5" stroke="#DF0A09" strokeWidth="1.5"/>
        <path d="M7 10V7a4 4 0 018 0v3" stroke="#DF0A09" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="11" cy="15" r="1.5" fill="#DF0A09"/>
      </svg>
    ),
  },
  {
    title: "No tracking, no analytics",
    desc: "We don't track which tools you use, what files you upload, or how you interact with the site. Zero telemetry.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8" stroke="#DF0A09" strokeWidth="1.5"/>
        <path d="M4 4 L18 18" stroke="#DF0A09" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="11" cy="11" r="3" stroke="#DF0A09" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    title: "No account required",
    desc: "Open a tool, use it, close it. No signup forms, no email verification, no password to forget.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="8" r="3.5" stroke="#DF0A09" strokeWidth="1.5"/>
        <path d="M4 19c0-3.866 3.134-7 7-7h0c3.866 0 7 3.134 7 7" stroke="#DF0A09" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15 5 L17 7 L20 3" stroke="#DF0A09" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Open source",
    desc: "Every line of code is public on GitHub. Audit it, fork it, or contribute — complete transparency by design.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2C6.03 2 2 6.03 2 11c0 3.98 2.58 7.36 6.16 8.55.45.08.61-.19.61-.43 0-.21-.01-.77-.01-1.51-2.5.46-3.03-.61-3.22-1.17-.11-.28-.58-1.13-.99-1.36-.34-.18-.82-.62-.01-.63.76-.01 1.3.7 1.48.99.87 1.46 2.26 1.05 2.81.8.09-.62.34-1.05.62-1.29-2.15-.24-4.4-1.07-4.4-4.76 0-1.05.37-1.91.99-2.58-.1-.24-.43-1.22.1-2.55 0 0 .8-.26 2.63.99.77-.21 1.59-.32 2.41-.32.82 0 1.64.11 2.41.32 1.83-1.26 2.63-.99 2.63-.99.53 1.33.2 2.31.1 2.55.62.67.99 1.52.99 2.58 0 3.7-2.26 4.52-4.41 4.76.35.3.65.89.65 1.79 0 1.29-.01 2.33-.01 2.65 0 .24.16.52.61.43C17.42 18.36 20 14.98 20 11c0-4.97-4.03-9-9-9z" fill="#DF0A09" opacity="0.8"/>
      </svg>
    ),
  },
];

// ── Browser flow diagram ──────────────────────────────────────────────────────

function FlowDiagram() {
  const steps = [
    { label: "Your File", sublabel: "Stays local", color: "#E8E8E8", textColor: "#111" },
    { label: "Browser", sublabel: "Processes it", color: "#111", textColor: "#fff" },
    { label: "Result", sublabel: "Instant output", color: "#DF0A09", textColor: "#fff" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-0 relative">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center flex-1">
            <div
              className="flex-1 flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl border text-center"
              style={{
                background: step.color,
                borderColor: step.color === "#E8E8E8" ? "#E8E8E8" : step.color,
              }}
            >
              <p className="text-sm font-bold" style={{ color: step.textColor }}>{step.label}</p>
              <p className="text-[11px]" style={{ color: step.textColor, opacity: 0.7 }}>{step.sublabel}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="flex items-center px-1.5 shrink-0">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M12 6l4 4-4 4" stroke="#DF0A09" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No-upload badge */}
      <div className="flex items-center gap-3 bg-brand-surface border border-brand-border rounded-xl p-4">
        <div className="w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2v8M6 7l3-5 3 5" stroke="#DF0A09" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 12v2a2 2 0 002 2h6a2 2 0 002-2v-2" stroke="#DF0A09" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="3" y1="15" x2="15" y2="3" stroke="#DF0A09" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-brand-text">Zero server uploads</p>
          <p className="text-xs text-brand-muted">Your files never leave your machine. Ever.</p>
        </div>
      </div>

      {/* Tech badges */}
      <div className="flex flex-wrap gap-2">
        {["WebAssembly", "Canvas API", "File API", "Web Workers", "IndexedDB"].map((tech) => (
          <span
            key={tech}
            className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-[#F7F7F7] text-brand-muted border border-brand-border"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── PrivacySection ────────────────────────────────────────────────────────────

export default function PrivacySection() {
  return (
    <section className="bg-[#FAFAFA] border-y border-brand-border py-[100px] md:py-[140px]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — features list */}
          <motion.div
            className="flex flex-col gap-8"
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-brand-red uppercase tracking-[0.1em]">Privacy first</p>
              <h2
                className="font-heading text-brand-text"
                style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                Your data stays yours — always
              </h2>
              <p className="text-base text-brand-muted leading-relaxed">
                We built every tool to run entirely in the browser. No backend, no database, no tracking. Just code that runs where you are.
              </p>
            </div>

            <motion.div
              className="flex flex-col gap-5"
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {FEATURES.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  className="flex gap-4"
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-red/10 flex items-center justify-center shrink-0 mt-0.5">
                    {feature.icon}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-brand-text mb-1">{feature.title}</p>
                    <p className="text-[13px] text-brand-muted leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — flow diagram */}
          <motion.div
            className="flex flex-col gap-6"
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="bg-white rounded-3xl border border-brand-border p-5 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              <h3 className="text-base font-bold text-brand-text mb-6">How your data flows</h3>
              <FlowDiagram />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
