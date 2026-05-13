"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFoundClient() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center px-4 pt-40 pb-24 gap-6"
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-8xl font-bold text-brand-red tabular-nums select-none"
        aria-hidden
      >
        404
      </motion.span>
      <h1 className="text-2xl font-semibold text-brand-text">Tool not found</h1>
      <p className="text-brand-muted text-sm max-w-sm leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        All 12 tools are available from the homepage.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-red text-brand-text text-sm font-medium hover:bg-brand-red/90 transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all tools
      </Link>
    </motion.div>
  );
}
