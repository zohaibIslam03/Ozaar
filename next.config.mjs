/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Prevent Node.js-only deps bundled by @imgly/background-removal from reaching the server
    if (isServer) {
      config.externals.push("sharp", "onnxruntime-node");
    }

    // onnxruntime-web ships ES modules with import.meta — tell webpack to treat them as ESM
    // so Terser doesn't choke on `import.meta.url`
    config.module.rules.push({
      test: /[\\/]node_modules[\\/]onnxruntime-web[\\/].*\.mjs$/,
      type: "javascript/esm",
    });

    return config;
  },
};

export default nextConfig;
