import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { ToastProvider } from "@/components/Toast";
import BackToTop from "@/components/BackToTop";
import LenisProvider from "@/components/ui/LenisProvider";
import CursorFollower from "@/components/ui/CursorFollower";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const BASE_URL = "https://ozaar.theinnovations.tech";

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
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Ozaar – Free Online Tools | Browser-Based Utilities, No Signup",
    template: "%s | Ozaar Free Tools",
  },

  description:
    "Ozaar is a free online tools site with browser-based image, PDF, QR, converter and productivity utilities. Compress images, remove backgrounds, build resumes, generate QR codes and more — no signup, no ads.",

  keywords: [
    "free online tools",
    "image compressor",
    "resume builder free",
    "QR code generator",
    "background remover free",
    "PDF toolkit online",
    "password generator",
    "color palette generator",
    "currency converter",
    "unit converter",
    "word counter",
    "image resizer",
    "free tools no signup",
    "browser based tools",
    "Ozaar tools",
    "The Innovations tools",
  ],

  authors: [{ name: "The Innovations", url: "https://theinnovations.tech" }],
  creator: "The Innovations",
  publisher: "The Innovations",

  alternates: {
    canonical: BASE_URL,
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Ozaar – Free Online Tools",
    title: "Ozaar – Free Online Tools | No Signup. No Ads.",
    description:
      "Ozaar provides free browser-based tools for images, PDFs, QR codes, converters and everyday productivity. Private by design — processing stays on your device.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Ozaar – Free Online Tools",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ozaar – Free Online Tools | No Signup. No Ads.",
    description:
      "Free browser-based image, PDF, QR and productivity tools from Ozaar. No account needed.",
    images: [`${BASE_URL}/og-image.png`],
    creator: "@theinnovations",
    site: "@theinnovations",
  },

  applicationName: "Ozaar – Free Online Tools",
  category: "Technology",
  classification: "Free Online Tools",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#DF0A09",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch */}
        <link rel="dns-prefetch" href="https://open.er-api.com" />

        {/* Apple/PWA meta */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ozaar" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Geo meta (Pakistan-based company, global service) */}
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Lahore" />
        <meta name="language" content="English" />
      </head>
      <body className="bg-brand-bg text-brand-text font-sans antialiased min-h-screen flex flex-col">
        <GoogleAnalytics />
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
