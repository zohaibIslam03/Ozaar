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
import { PUBLISHER, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Free Online Tools | Ozaar",
    template: "%s | Ozaar",
  },
  description:
    "12 free open-source tools for everyone. PDF, image, QR, resume, currency and more. No signup. No ads. No limits.",
  applicationName: SITE_NAME,
  authors: [{ name: PUBLISHER.name, url: PUBLISHER.url }],
  creator: PUBLISHER.name,
  publisher: PUBLISHER.name,
  keywords: [
    "free online tools",
    "browser tools",
    "pdf tools",
    "image compressor",
    "qr generator",
    "resume builder",
    "password generator",
    "open source",
    "no signup tools",
    "Involiq",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/ozaar-icon.png", type: "image/png", sizes: "73x73" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: undefined,
  openGraph: {
    title: "Free Online Tools | Ozaar",
    description:
      "12 free open-source tools for everyone. PDF, image, QR, resume, currency and more. No signup. No ads. No limits.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Ozaar — free online micro-tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Tools | Ozaar",
    description: SITE_TAGLINE,
    images: ["/twitter-image"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
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
