import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Explicit favicon so browsers do not fall back to a letter mark. */
export default async function Icon() {
  const logoPath = join(process.cwd(), "public", "ozaar-icon.png");
  const logoBuffer = await readFile(logoPath);
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori favicon renderer */}
        <img
          src={logoSrc}
          width={360}
          height={360}
          alt=""
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size }
  );
}
