import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: { absolute: "About Ozaar | Ozaar" },
  description:
    "Learn how Ozaar works: 12 free, open-source browser tools with no signup, no ads, and no data leaving your device.",
  alternates: {
    canonical: "https://ozaar.theinnovations.tech/about",
  },
  openGraph: {
    title: "About Ozaar",
    description:
      "12 free, open-source browser tools. No signup, no ads, no tracking. All processing stays in your browser.",
    url: "https://ozaar.theinnovations.tech/about",
    siteName: "Ozaar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Ozaar",
    description: "12 free, open-source browser tools. No signup, no ads, no tracking.",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
