/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Prevent Node.js-only deps bundled by @imgly/background-removal from reaching the server
    if (isServer) {
      config.externals.push("sharp", "onnxruntime-node");
    }

    // onnxruntime-web ships ES modules with import.meta - tell webpack to treat them as ESM
    // so Terser doesn't choke on `import.meta.url`
    config.module.rules.push({
      test: /[\\/]node_modules[\\/]onnxruntime-web[\\/].*\.mjs$/,
      type: "javascript/esm",
    });

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
