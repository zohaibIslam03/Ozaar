"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ToolConfig } from "@/lib/toolConfig";
import ToolHeroVisual from "@/components/tool-page/ToolHeroVisuals";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

interface ToolHeroProps {
  config: ToolConfig;
}

export default function ToolHero({ config }: ToolHeroProps) {
  const {
    name, tagline, taglineAccent, description, category,
    accentColor, stats,
  } = config;

  return (
    <section
      className="relative flex items-center min-h-[auto] lg:min-h-[70vh] bg-white pt-[72px]"
      style={{ overflow: "hidden" }}
    >
      {/* Neutral dot-grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #E8E8E8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.8,
        }}
      />

      <div className="container relative z-10 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-16 items-center">
          {/* Left */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            {/* Breadcrumb */}
            <motion.nav custom={0} variants={fadeUp} className="flex flex-wrap items-center gap-1.5" aria-label="Breadcrumb">
              <Link href="/" className="text-[12px] text-[#888] hover:text-[#111] transition-colors">Home</Link>
              <span className="text-[12px] text-[#ccc]">/</span>
              <Link href="/#tools" className="text-[12px] text-[#888] hover:text-[#111] transition-colors">Tools</Link>
              <span className="text-[12px] text-[#ccc]">/</span>
              <span className="text-[12px] text-[#111] font-medium">{name}</span>
            </motion.nav>

            {/* Category badge */}
            <motion.div custom={1} variants={fadeUp}>
              <span
                className="inline-flex items-center gap-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] px-3.5 py-1.5"
                style={{
                  background: "#F5F5F5",
                  color: "#111",
                  border: "1px solid #E0E0E0",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: accentColor }}
                />
                {category}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div custom={2} variants={fadeUp}>
              <h1
                style={{
                  fontFamily: "var(--font-jakarta)",
                  fontSize: "clamp(34px, 11vw, 64px)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.06,
                  color: "#111",
                }}
              >
                {tagline}
                <br />
                <span style={{ color: accentColor }}>{taglineAccent}</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              custom={3}
              variants={fadeUp}
              className="text-[15px] sm:text-[17px]"
              style={{ color: "#555", lineHeight: 1.65, maxWidth: "480px" }}
            >
              {description}
            </motion.p>

            {/* Stat chips */}
            <motion.div custom={4} variants={fadeUp} className="flex flex-wrap gap-2">
              {stats.map((stat) => (
                <span
                  key={stat.label}
                  className="flex flex-col gap-0.5 rounded-xl px-4 py-2 border"
                  style={{
                    background: "#F7F7F7",
                    borderColor: "#EBEBEB",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#111",
                  }}
                >
                  <span style={{ color: accentColor }}>{stat.value}</span>
                  <span style={{ fontSize: "11px", fontWeight: 400, color: "#888" }}>{stat.label}</span>
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div custom={5} variants={fadeUp} className="flex flex-col min-[420px]:flex-row flex-wrap items-stretch min-[420px]:items-center gap-3">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
                <a
                  href="#tool"
                  className="inline-flex w-full min-[420px]:w-auto items-center justify-center gap-2 rounded-[10px] text-white font-bold text-[15px] px-6 py-3.5"
                  style={{ background: accentColor }}
                >
                  Use {name} Free →
                </a>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
                <a
                  href="#how-it-works"
                  className="inline-flex w-full min-[420px]:w-auto items-center justify-center gap-2 rounded-[10px] text-[14px] font-semibold px-6 py-3.5"
                  style={{ border: "1.5px solid #E0E0E0", color: "#666" }}
                >
                  How it works ↓
                </a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right, visual */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex items-center justify-center h-[380px]"
          >
            <ToolHeroVisual slug={config.slug} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
