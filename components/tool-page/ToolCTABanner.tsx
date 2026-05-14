"use client";

import { motion } from "framer-motion";
import type { ToolConfig } from "@/lib/toolConfig";

interface ToolCTABannerProps {
  tool: ToolConfig;
}

export default function ToolCTABanner({ tool }: ToolCTABannerProps) {
  return (
    <section
      className="w-full"
      style={{ background: "#111111", padding: "60px 0" }}
    >
      <div className="container">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-8">
          {/* Text */}
          <div className="flex flex-col gap-2 text-left">
            <h2
              style={{
                fontFamily: "var(--font-jakarta)",
                fontSize: "clamp(24px, 3vw, 32px)",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Start using {tool.name}, it&apos;s free.
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)" }}>
              No signup. No download. No limits.
            </p>
          </div>

          {/* CTA */}
          <motion.a
            href="#tool"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="shrink-0 inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-[10px] font-bold text-[15px] px-8 py-4"
            style={{
              background: "#DF0A09",
              color: "#fff",
            }}
          >
            Use {tool.name} Now →
          </motion.a>
        </div>
      </div>
    </section>
  );
}
