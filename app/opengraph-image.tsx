import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "The Innovations Tools — Free Online Micro-Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "350px",
            background: "rgba(223,10,9,0.07)",
            borderRadius: "50%",
            filter: "blur(120px)",
          }}
        />

        {/* Logo mark */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "36px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              background: "#DF0A09",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              boxShadow: "0 0 24px rgba(223,10,9,0.5)",
            }}
          >
            ⚡
          </div>
          <span style={{ color: "#ffffff", fontSize: "26px", fontWeight: 600, letterSpacing: "-0.5px" }}>
            The Innovations
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            fontSize: "68px",
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-2px",
            marginBottom: "20px",
          }}
        >
          Tiny tools.&nbsp;
          <span style={{ color: "#DF0A09" }}>Big impact.</span>
        </div>

        {/* Subtext */}
        <div style={{ fontSize: "24px", color: "#888888", textAlign: "center", maxWidth: "640px" }}>
          Free, open-source micro-tools for everyone. No sign-up required.
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: "12px", marginTop: "44px" }}>
          {["12 Tools", "100% Free", "No Sign-up", "Open Source"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 18px",
                border: "1px solid #222222",
                borderRadius: "999px",
                color: "#888888",
                fontSize: "16px",
                background: "#111111",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
