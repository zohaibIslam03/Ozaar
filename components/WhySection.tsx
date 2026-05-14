"use client";

import { motion } from "framer-motion";

const benefits = [
  {
    icon: "🚫",
    title: "No Signup Required",
    desc: "Open any tool and start using it immediately. No account, no email, no OAuth flow, ever.",
  },
  {
    icon: "⚡",
    title: "Works Offline",
    desc: "All processing happens inside your browser. Most tools work without an internet connection after first load.",
  },
  {
    icon: "🛠️",
    title: "Open Source",
    desc: "MIT-licensed and public on GitHub. Read the code, fork it, self-host it, or submit a pull request.",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.4, 0.25, 1] } },
};

export default function WhySection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-brand-border">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="flex flex-col gap-8"
      >
        <motion.div variants={item} className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-brand-text">Why Ozaar?</h2>
          <p className="text-sm text-brand-muted">
            Built on one rule: your tool shouldn&apos;t require your data.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {benefits.map((b) => (
            <motion.div
              key={b.title}
              variants={item}
              className="bg-white border border-brand-border rounded-xl p-5 flex flex-col gap-3
                hover:border-brand-red/30 transition-colors duration-300"
            >
              <span className="text-2xl select-none" role="img" aria-label={b.title}>
                {b.icon}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-brand-text">{b.title}</h3>
                <p className="text-xs text-brand-muted leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
