"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/animations";

const quotes = [
  {
    text: "Finally a tool site that doesn't ask me to sign up just to compress an image.",
    author: "Ayesha M.",
    role: "Freelance Designer",
  },
  {
    text: "I use the resume builder every time I help a student with their CV. Clean, fast, and actually ATS-ready.",
    author: "Omar T.",
    role: "Career Coach",
  },
  {
    text: "The currency converter is the one I have bookmarked. Updates instantly, no ads, no nonsense.",
    author: "Layla R.",
    role: "Remote Worker",
  },
];

export default function TrustSection() {
  return (
    <section className="bg-[#111111] py-[80px] md:py-[100px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="font-heading text-white mb-12 text-center"
          style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          Why people love it
        </h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {quotes.map((q) => (
            <motion.div
              key={q.author}
              variants={fadeUp}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-7 flex flex-col gap-5"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-brand-red text-base">★</span>
                ))}
              </div>
              <p className="text-white text-base leading-relaxed">
                &ldquo;{q.text}&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-white">{q.author}</p>
                <p className="text-xs text-[#666666]">{q.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
