import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getToolBySlug, tools } from "@/lib/tools";
import { getToolConfig } from "@/lib/toolConfig";

export const runtime = "nodejs";
export const alt = "Ozaar tool preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export default async function ToolOgImage({
  params,
}: {
  params: { slug: string };
}) {
  const tool = getToolBySlug(params.slug);
  const config = getToolConfig(params.slug);
  const name = config?.name ?? tool?.name ?? "Free Online Tool";
  const tagline = config
    ? `${config.tagline} ${config.taglineAccent}`
    : tool?.desc ?? "Free browser tool on Ozaar";
  const description =
    config?.metaDesc ??
    tool?.desc ??
    "Free online tool. No signup. Runs in your browser.";

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
          justifyContent: "space-between",
          padding: "56px 64px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "420px",
            height: "420px",
            background: "rgba(223,10,9,0.12)",
            borderRadius: "50%",
            filter: "blur(90px)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori OG renderer */}
          <img
            src={logoSrc}
            width={40}
            height={40}
            alt=""
            style={{ borderRadius: "10px", objectFit: "contain" }}
          />
          <span style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: 600 }}>Ozaar</span>
          <span style={{ color: "#555555", fontSize: "18px", marginLeft: "8px" }}>· Free online tools</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "920px" }}>
          <div style={{ color: "#DF0A09", fontSize: "18px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {config?.category ?? tool?.category ?? "Tools"}
          </div>
          <div
            style={{
              color: "#FFFFFF",
              fontSize: "56px",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
            }}
          >
            {name}
          </div>
          <div style={{ color: "#AAAAAA", fontSize: "26px", lineHeight: 1.35 }}>{tagline}</div>
          <div style={{ color: "#777777", fontSize: "20px", lineHeight: 1.4, maxWidth: "880px" }}>
            {description.length > 160 ? `${description.slice(0, 157)}…` : description}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            {(params.slug === "resume-builder"
              ? ["100% Free", "5 Templates", "PDF Export", "No Sign-up"]
              : ["100% Free", "No Sign-up", "In-browser"]
            ).map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #2A2A2A",
                  borderRadius: "999px",
                  color: "#999999",
                  fontSize: "15px",
                  background: "#141414",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ color: "#555555", fontSize: "16px" }}>ozaar.involiq.tech</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
