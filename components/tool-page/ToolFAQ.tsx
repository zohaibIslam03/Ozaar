"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FAQ } from "@/lib/toolConfig";

interface ToolFAQProps {
  faqs: FAQ[];
  accentColor: string;
}

export default function ToolFAQ({ faqs, accentColor }: ToolFAQProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="w-full bg-white" style={{ padding: "100px 0" }}>
      <div className="container">
        <div className="max-w-[760px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: accentColor }}
            >
              Common questions
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
              Frequently asked questions
            </h2>
          </div>

          {/* Accordion */}
          <div className="flex flex-col">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={faq.question}
                  className="border-b border-[#F0F0F0]"
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  >
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: isOpen ? accentColor : "#111",
                        transition: "color 0.2s",
                        lineHeight: 1.4,
                      }}
                    >
                      {faq.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="shrink-0 text-[22px] leading-none font-light"
                      style={{ color: isOpen ? accentColor : "#999", lineHeight: "1" }}
                    >
                      +
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <p
                          style={{
                            fontSize: "15px",
                            color: "#555",
                            lineHeight: 1.7,
                            paddingBottom: "20px",
                          }}
                        >
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
