"use client";

import Link from "next/link";
import { useToast } from "@/components/Toast";
import { Share2 } from "lucide-react";
import type { Tool } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import { tools } from "@/lib/tools";

const categoryColors: Record<string, string> = {
  Files:     "bg-blue-50 text-blue-600",
  Images:    "bg-purple-50 text-purple-600",
  Utilities: "bg-green-50 text-green-600",
  Security:  "bg-yellow-50 text-yellow-700",
  Design:    "bg-pink-50 text-pink-600",
  Writing:   "bg-orange-50 text-orange-600",
  Career:    "bg-teal-50 text-teal-600",
  Finance:   "bg-emerald-50 text-emerald-600",
};

interface Props {
  tool: Tool;
  children: React.ReactNode;
}

export default function ToolPageLayout({ tool, children }: Props) {
  const toast = useToast();
  const badgeClass = categoryColors[tool.category] ?? "bg-gray-50 text-gray-600";

  const share = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast("Link copied!", "success");
  };

  const related = tools
    .filter((t) => t.slug !== tool.slug && t.category === tool.category)
    .slice(0, 3);
  const others = tools
    .filter((t) => t.slug !== tool.slug && t.category !== tool.category)
    .slice(0, Math.max(0, 3 - related.length));
  const suggestedTools = [...related, ...others].slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-brand-muted mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-text transition-colors">Home</Link>
        <span>/</span>
        <Link href="/#tools" className="hover:text-brand-text transition-colors">Tools</Link>
        <span>/</span>
        <span className="text-brand-text font-medium">{tool.name}</span>
      </nav>

      {/* Tool header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-[14px] bg-brand-redLight flex items-center justify-center text-3xl shrink-0 select-none">
          {tool.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-[28px] font-bold text-brand-text tracking-tight leading-tight">{tool.name}</h1>
          <span className={`inline-block mt-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${badgeClass}`}>
            {tool.category}
          </span>
        </div>
        <button
          onClick={share}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-brand-border text-brand-muted text-xs font-medium
            hover:text-brand-text hover:border-brand-text transition-all duration-200 shrink-0"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
      </div>

      <hr className="border-brand-border mb-8" />

      {/* Tool UI area */}
      <div className="bg-white border border-brand-border rounded-2xl p-6">
        {children}
      </div>

      {/* Related tools */}
      {suggestedTools.length > 0 && (
        <div className="mt-12">
          <h2 className="text-sm font-semibold text-brand-text mb-4">Other tools you might like</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {suggestedTools.map((t) => (
              <ToolCard key={t.slug} tool={t} mini />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
