"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// ── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "12", label: "Free tools" },
  { value: "0", label: "Signups required" },
  { value: "100%", label: "Browser-based" },
];

const MISSIONS = [
  {
    mark: "No paywalls.",
    body: "Every tool is completely free, forever. No trial. No Pro tier. No credit card.",
  },
  {
    mark: "No tracking.",
    body: "No analytics, no cookies, no data collection. Your files never leave your device.",
  },
  {
    mark: "No accounts.",
    body: "Open the tool, use it, close the tab. Nothing to sign up for, ever.",
  },
];

const VALUES = [
  {
    title: "Privacy by design",
    body: "Everything runs in your browser. Your files and data never touch a server.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DF0A09" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    title: "Open source",
    body: "MIT-licensed. Read the code, audit it, fork it, or contribute a new tool.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DF0A09" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
  },
  {
    title: "Zero friction",
    body: "No account, no onboarding, no tutorial. If it takes more than 3 seconds, we redesign it.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DF0A09" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    title: "Permanent free tier",
    body: "We rely on sponsorships and open-source contributions, not paywalls.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DF0A09" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
  },
];

const TERMINAL_LINES = [
  { prompt: "$", text: "git clone https://github.com/zohaibIslam03/Ozaar.git", delay: 0 },
  { prompt: "$", text: "cd Ozaar && npm install", delay: 0.4 },
  { prompt: "$", text: "npm run dev", delay: 0.8 },
  { prompt: "▶", text: "Ready on http://localhost:3000", delay: 1.2, green: true },
];

// ── Terminal component ────────────────────────────────────────────────────────

function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (!inView) return;
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => setVisible(i + 1), line.delay * 1000 + 200);
    });
  }, [inView]);

  return (
    <div
      ref={ref}
      className="rounded-2xl overflow-hidden font-mono text-[13px] leading-relaxed"
      style={{ background: "#0D1117", border: "1px solid #30363D" }}
    >
      {/* Chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#30363D]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-2 text-[11px] text-[#8B949E]">zsh to bash</span>
      </div>
      {/* Lines */}
      <div className="p-5 flex flex-col gap-3">
        {TERMINAL_LINES.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={visible > i ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-start gap-2"
          >
            <span style={{ color: line.green ? "#3FB950" : "#DF0A09" }}>{line.prompt}</span>
            <span style={{ color: line.green ? "#3FB950" : "#E6EDF3" }}>{line.text}</span>
          </motion.div>
        ))}
        {visible >= TERMINAL_LINES.length && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="inline-block w-2 h-4 ml-0.5"
            style={{ background: "#E6EDF3", verticalAlign: "middle" }}
          />
        )}
      </div>
    </div>
  );
}

// ── About page ────────────────────────────────────────────────────────────────

export default function AboutContent() {
  const missionRef = useRef<HTMLDivElement>(null);
  const missionInView = useInView(missionRef, { once: true, margin: "-80px" });

  return (
    <div className="bg-white">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section style={{ background: "#111111", paddingTop: "clamp(96px, 14vw, 120px)", paddingBottom: "0" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[720px]"
          >
            <span
              className="inline-block text-[11px] font-bold uppercase tracking-widest mb-6"
              style={{ color: "#DF0A09" }}
            >
              About us
            </span>
            <h1
              style={{
                fontFamily: "var(--font-jakarta)",
                fontSize: "clamp(36px, 5.5vw, 68px)",
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              We build tools the internet deserves.
            </h1>
            <p
              className="mt-6"
              style={{ fontSize: "clamp(16px, 4vw, 18px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, maxWidth: "560px" }}
            >
              Free. Open source. Built for humans, not enterprise software buyers.
            </p>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 items-stretch gap-5 sm:gap-0"
            style={{ background: "#161616", borderRadius: "16px 16px 0 0", padding: "clamp(24px, 5vw, 32px) clamp(20px, 6vw, 40px)" }}
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="flex-1 flex flex-col gap-1"
                style={{
                  borderRight: i < STATS.length - 1 ? "1px solid #2A2A2A" : "none",
                  paddingRight: i < STATS.length - 1 ? "clamp(0px, 4vw, 40px)" : "0",
                  paddingLeft: i > 0 ? "clamp(0px, 4vw, 40px)" : "0",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jakarta)",
                    fontSize: "clamp(28px, 3vw, 40px)",
                    fontWeight: 900,
                    color: "#FFFFFF",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </span>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Mission statements ─────────────────────────────────────────────── */}
      <section style={{ background: "#F7F7F7", padding: "clamp(64px, 10vw, 100px) 0" }}>
        <div className="container">
          <div ref={missionRef} className="flex flex-col gap-12 md:gap-20 max-w-[800px] mx-auto">
            {MISSIONS.map((m, i) => (
              <motion.div
                key={m.mark}
                initial={{ opacity: 0, y: 40 }}
                animate={missionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={`flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
              >
                <div
                  style={{
                    fontFamily: "var(--font-jakarta)",
                    fontSize: "clamp(32px, 4vw, 56px)",
                    fontWeight: 900,
                    color: "#111",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: "#DF0A09" }}>×</span>{" "}
                  {m.mark}
                </div>
                <p style={{ fontSize: "16px", color: "#666", lineHeight: 1.7 }}>{m.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values grid ───────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "clamp(64px, 10vw, 100px) 0" }}>
        <div className="container">
          <div className="text-center mb-14">
            <span
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: "#DF0A09" }}
            >
              Our principles
            </span>
            <h2
              style={{
                fontFamily: "var(--font-jakarta)",
                fontSize: "clamp(28px, 3.5vw, 40px)",
                fontWeight: 900,
                color: "#111",
                letterSpacing: "-0.03em",
                marginTop: "8px",
              }}
            >
              What we stand for
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-4 rounded-2xl p-6 bg-white"
                style={{ border: "1.5px solid #E8E8E8" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "#F5F5F5" }}
                >
                  {v.icon}
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#111", letterSpacing: "-0.01em" }}>
                    {v.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.6 }}>{v.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open source section ────────────────────────────────────────────── */}
      <section style={{ background: "#111111", padding: "clamp(64px, 10vw, 100px) 0" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left text */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-6"
            >
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#DF0A09" }}>
                Open source
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-jakarta)",
                  fontSize: "clamp(28px, 3.5vw, 44px)",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                }}
              >
                Built in the open. Forever.
              </h2>
              <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                Every line of code is MIT-licensed on GitHub. Read it, audit it, fork it, or submit a PR to add the tool you&apos;ve always wanted.
              </p>
              <div className="flex flex-col min-[420px]:flex-row flex-wrap gap-3">
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href="https://github.com/zohaibIslam03/Ozaar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold text-[14px] px-6 py-3"
                  style={{ background: "#fff", color: "#111" }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                  View on GitHub
                </motion.a>
                <Link
                  href="/#tools"
                  className="inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold text-[14px] px-6 py-3"
                  style={{ border: "1px solid #2A2A2A", color: "#888" }}
                >
                  Explore Tools
                </Link>
              </div>
            </motion.div>

            {/* Right, terminal */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Terminal />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Quote ─────────────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "clamp(64px, 10vw, 100px) 0" }}>
        <div className="container">
          <div className="max-w-[760px] mx-auto text-center">
            <div
              className="text-center leading-none mb-6 select-none"
              style={{ fontFamily: "Georgia, serif", fontSize: "clamp(72px, 20vw, 120px)", color: "#F0F0F0", lineHeight: 0.8 }}
              aria-hidden
            >
              &ldquo;
            </div>
            <blockquote
              style={{
                fontFamily: "var(--font-jakarta)",
                fontSize: "clamp(20px, 2.5vw, 28px)",
                fontWeight: 700,
                color: "#111",
                letterSpacing: "-0.02em",
                lineHeight: 1.4,
              }}
            >
              The best tool is the one that gets out of your way.
            </blockquote>
            <p className="mt-5 text-[14px]" style={{ color: "#999" }}>
              Ozaar philosophy
            </p>
          </div>
        </div>
      </section>

      {/* ── Red CTA ───────────────────────────────────────────────────────── */}
      <section style={{ background: "#DF0A09", padding: "clamp(56px, 9vw, 80px) 0" }}>
        <div className="container">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-8">
            <div className="flex flex-col gap-2">
              <h2
                style={{
                  fontFamily: "var(--font-jakarta)",
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                Ready to get things done?
              </h2>
              <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)" }}>
                12 free tools. No account. Open right now.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/#tools"
                className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-[10px] font-bold text-[15px] px-8 py-4"
                style={{ background: "#fff", color: "#DF0A09" }}
              >
                Explore all tools →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
