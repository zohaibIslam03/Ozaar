import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: { absolute: "About The Innovations Tools | The Innovations" },
  description:
    "Learn how The Innovations Tools works — 12 free, open-source browser tools with no signup, no ads, and no data leaving your device.",
  alternates: {
    canonical: "https://tools.theinnovations.tech/about",
  },
  openGraph: {
    title: "About The Innovations Tools",
    description:
      "12 free, open-source browser tools. No signup, no ads, no tracking. All processing stays in your browser.",
    url: "https://tools.theinnovations.tech/about",
    siteName: "The Innovations Tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About The Innovations Tools",
    description: "12 free, open-source browser tools. No signup, no ads, no tracking.",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
