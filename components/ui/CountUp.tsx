"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CountUpProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  nonNumeric?: string;
  className?: string;
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function CountUp({
  target,
  duration = 2000,
  suffix = "",
  prefix = "",
  nonNumeric,
  className = "",
}: CountUpProps) {
  const [value, setValue] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    if (nonNumeric) {
      setVisible(true);
      hasAnimated.current = true;
      return;
    }
    hasAnimated.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.round(easeOut(progress) * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, target, duration, nonNumeric]);

  if (nonNumeric) {
    return (
      <span
        ref={ref}
        className={className}
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        {nonNumeric}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {prefix}{value}{suffix}
    </span>
  );
}
