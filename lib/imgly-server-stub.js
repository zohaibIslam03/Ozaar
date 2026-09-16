/**
 * SSR-safe stub for @imgly/background-removal.
 * Keeps the IMG.LY package (and its onnxruntime-web imports) out of the
 * server webpack graph so ort.node.min.mjs is never emitted or minified.
 */
async function browserOnly() {
  throw new Error(
    "@imgly/background-removal is browser-only and cannot run during SSR."
  );
}

export const removeBackground = browserOnly;
export const removeForeground = browserOnly;
export const segment = browserOnly;
export default {
  removeBackground,
  removeForeground,
  segment,
};
