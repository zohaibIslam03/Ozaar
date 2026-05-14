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

/** Curtain delay + duration + small buffer after phase "exit" */
const EXIT_UNMOUNT_MS = 1100;

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

  useEffect(() => {
    if (phase !== "exit") return;
    const t = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete();
    }, EXIT_UNMOUNT_MS);
    return () => window.clearTimeout(t);
  }, [phase, onComplete]);

  const glowActive = phase === "shadow" || phase === "tagline" || phase === "exit";
  const taglineVisible = phase === "tagline" || phase === "exit";
  const exitActive = phase === "exit";

  return createPortal(
    <div className="pointer-events-auto fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-transparent">
      <motion.div
        className="pointer-events-none absolute left-0 top-0 z-10 h-1/2 w-full bg-white"
        initial={false}
        animate={exitActive ? { y: "-100%" } : { y: "0%" }}
        transition={{
          duration: 0.78,
          delay: exitActive ? 0.2 : 0,
          ease: easeCurtain,
        }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-1/2 w-full bg-white"
        initial={false}
        animate={exitActive ? { y: "100%" } : { y: "0%" }}
        transition={{
          duration: 0.78,
          delay: exitActive ? 0.2 : 0,
          ease: easeCurtain,
        }}
      />

      <motion.div
        className="pointer-events-none absolute left-[10%] top-[55%] z-[11] h-[30%] w-[80%] rounded-full bg-[#DF0A09] blur-[80px] sm:left-[20%] sm:w-[60%]"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={
          exitActive
            ? { opacity: 0, scale: 0.92 }
            : glowActive
              ? { opacity: 0.18, scale: 1 }
              : { opacity: 0, scale: 0.3 }
        }
        transition={{
          duration: exitActive ? 0.55 : 0.8,
          ease: exitActive ? easeOut : "easeOut",
        }}
      />

      {/* Letters + tagline + line move as one stack; fade first on exit, then curtains */}
      <motion.div
        className="relative z-20 flex flex-col items-center [perspective:800px]"
        initial={false}
        animate={
          exitActive
            ? { opacity: 0, y: -12 }
            : { opacity: 1, y: 0 }
        }
        transition={
          exitActive
            ? { duration: 0.52, ease: easeOut }
            : { duration: 0 }
        }
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

        <motion.div
          className="mt-6 flex max-w-[min(92vw,28rem)] flex-col items-center px-2"
          initial={{ opacity: 0, y: 16 }}
          animate={
            taglineVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
          }
          transition={{ duration: 0.55, ease: easeOut }}
        >
          <p className="text-center text-[clamp(12px,1.75vw,19px)] font-medium uppercase leading-snug tracking-[0.1em] sm:tracking-[0.12em]">
            <span className="text-[#888888]">Free tools. No limits. </span>
            <span className="font-extrabold normal-case text-[#DF0A09]">Ozaar</span>
          </p>
          <motion.div
            className="mt-4 h-0.5 w-full max-w-[min(22rem,85vw)] origin-left rounded-full bg-[#DF0A09]"
            initial={{ scaleX: 0 }}
            animate={taglineVisible ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.18,
              ease: easeOut,
            }}
          />
        </motion.div>
      </motion.div>
    </div>,
    document.body
  );
}
