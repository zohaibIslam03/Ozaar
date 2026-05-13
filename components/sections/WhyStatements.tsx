"use client";

import { motion } from "framer-motion";

const statements = [
  {
    headline: "We don't sell your data.",
    sub: "There's nothing to sell. Your files never touch our servers.",
  },
  {
    headline: "We don't charge for features.",
    sub: "Every tool. Every feature. Free. Forever. No 'pro' tier.",
  },
  {
    headline: "We don't track what you do.",
    sub: "No cookies. No analytics. No idea what you compressed or converted. That's the point.",
  },
];

export default function WhyStatements() {
  return (
    <section className="w-full bg-white" style={{ padding: "clamp(64px, 10vw, 100px) 0" }}>
      <div className="container flex flex-col gap-10 md:gap-16">
        {statements.map((s, i) => (
          <motion.div
            key={s.headline}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="text-center flex flex-col gap-4"
          >
            <h2
              style={{
                fontFamily: "var(--font-jakarta)",
                fontSize: "clamp(32px, 10vw, 72px)",
                fontWeight: 900,
                color: "#111",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              {s.headline}
            </h2>
            <p
              style={{
                fontSize: "clamp(16px, 4vw, 18px)",
                color: "#888",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              {s.sub}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
