"use client";

import Image from "next/image";
import Link from "next/link";
import { tools } from "@/lib/tools";

const GITHUB_SVG = (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111111] text-white">
      {/* Main grid */}
      <div className="max-w-6xl lg:max-w-none lg:w-[80vw] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Col 1, Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <Image
                src="/ozaar-icon.png"
                alt=""
                width={18}
                height={18}
                className="h-[18px] w-[18px] object-contain shrink-0 opacity-95 group-hover:opacity-100"
              />
              <span className="font-bold text-white text-sm tracking-tight group-hover:text-brand-red transition-colors duration-200">
                Ozaar
              </span>
            </Link>
            <p className="text-sm text-[#888888] leading-relaxed max-w-[200px]">
              Free, open-source browser tools built for everyone.
            </p>
            <p className="text-xs text-[#555555]">Made with ❤️ for everyone</p>
          </div>

          {/* Col 2, Tools */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest">Tools</h4>
            <ul className="flex flex-col gap-2">
              {tools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-[13px] text-[#888888] hover:text-white transition-colors duration-150"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3, Company */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest">Company</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/about" className="text-[13px] text-[#888888] hover:text-white transition-colors duration-150">
                  About
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/zohaibIslam03/Ozaar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[13px] text-[#888888] hover:text-white transition-colors duration-150"
                >
                  {GITHUB_SVG}
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/zohaibIslam03/Ozaar/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-[#888888] hover:text-white transition-colors duration-150"
                >
                  Open Source (MIT)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4, Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest">Stay Updated</h4>
            <p className="text-[13px] text-[#888888] leading-relaxed">
              Get notified when new tools launch.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-sm text-white placeholder:text-[#555555]
                  focus:outline-none focus:border-brand-red/50 transition-colors"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-brand-red text-white text-sm font-medium hover:bg-brand-redDark transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-[#2A2A2A]">
        <div className="max-w-6xl lg:max-w-none lg:w-[80vw] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#555555]">
            © {year} Ozaar. Open source under MIT.
          </p>
          <p className="text-xs text-[#555555]">No tracking. No ads. No login.</p>
        </div>
      </div>
    </footer>
  );
}
