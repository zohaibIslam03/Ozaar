type OrtNamespace = {
  InferenceSession: unknown;
  env: { wasm: Record<string, unknown> };
  [key: string]: unknown;
};

declare global {
  // ORT UMD attaches here in both window and worker scopes
  // eslint-disable-next-line no-var
  var ort: OrtNamespace | undefined;

  function importScripts(...urls: string[]): void;

  interface Window {
    ort?: OrtNamespace;
  }
}

let ortLoadPromise: Promise<void> | null = null;

function hasOrt(): boolean {
  return typeof globalThis !== "undefined" && !!globalThis.ort?.InferenceSession;
}

/**
 * Load the self-hosted onnxruntime-web UMD build so webpack never transforms
 * ort.bundle.min.mjs (import.meta.url / RelativeURL breakage on Next 14).
 * Works in the main thread (script tag) and in module workers (fetch + eval).
 */
export function ensureOrtRuntime(): Promise<void> {
  if (typeof globalThis === "undefined") {
    return Promise.reject(new Error("ONNX Runtime requires a browser runtime"));
  }

  if (hasOrt()) {
    return Promise.resolve();
  }

  if (ortLoadPromise) return ortLoadPromise;

  ortLoadPromise = (async () => {
    // Dedicated workers (classic): importScripts is available
    if (typeof importScripts === "function") {
      importScripts("/bg-removal/ort.min.js");
      if (!hasOrt() && typeof ort !== "undefined") {
        globalThis.ort = ort;
      }
      if (!hasOrt()) {
        throw new Error("ONNX Runtime failed to initialize via importScripts");
      }
      return;
    }

    // Module workers: no DOM / no importScripts — evaluate UMD onto globalThis
    if (typeof document === "undefined") {
      const res = await fetch("/bg-removal/ort.min.js");
      if (!res.ok) {
        throw new Error(`Failed to fetch ONNX Runtime (${res.status})`);
      }
      const code = await res.text();
      // UMD ends with `var ort = ...`; return it and assign to globalThis
      const ortValue = new Function(`${code}\n;return typeof ort !== "undefined" ? ort : null;`)();
      if (!ortValue?.InferenceSession) {
        throw new Error("ONNX Runtime failed to initialize in worker");
      }
      globalThis.ort = ortValue;
      return;
    }

    // Main thread: inject classic script tag
    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>("script[data-ozaar-ort]");
      if (existing) {
        if (hasOrt()) {
          resolve();
          return;
        }
        existing.addEventListener("load", () => {
          if (hasOrt()) resolve();
          else reject(new Error("ONNX Runtime failed to initialize after script load"));
        });
        existing.addEventListener("error", () =>
          reject(new Error("Failed to load ONNX Runtime from /bg-removal/ort.min.js"))
        );
        return;
      }

      const script = document.createElement("script");
      script.src = "/bg-removal/ort.min.js";
      script.async = true;
      script.dataset.ozaarOrt = "1";
      script.onload = () => {
        if (hasOrt()) resolve();
        else reject(new Error("ONNX Runtime failed to initialize after script load"));
      };
      script.onerror = () => {
        ortLoadPromise = null;
        reject(new Error("Failed to load ONNX Runtime from /bg-removal/ort.min.js"));
      };
      document.head.appendChild(script);
    });
  })().catch((err) => {
    ortLoadPromise = null;
    throw err;
  });

  return ortLoadPromise;
}
