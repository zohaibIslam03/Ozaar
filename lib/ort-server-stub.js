/**
 * SSR-safe stub for onnxruntime-web.
 * Server/edge webpack must never resolve the real ort.node.min.mjs ESM bundle
 * (Terser cannot minify its import/export syntax as a non-module asset).
 */
function unavailable() {
  throw new Error("onnxruntime-web is browser-only and is not available during SSR.");
}

const stub = new Proxy(
  {},
  {
    get(_target, prop) {
      if (prop === "__esModule") return true;
      if (prop === "then") return undefined;
      if (prop === "default") return stub;
      return unavailable;
    },
    apply() {
      unavailable();
    },
  }
);

export default stub;
