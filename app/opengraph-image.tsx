import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "Ozaar — Free Online Micro-Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const logoPath = join(process.cwd(), "public", "ozaar-icon.png");
  const logoBuffer = await readFile(logoPath);
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

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
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori OG renderer requires raw <img> */}
          <img
            src={logoSrc}
            width={52}
            height={52}
            alt=""
            style={{
              borderRadius: "12px",
              objectFit: "contain",
              boxShadow: "0 0 24px rgba(223,10,9,0.35)",
            }}
          />
          <span style={{ color: "#ffffff", fontSize: "26px", fontWeight: 600, letterSpacing: "-0.5px" }}>
            Ozaar
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
