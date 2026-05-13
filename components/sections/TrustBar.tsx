"use client";

import CountUp from "@/components/ui/CountUp";

const stats = [
  { label: "Free Tools", value: 12, suffix: "+", display: "12+" },
  { label: "Signups Required", value: 0, suffix: "", display: "0" },
  { label: "Browser-Based", value: 100, suffix: "%", display: "100%" },
  { label: "Free Forever", nonNumeric: "∞" },
  { label: "Currencies Supported", value: 150, suffix: "+", display: "150+" },
];

export default function TrustBar() {
  return (
    <div
      className="w-full bg-white border-b border-[#F5F5F5]"
      style={{ padding: "48px 0" }}
    >
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-0">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-stretch gap-0 flex-1">
              {i > 0 && (
                <div className="hidden md:block w-px bg-[#F0F0F0] self-stretch mx-6" />
              )}
              <div className="flex flex-col items-center md:items-start gap-1 flex-1 text-center md:text-left">
                <div
                  style={{
                    fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                    fontSize: "clamp(28px, 3vw, 40px)",
                    fontWeight: 900,
                    color: "#111",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {stat.nonNumeric ? (
                    <CountUp nonNumeric={stat.nonNumeric} target={0} />
                  ) : (
                    <>
                      <CountUp
                        target={stat.value ?? 0}
                        suffix=""
                        duration={2000}
                      />
                      <span style={{ color: "#DF0A09" }}>{stat.suffix}</span>
                    </>
                  )}
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#888",
                    marginTop: "4px",
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
