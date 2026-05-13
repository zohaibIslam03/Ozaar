"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/animations";

const steps = [
  {
    num: "01",
    title: "Choose your tool",
    desc: "Pick from 12 tools designed for real everyday tasks.",
  },
  {
    num: "02",
    title: "Do your work",
    desc: "Everything runs in your browser. No uploads, no waiting, no accounts.",
  },
  {
    num: "03",
    title: "Download & go",
    desc: "Get your result instantly. Come back anytime — it's always free.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-brand-surface py-[100px] md:py-[140px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-brand-red uppercase tracking-[0.1em] mb-4">
            Simple by design
          </p>
          <h2
            className="font-heading text-brand-text"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            Pick a tool. Use it. Done.
          </h2>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((step) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              className="relative flex flex-col gap-4 p-8 bg-white rounded-2xl border border-brand-border"
            >
              <span
                className="absolute top-4 right-6 font-heading font-black text-[80px] leading-none text-[#F0F0F0] select-none pointer-events-none"
                aria-hidden
              >
                {step.num}
              </span>
              <h3 className="text-lg font-bold text-brand-text relative z-10">{step.title}</h3>
              <p className="text-[14px] text-brand-muted leading-relaxed relative z-10">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
