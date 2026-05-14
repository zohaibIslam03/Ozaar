"use client";

import { motion } from "framer-motion";
import type { Feature } from "@/lib/toolConfig";

interface ToolFeaturesProps {
  features: Feature[];
  accentColor: string;
  accentLight?: string;
  toolName: string;
}

export default function ToolFeatures({
  features,
  accentColor,
  toolName,
}: ToolFeaturesProps) {
  return (
    <section className="w-full" style={{ background: "#F7F7F7", padding: "100px 0" }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: accentColor }}
          >
            Why use it
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
            Why use Ozaar {toolName}?
          </h2>
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-[860px] mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                y: -4,
                borderColor: accentColor,
                boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
              }}
              className="bg-white rounded-2xl p-7 flex flex-col gap-4 cursor-default transition-colors duration-200"
              style={{ border: "1.5px solid #E8E8E8" }}
            >
              {/* Icon box */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "#F5F5F5" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 800,
                    color: "#111",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
