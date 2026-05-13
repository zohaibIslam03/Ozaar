"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ToolCard from "@/components/ToolCard";
import type { Tool } from "@/lib/tools";
import { staggerContainer, scaleIn } from "@/lib/animations";

const CATEGORY_ORDER = ["All", "Images", "Files", "Design", "Writing", "Utilities", "Career", "Finance", "Security"];

interface ToolsGridProps {
  tools: Tool[];
}

export default function ToolsGrid({ tools }: ToolsGridProps) {
  const [active, setActive] = useState("All");

  const categories = CATEGORY_ORDER.filter(
    (c) => c === "All" || tools.some((t) => t.category === c)
  );
  const filtered = active === "All" ? tools : tools.filter((t) => t.category === active);

  return (
    <section id="tools" className="bg-white py-[100px] md:py-[140px]">
      <div className="container">
        {/* Section header */}
        <div className="flex flex-col gap-4 mb-12">
          <p className="text-xs font-semibold text-brand-red uppercase tracking-[0.1em]">The toolkit</p>
          <h2
            className="font-heading text-brand-text"
            style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            12 tools built for real life
          </h2>
          <p className="text-base text-brand-muted max-w-lg">
            Not just for developers. Built for students, freelancers, creators, and professionals.
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter tools by category">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              aria-pressed={active === cat}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
                active === cat
                  ? "bg-brand-text text-white"
                  : "bg-brand-surface text-brand-muted hover:bg-[#EFEFEF] hover:text-brand-text"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          style={{ gridAutoRows: "minmax(240px, auto)" }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((tool, i) => (
              <motion.div
                key={tool.slug}
                layout
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ delay: i * 0.05 }}
                className="flex w-full"
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-sm text-brand-muted py-16">
            No tools in this category yet — check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
