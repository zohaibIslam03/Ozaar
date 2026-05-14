import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { ToastProvider } from "@/components/Toast";
import BackToTop from "@/components/BackToTop";
import LenisProvider from "@/components/ui/LenisProvider";
import CursorFollower from "@/components/ui/CursorFollower";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ozaar.theinnovations.tech"),
  title: {
    default: "Free Online Tools | Ozaar",
    template: "%s | Ozaar",
  },
  icons: {
    icon: [{ url: "/ozaar-icon.png", type: "image/png" }],
    shortcut: "/ozaar-icon.png",
    apple: "/ozaar-icon.png",
  },
  description:
    "12 free open-source tools for everyone. PDF, image, QR, resume, currency and more. No signup. No ads. No limits.",
  keywords: [
    "free online tools",
    "browser tools",
    "pdf tools",
    "image compressor",
    "qr generator",
    "password generator",
    "open source",
    "no signup tools",
  ],
  openGraph: {
    title: "Free Online Tools | Ozaar",
    description:
      "12 free open-source tools for everyone. PDF, image, QR, resume, currency and more. No signup. No ads. No limits.",
    url: "https://ozaar.theinnovations.tech",
    siteName: "Ozaar",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Tools | Ozaar",
    description:
      "12 free open-source tools for everyone. No signup. No ads. No limits.",
  },
  alternates: {
    canonical: "https://ozaar.theinnovations.tech",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="bg-brand-bg text-brand-text font-sans antialiased min-h-screen flex flex-col">
        <LenisProvider>
          <ToastProvider>
            <CursorFollower />
            <Navbar />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <BackToTop />
          </ToastProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
