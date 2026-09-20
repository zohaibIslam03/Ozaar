import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "About Ozaar | Free Open-Source Browser Tools" },
  description:
    "Learn how Ozaar works: 12 free, open-source browser tools with no signup, no ads, and no data leaving your device. Built by Involiq.",
  alternates: {
    canonical: absoluteUrl("/about"),
  },
  openGraph: {
    title: "About Ozaar",
    description:
      "12 free, open-source browser tools. No signup, no ads, no tracking. All processing stays in your browser.",
    url: absoluteUrl("/about"),
    siteName: SITE_NAME,
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
    title: "About Ozaar",
    description: "12 free, open-source browser tools. No signup, no ads, no tracking.",
    images: ["/twitter-image"],
  },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return <AboutContent />;
}
