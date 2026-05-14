"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

interface IntroLoaderProps {
  onComplete: () => void;
}

type IntroPhase = "idle" | "letters" | "shadow" | "tagline" | "exit";

const LETTERS = ["O", "Z", "A", "A", "R"] as const;

const easeOut = [0.22, 1, 0.36, 1] as const;
const easeCurtain = [0.76, 0, 0.24, 1] as const;

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [phase, setPhase] = useState<IntroPhase>("idle");
  const completedRef = useRef(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase("letters"), 200);
    const t2 = window.setTimeout(() => setPhase("shadow"), 900);
    const t3 = window.setTimeout(() => setPhase("tagline"), 1400);
    const t4 = window.setTimeout(() => setPhase("exit"), 2200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, []);

  // Do not use onAnimationComplete on curtains: with initial={false}, Framer fires it
  // immediately on mount (y: 0% "done"), which was unmounting the loader before any play.
  useEffect(() => {
    if (phase !== "exit") return;
    const t = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete();
    }, 650);
    return () => window.clearTimeout(t);
  }, [phase, onComplete]);

  const glowActive = phase === "shadow" || phase === "tagline" || phase === "exit";
  const taglineVisible = phase === "tagline" || phase === "exit";
  const exitActive = phase === "exit";

  // Portal to body so we are NOT under PageTransition's motion wrapper (opacity 0 + transform
  // breaks visibility and traps fixed positioning to a small subtree).
  return createPortal(
    <div className="pointer-events-auto fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-transparent">
      {/* White curtains: meet at center, slide apart on exit */}
      <motion.div
        className="pointer-events-none absolute left-0 top-0 z-10 h-1/2 w-full bg-white"
        initial={false}
        animate={exitActive ? { y: "-100%" } : { y: "0%" }}
        transition={{ duration: 0.6, ease: easeCurtain }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-1/2 w-full bg-white"
        initial={false}
        animate={exitActive ? { y: "100%" } : { y: "0%" }}
        transition={{ duration: 0.6, ease: easeCurtain }}
      />

      <motion.div
        className="pointer-events-none absolute left-[10%] top-[55%] z-[11] h-[30%] w-[80%] rounded-full bg-[#DF0A09] blur-[80px] sm:left-[20%] sm:w-[60%]"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={
          glowActive
            ? { opacity: 0.18, scale: 1 }
            : { opacity: 0, scale: 0.3 }
        }
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      <motion.div
        className="relative z-20 flex items-center justify-center [perspective:800px]"
        animate={exitActive ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.2, ease: easeOut }}
      >
        <div className="flex items-center justify-center [transform-style:preserve-3d]">
          {LETTERS.map((letter, i) => (
            <motion.span
              key={`${letter}-${i}`}
              className="select-none font-heading font-black leading-none tracking-[-0.04em] text-[#DF0A09] [transform-style:preserve-3d] text-[clamp(5rem,18vw,13.75rem)]"
              initial={{ opacity: 0, y: 60, rotateX: -90 }}
              animate={
                phase === "idle"
                  ? { opacity: 0, y: 60, rotateX: -90 }
                  : { opacity: 1, y: 0, rotateX: 0 }
              }
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: easeOut,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="relative z-20 mt-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 16 }}
        animate={
          taglineVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
        }
        transition={{ duration: 0.6, ease: easeOut }}
      >
        <span className="text-center font-medium uppercase tracking-[0.12em] text-[#888888] text-[clamp(14px,2vw,20px)]">
          Free tools. No limits.
        </span>
        <motion.div
          className="mt-4 h-0.5 max-w-[120px] rounded-full bg-[#DF0A09]"
          initial={{ width: 0 }}
          animate={taglineVisible ? { width: 120 } : { width: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: easeOut,
          }}
        />
      </motion.div>
    </div>,
    document.body
  );
}
