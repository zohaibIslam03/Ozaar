import Link from "next/link";
import {
  AlignLeft,
  BriefcaseBusiness,
  CalendarDays,
  Coins,
  Crop,
  FileText,
  Image,
  KeyRound,
  Palette,
  QrCode,
  Ruler,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { getToolBySlug } from "@/lib/tools";
import { getToolConfig } from "@/lib/toolConfig";

interface RelatedToolsProps {
  slugs: string[];
}

const toolIcons: Record<string, LucideIcon> = {
  "pdf-toolkit": FileText,
  "image-compressor": Image,
  "qr-generator": QrCode,
  "password-generator": KeyRound,
  "color-palette": Palette,
  "word-counter": AlignLeft,
  "image-resizer": Crop,
  "bg-remover": Wand2,
  "resume-builder": BriefcaseBusiness,
  "age-calculator": CalendarDays,
  "currency-converter": Coins,
  "unit-converter": Ruler,
};

export default function RelatedTools({ slugs }: RelatedToolsProps) {
  const tools = slugs
    .map((s) => ({ base: getToolBySlug(s), config: getToolConfig(s) }))
    .filter((t) => t.base != null);

  if (tools.length === 0) return null;

  return (
    <section className="w-full" style={{ background: "#F7F7F7", padding: "80px 0" }}>
      <div className="container">
        <h2
          style={{
            fontFamily: "var(--font-jakarta)",
            fontSize: "22px",
            fontWeight: 800,
            color: "#111",
            letterSpacing: "-0.02em",
            marginBottom: "24px",
          }}
        >
          You might also need
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tools.map(({ base: tool, config }) => {
            if (!tool) return null;
            const accent = config?.accentColor ?? "#DF0A09";
            const accentLight = config?.accentLight ?? "#F5F5F5";
            const Icon = toolIcons[tool.slug] ?? FileText;
            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-[#EBEBEB] hover:border-[#DF0A09] hover:shadow-[0_8px_24px_rgba(223,10,9,0.08)] transition-all duration-200 group"
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: accentLight, color: accent }}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.8} aria-hidden />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-[#111] leading-tight">{tool.name}</p>
                  <p className="text-[12px] text-[#888] mt-0.5 line-clamp-2">{tool.desc}</p>
                </div>

                {/* Arrow */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="shrink-0 text-[#ccc] group-hover:text-[#DF0A09] transition-colors duration-200"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
