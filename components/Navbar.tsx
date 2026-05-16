"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

const navLinks = [
  { label: "Tools", href: "/#tools" },
  { label: "About", href: "/about" },
];

const GITHUB_SVG = (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setIsOpen(false), [pathname]);

  const isActive = (href: string) => {
    if (href === "/#tools") return pathname === "/";
    return pathname === href;
  };

  return (
    <>
      <nav
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          height: "72px",
          background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid #E8E8E8" : "1px solid transparent",
          boxShadow: scrolled ? "0 1px 24px rgba(0,0,0,0.06)" : "none",
        }}
      >
        {/* Scroll progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-red origin-left"
          style={{ scaleX }}
        />

        <div className="container h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Image
              src="/ozaar-icon.png"
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 object-contain shrink-0"
              priority
            />
            <span className="font-heading font-bold text-brand-text text-[15px] tracking-tight group-hover:text-brand-red transition-colors duration-200">
              Ozaar
            </span>
          </Link>

          {/* Desktop center nav */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-brand-text bg-[#F2F2F2]"
                    : "text-brand-muted hover:text-brand-text hover:bg-[#F7F7F7]"
                }`}
              >
                {isActive(link.href) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0" />
                )}
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/zohaibIslam03/Ozaar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-brand-muted hover:text-brand-text hover:bg-[#F7F7F7] transition-all duration-200"
            >
              {GITHUB_SVG}
              GitHub
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block shrink-0">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/#tools"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#111111] text-white text-[13px] font-semibold
                  hover:bg-[#222222] transition-colors duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
              >
                Try a tool
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </motion.div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="md:hidden text-brand-muted hover:text-brand-text transition-colors p-1"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[72px] inset-x-0 z-40 border-b border-brand-border shadow-lg md:hidden"
            style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(20px)" }}
          >
            <div className="container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 py-3 px-2 text-base font-medium border-b border-brand-border transition-colors duration-200 ${
                    isActive(link.href) ? "text-brand-red" : "text-brand-muted hover:text-brand-text"
                  }`}
                >
                  {isActive(link.href) && <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />}
                  {link.label}
                </Link>
              ))}
              <a
                href="https://github.com/zohaibIslam03/Ozaar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-3 px-2 text-base font-medium text-brand-muted hover:text-brand-text transition-colors border-b border-brand-border"
              >
                {GITHUB_SVG}
                GitHub
              </a>
              <div className="pt-3">
                <Link
                  href="/#tools"
                  className="inline-flex w-full items-center justify-center gap-2 py-3 rounded-full bg-[#111111] text-white font-semibold text-sm hover:bg-[#222222] transition-colors"
                >
                  Try a tool →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
