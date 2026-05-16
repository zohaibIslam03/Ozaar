"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "@/components/ui/CountUp";

const lines = [
  { text: "$ git clone https://github.com/zohaibIslam03/Ozaar.git", color: "#eee" },
  { text: "$ cd Ozaar", color: "#eee" },
  { text: "$ npm install", color: "#eee" },
  { text: "$ npm run dev", color: "#eee" },
  { text: "", color: "#eee" },
  { text: "✓ 12 tools ready at localhost:3000", color: "#4ADE80" },
  { text: "✓ Add your tool in /tools/your-tool-name", color: "#4ADE80" },
  { text: "✓ Submit a PR — we review within 48 hours", color: "#4ADE80" },
];

function Terminal() {
  const [visible, setVisible] = useState<boolean[]>(new Array(lines.length).fill(false));
  const ref = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          lines.forEach((_, i) => {
            setTimeout(() => {
              setVisible((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 200);
          });
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: "#0D1117", border: "1px solid #1A1A2E" }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#1A1A2E]">
        <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        <span className="ml-2 text-[11px] text-[#555] font-mono">bash</span>
      </div>
      {/* Content */}
      <div className="p-6 font-mono text-[13px] leading-relaxed min-h-[220px]">
        {lines.map((line, i) => (
          <div
            key={i}
            className="transition-all duration-300"
            style={{
              opacity: visible[i] ? 1 : 0,
              transform: visible[i] ? "translateY(0)" : "translateY(8px)",
              color: line.color,
            }}
          >
            {line.text || " "}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OpenSourceSection() {
  return (
    <section className="w-full" style={{ background: "#111", padding: "clamp(64px, 10vw, 100px) 0" }}>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 items-center">
          {/* Left */}
          <div className="flex flex-col gap-6">
            <span
              className="inline-block text-[11px] font-bold uppercase tracking-widest"
              style={{ color: "#DF0A09" }}
            >
              Open source
            </span>
            <h2
              style={{
                fontFamily: "var(--font-jakarta)",
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
              }}
            >
              Every line of code is public.
            </h2>
            <p style={{ fontSize: "16px", color: "#666", lineHeight: 1.65, maxWidth: "480px" }}>
              Fork it. Improve it. Add your own tools. We believe the best software is built in the
              open, by people who actually use it.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-2">
              {[
                { label: "Status", value: "Active", isText: true },
                { label: "License", value: "MIT", isText: true },
                { label: "Forks allowed", isInfinity: true },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span
                    style={{
                      fontFamily: "var(--font-jakarta)",
                      fontSize: "24px",
                      fontWeight: 900,
                      color: "#fff",
                    }}
                  >
                    {s.isInfinity ? (
                      <CountUp nonNumeric="∞" target={0} />
                    ) : (
                      s.value
                    )}
                  </span>
                  <span style={{ fontSize: "12px", color: "#555" }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col min-[420px]:flex-row flex-wrap gap-3 mt-2">
              <motion.a
                href="https://github.com/zohaibIslam03/Ozaar"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-[#111] text-[14px] font-bold transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                View on GitHub →
              </motion.a>
              <motion.a
                href="https://github.com/zohaibIslam03/Ozaar"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#333] text-white text-[14px] font-semibold hover:border-[#555] transition-colors"
              >
                Contribute a tool
              </motion.a>
            </div>
          </div>

          {/* Right: Terminal */}
          <Terminal />
        </div>
      </div>
    </section>
  );
}
