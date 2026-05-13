"use client";

import { motion } from "framer-motion";
import type { UseCase } from "@/lib/toolConfig";

interface ToolUseCasesProps {
  cases: UseCase[];
  accentColor: string;
  accentLight: string;
  toolSlug: string;
}

export default function ToolUseCases({
  cases,
  accentColor,
  accentLight,
  toolSlug,
}: ToolUseCasesProps) {
  return (
    <section className="w-full bg-white" style={{ padding: "100px 0" }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: accentColor }}
          >
            Who uses it
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
            Real-world use cases
          </h2>
        </div>

        {/* Alternating layout */}
        <div className="flex flex-col gap-20">
          {cases.map((uc, i) => {
            const isEven = i % 2 === 0;
            const textSide = (
              <div className="flex flex-col gap-5 justify-center">
                <span
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: accentColor }}
                >
                  {uc.scenario}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-jakarta)",
                    fontSize: "clamp(24px, 2.5vw, 32px)",
                    fontWeight: 900,
                    color: "#111",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                  }}
                >
                  {uc.title}
                </h3>
                <p style={{ fontSize: "16px", color: "#555", lineHeight: 1.7, maxWidth: "460px" }}>
                  {uc.description}
                </p>
                <a
                  href="#tool"
                  className="inline-flex items-center gap-1.5 text-[14px] font-bold self-start"
                  style={{ color: accentColor }}
                >
                  Try it for this →
                </a>
              </div>
            );

            const illustrationSide = (
              <div
                className="rounded-2xl p-8 flex items-center justify-center min-h-[200px]"
                style={{ background: "#F7F7F7" }}
              >
                <div className="flex flex-col gap-3 w-full max-w-[280px]">
                  {/* Decorative scenario card */}
                  <div
                    className="rounded-xl p-4 border"
                    style={{
                      background: accentLight,
                      borderColor: `${accentColor}20`,
                    }}
                  >
                    <p
                      className="text-[11px] font-bold uppercase tracking-widest mb-2"
                      style={{ color: accentColor }}
                    >
                      {uc.scenario}
                    </p>
                    <div className="h-2 bg-white/60 rounded-full w-full mb-1.5" />
                    <div className="h-2 bg-white/60 rounded-full w-3/4 mb-1.5" />
                    <div className="h-2 bg-white/60 rounded-full w-1/2" />
                  </div>
                  <div
                    className="self-end text-[12px] font-semibold px-3 py-1.5 rounded-full text-white"
                    style={{ background: accentColor }}
                  >
                    Done ✓
                  </div>
                </div>
              </div>
            );

            return (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              >
                {isEven ? (
                  <>
                    {textSide}
                    {illustrationSide}
                  </>
                ) : (
                  <>
                    {illustrationSide}
                    {textSide}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
