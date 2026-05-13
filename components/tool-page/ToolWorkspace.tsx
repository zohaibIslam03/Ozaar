"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ToolWorkspaceProps {
  children: ReactNode;
  accentColor: string;
}

export default function ToolWorkspace({ children, accentColor }: ToolWorkspaceProps) {
  return (
    <section id="tool" className="w-full" style={{ background: "#F7F7F7", padding: "clamp(48px, 8vw, 80px) 0" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[900px] mx-auto bg-white rounded-[18px] sm:rounded-[24px] p-5 sm:p-6 md:p-12"
          style={{
            border: "1.5px solid #EFEFEF",
            boxShadow: "0 8px 40px rgba(0,0,0,0.04)",
          }}
        >
          {/* Header */}
          <div className="mb-8">
            <span
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: accentColor }}
            >
              Free online tool
            </span>
            <h2
              style={{
                fontFamily: "var(--font-jakarta)",
                fontSize: "clamp(24px, 6vw, 28px)",
                fontWeight: 800,
                color: "#111",
                letterSpacing: "-0.02em",
                marginTop: "4px",
              }}
            >
              Try it now — free
            </h2>
          </div>

          {/* Tool renders here */}
          {children}
        </motion.div>
      </div>
    </section>
  );
}
