"use client";

import { useState } from "react";

const ITEMS = [
  "PDF Toolkit",
  "Image Compressor",
  "QR Generator",
  "Password Generator",
  "Color Palette",
  "Word Counter",
  "Image Resizer",
  "Background Remover",
  "Resume Builder",
  "Age Calculator",
  "Currency Converter",
  "Unit Converter",
];

export default function MarqueeStrip() {
  const [paused, setPaused] = useState(false);

  const items = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div
      className="bg-[#111111] h-12 overflow-hidden flex items-center select-none cursor-default"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{`
        @keyframes marquee-dark {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        .marquee-dark {
          display: flex;
          white-space: nowrap;
          animation: marquee-dark 30s linear infinite;
          will-change: transform;
        }
        .marquee-dark.paused {
          animation-play-state: paused;
        }
      `}</style>
      <div className={`marquee-dark${paused ? " paused" : ""}`}>
        {items.map((name, i) => (
          <span
            key={i}
            className="inline-flex items-center shrink-0 text-[13px] font-medium tracking-[0.04em] text-white/60 px-4"
          >
            {name}
            <span className="ml-4 text-[#444]" aria-hidden>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
