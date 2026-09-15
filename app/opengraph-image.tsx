import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Ozaar — Free Online Tools for Everyone";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FAFAFA",
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
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "#DF0A09",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(223,10,9,0.08)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              background: "#DF0A09",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 36,
              fontWeight: 900,
            }}
          >
            O
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "#111",
              letterSpacing: "-2px",
            }}
          >
            Ozaar
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 900,
            color: "#111",
            textAlign: "center",
            letterSpacing: "-2px",
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          <span>12 Free Tools. </span>
          <span style={{ color: "#DF0A09" }}>No Signup.</span>
        </div>

        <div
          style={{
            fontSize: 24,
            color: "#666",
            marginTop: 20,
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          Compress images, build resumes, generate QR codes & more. 100% browser-based. Forever free.
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 40,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 900,
          }}
        >
          {[
            "Image Compressor",
            "Resume Builder",
            "QR Generator",
            "Background Remover",
            "PDF Toolkit",
            "Password Generator",
          ].map((tool) => (
            <div
              key={tool}
              style={{
                background: "#F5F5F5",
                border: "1.5px solid #E8E8E8",
                borderRadius: 999,
                padding: "8px 20px",
                fontSize: 18,
                fontWeight: 600,
                color: "#111",
                display: "flex",
              }}
            >
              {tool}
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 18,
            color: "#999",
            letterSpacing: "0.05em",
          }}
        >
          ozaar.theinnovations.tech
        </div>
      </div>
    ),
    { ...size }
  );
}
