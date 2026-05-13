"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorFollower() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const scale = useMotionValue(1);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });
  const springScale = useSpring(scale, { stiffness: 200, damping: 20 });

  const isFine = useRef(false);

  useEffect(() => {
    isFine.current =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer:fine)").matches;
    if (!isFine.current) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX - 6);
      y.set(e.clientY - 6);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-hoverable]")) {
        scale.set(2.5);
      } else {
        scale.set(1);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [x, y, scale]);

  if (typeof window !== "undefined" && !window.matchMedia("(pointer:fine)").matches) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 w-3 h-3 rounded-full bg-[#DF0A09] pointer-events-none z-[9999] mix-blend-multiply"
      style={{
        x: springX,
        y: springY,
        scale: springScale,
        opacity: 0.35,
      }}
      aria-hidden
    />
  );
}
