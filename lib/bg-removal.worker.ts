/// <reference lib="webworker" />

/**
 * Dedicated Web Worker for IMG.LY background removal.
 * Keeps ONNX inference off the main/UI thread (CPU path cannot use proxyToWorker).
 */

export type WorkerInMessage =
  | {
      id: string;
      type: "remove";
      buffer: ArrayBuffer;
      mimeType: string;
      publicPath: string;
    }
  | { id: string; type: "ping" };

export type WorkerOutMessage =
  | { id: string; type: "pong" }
  | {
      id: string;
      type: "progress";
      phase: "download" | "inference";
      current: number;
      total: number;
    }
  | { id: string; type: "result"; buffer: ArrayBuffer; mimeType: string }
  | { id: string; type: "error"; message: string };

type RemoveBackgroundFn = (
  image: Blob,
  config?: Record<string, unknown>
) => Promise<Blob>;

let removeBackgroundFn: RemoveBackgroundFn | null = null;
let initPromise: Promise<RemoveBackgroundFn> | null = null;

async function getRemoveBackground(): Promise<RemoveBackgroundFn> {
  if (removeBackgroundFn) return removeBackgroundFn;
  if (!initPromise) {
    initPromise = (async () => {
      const { ensureOrtRuntime } = await import("./ensure-ort-runtime");
      await ensureOrtRuntime();
      const mod = await import("@imgly/background-removal");
      removeBackgroundFn = mod.removeBackground as RemoveBackgroundFn;
      return removeBackgroundFn;
    })().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

const ctx: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope;

ctx.onmessage = async (event: MessageEvent<WorkerInMessage>) => {
  const msg = event.data;
  if (!msg || typeof msg !== "object") return;

  if (msg.type === "ping") {
    ctx.postMessage({ id: msg.id, type: "pong" } satisfies WorkerOutMessage);
    return;
  }

  if (msg.type !== "remove") return;

  try {
    const removeBackground = await getRemoveBackground();
    const blob = new Blob([msg.buffer], { type: msg.mimeType || "image/png" });

    const result = await removeBackground(blob, {
      publicPath: msg.publicPath,
      model: "isnet_quint8",
      device: "cpu",
      // IMG.LY only honors proxyToWorker with WebGPU; CPU inference stays in this worker.
      proxyToWorker: false,
      progress: (key: string, current: number, total: number) => {
        const keyStr = String(key);
        const phase =
          keyStr.includes("fetch") ||
          keyStr.includes("wasm") ||
          keyStr.includes("onnx") ||
          keyStr.includes("model")
            ? "download"
            : "inference";
        const out: WorkerOutMessage = {
          id: msg.id,
          type: "progress",
          phase,
          current,
          total,
        };
        ctx.postMessage(out);
      },
    });

    const buffer = await result.arrayBuffer();
    const out: WorkerOutMessage = {
      id: msg.id,
      type: "result",
      buffer,
      mimeType: result.type || "image/png",
    };
    ctx.postMessage(out, [buffer]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const out: WorkerOutMessage = { id: msg.id, type: "error", message };
    ctx.postMessage(out);
  }
};

export {};
