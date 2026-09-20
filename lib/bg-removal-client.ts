import type { WorkerInMessage, WorkerOutMessage } from "./bg-removal.worker";

export type BgRemovalProgress = {
  phase: "download" | "inference";
  /** 0-100 when determinate; null when inference has no useful total */
  percent: number | null;
};

type Pending = {
  resolve: (blob: Blob) => void;
  reject: (err: Error) => void;
  onProgress?: (p: BgRemovalProgress) => void;
};

let worker: Worker | null = null;
let workerGeneration = 0;
let seq = 0;
const pending = new Map<string, Pending>();

function publicPath(): string {
  return new URL("/bg-removal/", window.location.origin).href;
}

function rejectAll(err: Error) {
  pending.forEach((p) => p.reject(err));
  pending.clear();
}

function attachWorkerHandlers(w: Worker, generation: number) {
  w.onmessage = (event: MessageEvent<WorkerOutMessage>) => {
    if (generation !== workerGeneration) return;
    const msg = event.data;
    if (!msg?.id) return;
    const entry = pending.get(msg.id);
    if (!entry) return;

    if (msg.type === "progress") {
      const percent =
        msg.phase === "download" && msg.total > 0
          ? Math.round((msg.current / msg.total) * 100)
          : msg.phase === "inference" && msg.total > 0
            ? Math.round((msg.current / msg.total) * 100)
            : null;
      entry.onProgress?.({
        phase: msg.phase,
        percent: msg.phase === "inference" && !(msg.total > 0) ? null : percent,
      });
      return;
    }

    if (msg.type === "result") {
      pending.delete(msg.id);
      entry.resolve(new Blob([msg.buffer], { type: msg.mimeType || "image/png" }));
      return;
    }

    if (msg.type === "error") {
      pending.delete(msg.id);
      entry.reject(new Error(msg.message || "Background removal failed"));
    }
  };

  w.onerror = (event) => {
    if (generation !== workerGeneration) return;
    console.error("[Ozaar BgRemover worker]", event);
    rejectAll(new Error(event.message || "Background removal worker crashed"));
    recreateWorker();
  };

  w.onmessageerror = () => {
    if (generation !== workerGeneration) return;
    rejectAll(new Error("Background removal worker message error"));
    recreateWorker();
  };
}

function recreateWorker() {
  workerGeneration += 1;
  try {
    worker?.terminate();
  } catch {
    /* ignore */
  }
  worker = null;
}

function getWorker(): Worker {
  if (typeof window === "undefined") {
    throw new Error("Background removal worker is browser-only");
  }
  if (!worker) {
    const generation = workerGeneration;
    worker = new Worker(new URL("./bg-removal.worker.ts", import.meta.url));
    attachWorkerHandlers(worker, generation);
  }
  return worker;
}

/**
 * Run background removal in a persistent Web Worker so the UI thread stays responsive.
 * The worker keeps the IMG.LY/ORT session warm across calls (no re-download on every click).
 */
export function removeBackgroundInWorker(
  file: File | Blob,
  options?: { onProgress?: (p: BgRemovalProgress) => void }
): Promise<Blob> {
  const id = `bg-${++seq}-${Date.now()}`;
  const w = getWorker();

  return new Promise<Blob>((resolve, reject) => {
    pending.set(id, { resolve, reject, onProgress: options?.onProgress });

    file
      .arrayBuffer()
      .then((buffer) => {
        const msg: WorkerInMessage = {
          id,
          type: "remove",
          buffer,
          mimeType: file.type || "application/octet-stream",
          publicPath: publicPath(),
        };
        w.postMessage(msg, [buffer]);
      })
      .catch((err) => {
        pending.delete(id);
        reject(err instanceof Error ? err : new Error(String(err)));
      });
  });
}
