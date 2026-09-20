/**
 * Browser-only shim for onnxruntime-web.
 *
 * Next.js 14 webpack rewrites import.meta.url inside ort.bundle.min.mjs into a
 * non-string value, which breaks webpack's RelativeURL helper
 * (TypeError: url.replace is not a function).
 *
 * We load the official UMD build from /bg-removal/ort.min.js (unbundled) and
 * re-export window.ort so @imgly/background-removal can import("onnxruntime-web")
 * without webpack transforming the ORT runtime.
 *
 * IMPORTANT: do not .bind() values retrieved from ort; InferenceSession is a
 * constructor function whose static `.create` must remain intact.
 */

function getOrt() {
  if (typeof globalThis === "undefined" || !globalThis.ort) {
    throw new Error(
      "ONNX Runtime is not loaded. Ensure /bg-removal/ort.min.js is loaded before background removal."
    );
  }
  return globalThis.ort;
}

const ortProxy = new Proxy(
  {},
  {
    get(_target, prop) {
      if (prop === "__esModule") return true;
      if (prop === "then") return undefined;
      return getOrt()[prop];
    },
    has(_target, prop) {
      return prop in getOrt();
    },
    ownKeys() {
      return Reflect.ownKeys(getOrt());
    },
    getOwnPropertyDescriptor(_target, prop) {
      if (prop === "__esModule") {
        return { configurable: true, enumerable: false, value: true };
      }
      return Object.getOwnPropertyDescriptor(getOrt(), prop);
    },
  }
);

export default ortProxy;
