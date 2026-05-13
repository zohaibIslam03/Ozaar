"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastVariant = "success" | "error" | "info";

type ToastFn = (msg: string, variant?: ToastVariant) => void;

interface ToastItem {
  id: number;
  msg: string;
  variant: ToastVariant;
}

const ToastContext = createContext<ToastFn>(() => {});

export const useToast = () => useContext(ToastContext);

const borderColor: Record<ToastVariant, string> = {
  success: "border-l-green-500",
  error:   "border-l-brand-red",
  info:    "border-l-brand-text",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback<ToastFn>((msg, variant = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, variant }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={`pointer-events-auto bg-white border border-brand-border border-l-4 ${borderColor[t.variant]}
                rounded-lg px-4 py-3 text-sm text-brand-text font-medium shadow-lg min-w-[200px] max-w-[320px]`}
            >
              {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
