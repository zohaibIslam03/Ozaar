import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ortWebShim = path.join(__dirname, "lib/ort-web-shim.js");
const ortServerStub = path.join(__dirname, "lib/ort-server-stub.js");
const imglyServerStub = path.join(__dirname, "lib/imgly-server-stub.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep ORT / IMG.LY out of the RSC server bundle entirely
  experimental: {
    serverComponentsExternalPackages: [
      "onnxruntime-web",
      "@imgly/background-removal",
    ],
  },

  webpack: (config, { isServer, webpack }) => {
    // Prevent Node.js-only deps from being required on the server
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("sharp", "onnxruntime-node");
    }

    // Client: use UMD-backed browser shim (avoids webpack mangling ort.bundle.min.mjs).
    // Server: stub both packages so webpack never resolves ort.node.min.mjs.
    const ortTarget = isServer ? ortServerStub : ortWebShim;
    config.resolve.alias = {
      ...config.resolve.alias,
      // Exact + bare package names (cover package.json "exports" resolution)
      "onnxruntime-web$": ortTarget,
      "onnxruntime-web": ortTarget,
      "onnxruntime-web/webgpu$": ortTarget,
      "onnxruntime-web/webgpu": ortTarget,
      ...(isServer
        ? {
            "@imgly/background-removal$": imglyServerStub,
            "@imgly/background-removal": imglyServerStub,
          }
        : {}),
    };

    // Aliases alone do not rewrite dynamic import("onnxruntime-web/webgpu") from IMG.LY.
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^onnxruntime-web\/webgpu$/,
        ortTarget
      )
    );

    return config;
  },

  async redirects() {
    return [
      // Force HTTPS (handled by hosting but add as backup)
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-proto", value: "http" }],
        destination: "https://ozaar.theinnovations.tech/:path*",
        permanent: true,
      },
      // Force non-www
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ozaar.theinnovations.tech" }],
        destination: "https://ozaar.theinnovations.tech/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
