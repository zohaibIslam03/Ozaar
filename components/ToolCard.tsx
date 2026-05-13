"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Tool } from "@/lib/tools";

// ── Per-tool SVG visual compositions ─────────────────────────────────────────

const TOOL_VISUALS: Record<string, React.ReactNode> = {
  "pdf-toolkit": (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="18" y="10" width="34" height="42" rx="4" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="1.5"/>
      <rect x="24" y="10" width="34" height="42" rx="4" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.5"/>
      <rect x="30" y="10" width="34" height="44" rx="4" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
      <line x1="38" y1="24" x2="56" y2="24" stroke="#D0D0D0" strokeWidth="2" strokeLinecap="round"/>
      <line x1="38" y1="31" x2="56" y2="31" stroke="#D0D0D0" strokeWidth="2" strokeLinecap="round"/>
      <line x1="38" y1="38" x2="50" y2="38" stroke="#D0D0D0" strokeWidth="2" strokeLinecap="round"/>
      <rect x="30" y="46" width="16" height="6" rx="2" fill="#DF0A09"/>
      <text x="32" y="52" fill="white" fontSize="5" fontWeight="700">PDF</text>
    </svg>
  ),
  "image-compressor": (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="12" y="16" width="24" height="20" rx="3" fill="#E0E7FF"/>
      <path d="M12 30l7-7 4 5 3-3 10 8H12z" fill="#A5B4FC"/>
      <circle cx="28" cy="22" r="2.5" fill="#818CF8"/>
      <path d="M44 36l8-8M52 28l-4 0 0 4" stroke="#DF0A09" strokeWidth="2" strokeLinecap="round"/>
      <rect x="44" y="36" width="20" height="16" rx="3" fill="#F5F5F5"/>
      <path d="M44 46l6-5 3 3 3-2 8 6H44z" fill="#BBBBBB"/>
      <circle cx="57" cy="40" r="2" fill="#F87171"/>
    </svg>
  ),
  "qr-generator": (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="14" y="14" width="20" height="20" rx="3" fill="#111" stroke="#111" strokeWidth="1"/>
      <rect x="18" y="18" width="12" height="12" rx="1.5" fill="white"/>
      <rect x="20" y="20" width="8" height="8" rx="1" fill="#111"/>
      <rect x="46" y="14" width="20" height="20" rx="3" fill="#111" stroke="#111" strokeWidth="1"/>
      <rect x="50" y="18" width="12" height="12" rx="1.5" fill="white"/>
      <rect x="52" y="20" width="8" height="8" rx="1" fill="#111"/>
      <rect x="14" y="46" width="20" height="20" rx="3" fill="#111" stroke="#111" strokeWidth="1"/>
      <rect x="18" y="50" width="12" height="12" rx="1.5" fill="white"/>
      <rect x="20" y="52" width="8" height="8" rx="1" fill="#111"/>
      {[46,50,54,58,62].map(x => [46,50,54,58].map(y => (x+y)%8===0 ? <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" fill="#333" rx="0.5"/> : null))}
    </svg>
  ),
  "password-generator": (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="22" y="34" width="36" height="28" rx="5" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
      <path d="M30 34v-8a10 10 0 0120 0v8" stroke="#E8E8E8" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="40" cy="48" r="5" fill="#DF0A09"/>
      <rect x="39" y="48" width="2" height="5" rx="1" fill="white"/>
      <circle cx="30" cy="48" r="2" fill="#F0F0F0"/>
      <circle cx="50" cy="48" r="2" fill="#F0F0F0"/>
    </svg>
  ),
  "color-palette": (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="22" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
      <path d="M40 18 A22 22 0 0 1 62 40" fill="#BBBBBB"/>
      <path d="M62 40 A22 22 0 0 1 40 62" fill="#FDE68A"/>
      <path d="M40 62 A22 22 0 0 1 18 40" fill="#A5F3FC"/>
      <path d="M18 40 A22 22 0 0 1 40 18" fill="#C4B5FD"/>
      <circle cx="40" cy="40" r="8" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
    </svg>
  ),
  "word-counter": (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="16" y="14" width="48" height="52" rx="6" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
      <line x1="24" y1="26" x2="56" y2="26" stroke="#E8E8E8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="24" y1="33" x2="56" y2="33" stroke="#E8E8E8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="24" y1="40" x2="50" y2="40" stroke="#E8E8E8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="24" y1="47" x2="44" y2="47" stroke="#E8E8E8" strokeWidth="2" strokeLinecap="round"/>
      <rect x="24" y="54" width="14" height="5" rx="2.5" fill="#DF0A09"/>
      <text x="26" y="59" fill="white" fontSize="4" fontWeight="700">247w</text>
    </svg>
  ),
  "image-resizer": (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="14" y="14" width="30" height="25" rx="3" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="1.5"/>
      <path d="M14 33l9-8 5 6 4-3 12 9H14z" fill="#D1D5DB"/>
      <rect x="4" y="4" width="10" height="10" rx="2" fill="white" stroke="#DF0A09" strokeWidth="1.5"/>
      <rect x="4" y="62" width="10" height="10" rx="2" fill="white" stroke="#DF0A09" strokeWidth="1.5"/>
      <rect x="62" y="4" width="10" height="10" rx="2" fill="white" stroke="#DF0A09" strokeWidth="1.5"/>
      <path d="M14 9h14M9 14v14M66 14v14M56 9h14" stroke="#DF0A09" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
      <rect x="32" y="38" width="34" height="28" rx="3" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
      <path d="M32 56l9-7 6 7 5-4 14 11H32z" fill="#E8E8E8"/>
    </svg>
  ),
  "bg-remover": (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="14" y="14" width="52" height="52" rx="6" fill="none"/>
      {[14,22,30,38,46,54,62].map(x => [14,22,30,38,46,54,62].map(y => (x+y)%16===0 ? <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill="#F3F4F6"/> : <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill="white"/>))}
      <ellipse cx="40" cy="40" rx="18" ry="22" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
      <ellipse cx="40" cy="34" rx="10" ry="12" fill="#FDE68A"/>
      <ellipse cx="40" cy="52" rx="14" ry="10" fill="#BBBBBB"/>
      <path d="M26 58 Q40 64 54 58" fill="#BBBBBB" stroke="none"/>
    </svg>
  ),
  "resume-builder": (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="18" y="10" width="44" height="60" rx="5" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
      <rect x="18" y="10" width="44" height="18" rx="5" fill="#DF0A09" stroke="none"/>
      <rect x="18" y="25" width="44" height="3" rx="0" fill="#DF0A09"/>
      <circle cx="30" cy="19" r="6" fill="white" opacity="0.3"/>
      <line x1="40" y1="16" x2="56" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <line x1="40" y1="21" x2="52" y2="21" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <line x1="26" y1="36" x2="54" y2="36" stroke="#E8E8E8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="26" y1="42" x2="54" y2="42" stroke="#E8E8E8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="26" y1="48" x2="46" y2="48" stroke="#E8E8E8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="26" y1="56" x2="54" y2="56" stroke="#E8E8E8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="26" y1="62" x2="50" y2="62" stroke="#E8E8E8" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "age-calculator": (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="14" y="20" width="52" height="48" rx="6" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
      <rect x="14" y="20" width="52" height="16" rx="6" fill="#F7F7F7" stroke="#E8E8E8" strokeWidth="1.5"/>
      <line x1="14" y1="36" x2="66" y2="36" stroke="#E8E8E8" strokeWidth="1"/>
      <circle cx="28" cy="16" r="4" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
      <circle cx="52" cy="16" r="4" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
      <text x="22" y="32" fill="#DF0A09" fontSize="9" fontWeight="700">2025</text>
      <text x="26" y="52" fill="#111" fontSize="20" fontWeight="900">28</text>
      <text x="30" y="60" fill="#999" fontSize="7">years old</text>
    </svg>
  ),
  "currency-converter": (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="26" cy="36" r="14" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="1.5"/>
      <text x="19" y="40" fill="#3B82F6" fontSize="12" fontWeight="700">$</text>
      <circle cx="54" cy="44" r="14" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="1.5"/>
      <text x="48" y="48" fill="#22C55E" fontSize="12" fontWeight="700">€</text>
      <path d="M34 36 C38 30, 46 30, 46 36" stroke="#DF0A09" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M46 44 C42 50, 34 50, 34 44" stroke="#DF0A09" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M44 33l3 3-3 3" stroke="#DF0A09" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M36 41l-3 3 3 3" stroke="#DF0A09" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  "unit-converter": (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="12" y="30" width="25" height="30" rx="4" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
      <rect x="12" y="30" width="25" height="10" rx="4" fill="#F7F7F7"/>
      <text x="16" y="39" fill="#DF0A09" fontSize="6" fontWeight="700">km</text>
      <text x="16" y="52" fill="#111" fontSize="11" fontWeight="700">42</text>
      <rect x="43" y="22" width="25" height="30" rx="4" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
      <rect x="43" y="22" width="25" height="10" rx="4" fill="#F7F7F7"/>
      <text x="46" y="31" fill="#22C55E" fontSize="6" fontWeight="700">miles</text>
      <text x="45" y="44" fill="#111" fontSize="10" fontWeight="700">26.1</text>
      <path d="M37 45 L43 45" stroke="#DF0A09" strokeWidth="2" strokeLinecap="round"/>
      <path d="M41 42l3 3-3 3" stroke="#DF0A09" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const POPULAR = new Set(["image-compressor", "bg-remover", "password-generator", "qr-generator"]);

const USES: Record<string, string> = {
  "image-compressor": "18.4k",
  "qr-generator": "12.1k",
  "password-generator": "9.8k",
  "bg-remover": "7.3k",
  "resume-builder": "6.5k",
  "pdf-toolkit": "5.2k",
  "currency-converter": "4.7k",
  "word-counter": "3.9k",
  "color-palette": "3.1k",
  "unit-converter": "2.8k",
  "image-resizer": "2.4k",
  "age-calculator": "1.9k",
};

interface ToolCardProps {
  tool: Tool;
  mini?: boolean;
}

export default function ToolCard({ tool, mini = false }: ToolCardProps) {
  const visual = TOOL_VISUALS[tool.slug];
  const isPopular = POPULAR.has(tool.slug);
  const uses = USES[tool.slug] ?? "1k";

  if (mini) {
    return (
      <Link
        href={`/tools/${tool.slug}`}
        className="flex flex-col gap-3 bg-white border border-brand-border rounded-xl p-4
          hover:border-brand-red hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(223,10,9,0.08)]
          transition-all duration-200 w-[200px] shrink-0"
      >
        <div className="w-10 h-10 rounded-xl bg-brand-surface flex items-center justify-center">
          {visual ?? <span className="text-xl">{tool.icon}</span>}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-brand-text leading-tight">{tool.name}</p>
          <p className="text-[11px] text-brand-muted mt-0.5 line-clamp-2">{tool.desc}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/tools/${tool.slug}`} className="block h-full w-full group">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="flex flex-col bg-white border border-brand-border rounded-2xl overflow-hidden
          group-hover:border-brand-red group-hover:shadow-[0_12px_40px_rgba(223,10,9,0.08)]
          transition-[border-color,box-shadow] duration-[250ms] h-full"
      >
        {/* Visual area */}
        <div className="relative h-[120px] bg-brand-surface flex items-center justify-center border-b border-brand-border overflow-hidden">
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(#E8E8E8 1px, transparent 1px), linear-gradient(90deg, #E8E8E8 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          {/* Hover vignette effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.04) 100%)",
            }}
          />
          <motion.div
            className="relative z-10"
            whileHover={{ scale: 1.06 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {visual ?? <span className="text-4xl">{tool.icon}</span>}
          </motion.div>
          {isPopular && (
            <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wider uppercase bg-brand-red text-white px-2 py-0.5 rounded-full">
              Popular
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 p-5 flex-1">
          <h3 className="text-[15px] font-bold text-brand-text leading-tight">{tool.name}</h3>
          <p className="text-[13px] text-brand-muted leading-relaxed flex-1 line-clamp-2">{tool.desc}</p>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between px-5 pb-4">
          <span className="text-[11px] text-brand-muted/60">{uses} uses</span>
          <span className="flex items-center gap-1 text-[12px] font-semibold text-brand-red group-hover:gap-2 transition-all duration-200">
            Open
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <path
                d="M2.5 6h7M6.5 3l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
