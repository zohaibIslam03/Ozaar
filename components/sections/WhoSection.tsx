"use client";

import { motion } from "framer-motion";
import { stagger, fadeUp, scaleSpring } from "@/lib/animations";

const PERSONAS = [
  {
    label: "Students",
    tagline: "Research, write, submit.",
    desc: "Compress lecture photos, count essay words, calculate deadlines — all without leaving your browser.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="4" y="22" width="28" height="10" rx="3" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="1.2"/>
        <rect x="9" y="10" width="18" height="14" rx="2" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.2"/>
        <path d="M18 8 L7 13 L18 18 L29 13 Z" fill="#3B82F6"/>
        <line x1="26" y1="14" x2="26" y2="20" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="26" cy="22" r="2" fill="#3B82F6"/>
      </svg>
    ),
    highlights: ["Word Counter", "PDF Toolkit", "Age Calculator"],
    color: "#3B82F6",
    bg: "#E8E8E8",
  },
  {
    label: "Freelancers",
    tagline: "Work faster. Bill more.",
    desc: "Generate invoices, compress client images for delivery, and create QR codes for proposals — no subscriptions needed.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="6" y="8" width="24" height="20" rx="3" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="1.2"/>
        <line x1="11" y1="15" x2="25" y2="15" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="11" y1="19" x2="22" y2="19" stroke="#D0D0D0" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="11" y1="23" x2="20" y2="23" stroke="#D0D0D0" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="26" cy="26" r="7" fill="#22C55E"/>
        <path d="M22.5 26 L25 28.5 L29.5 23.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    highlights: ["Image Compressor", "QR Generator", "Resume Builder"],
    color: "#22C55E",
    bg: "#E8E8E8",
  },
  {
    label: "Creators",
    tagline: "Make it. Share it.",
    desc: "Resize images for every platform, remove backgrounds for thumbnails, and generate color palettes that match your brand.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="12" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="1.2"/>
        <path d="M18 6 A12 12 0 0 1 30 18" fill="#FB923C" opacity="0.7"/>
        <path d="M30 18 A12 12 0 0 1 18 30" fill="#FDE68A" opacity="0.7"/>
        <path d="M18 30 A12 12 0 0 1 6 18" fill="#A5F3FC" opacity="0.7"/>
        <path d="M6 18 A12 12 0 0 1 18 6" fill="#C4B5FD" opacity="0.7"/>
        <circle cx="18" cy="18" r="5" fill="white"/>
      </svg>
    ),
    highlights: ["Color Palette", "Background Remover", "Image Resizer"],
    color: "#F97316",
    bg: "#FFF7ED",
  },
  {
    label: "Professionals",
    tagline: "Decisions backed by data.",
    desc: "Convert currencies for international projects, convert units for technical specs, and build polished resumes that get noticed.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="6" y="8" width="24" height="22" rx="3" fill="#FFF1F2" stroke="#FECDD3" strokeWidth="1.2"/>
        <rect x="6" y="8" width="24" height="8" rx="3" fill="#DF0A09" opacity="0.1"/>
        <circle cx="14" cy="12" r="3" fill="#DF0A09" opacity="0.3"/>
        <line x1="20" y1="11" x2="26" y2="11" stroke="#DF0A09" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <line x1="20" y1="14" x2="24" y2="14" stroke="#DF0A09" strokeWidth="1.2" strokeLinecap="round" opacity="0.3"/>
        <line x1="10" y1="22" x2="26" y2="22" stroke="#E8E8E8" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="10" y1="26" x2="22" y2="26" stroke="#E8E8E8" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    highlights: ["Currency Converter", "Unit Converter", "Resume Builder"],
    color: "#DF0A09",
    bg: "#F5F5F5",
  },
];

export default function WhoSection() {
  return (
    <section className="bg-white py-[100px] md:py-[140px]">
      <div className="container">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-4 mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="text-xs font-semibold text-brand-red uppercase tracking-[0.1em]">Built for everyone</p>
          <h2
            className="font-heading text-brand-text"
            style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.02em", maxWidth: "480px" }}
          >
            Tools for real people with real work to do
          </h2>
        </motion.div>

        {/* Persona grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {PERSONAS.map((persona) => (
            <motion.div
              key={persona.label}
              variants={scaleSpring}
              className="flex flex-col gap-5 p-6 bg-white border border-brand-border rounded-2xl
                hover:border-brand-red/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]
                transition-all duration-300"
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: persona.bg }}
              >
                {persona.icon}
              </div>

              {/* Text */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-bold text-brand-text">{persona.label}</h3>
                <p className="text-[13px] font-semibold" style={{ color: persona.color }}>{persona.tagline}</p>
                <p className="text-[13px] text-brand-muted leading-relaxed">{persona.desc}</p>
              </div>

              {/* Tool pills */}
              <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                {persona.highlights.map((tool) => (
                  <span
                    key={tool}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-brand-surface text-brand-muted border border-brand-border"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
