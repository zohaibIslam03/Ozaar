"use client";

import { useCallback, useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import MarqueeStrip from "@/components/MarqueeStrip";
import TrustBar from "@/components/sections/TrustBar";
import ToolsGrid from "@/components/ToolsGrid";
import LiveDemo from "@/components/sections/LiveDemo";
import ToolSpotlight from "@/components/sections/ToolSpotlight";
import WhoSection from "@/components/sections/WhoSection";
import WhyStatements from "@/components/sections/WhyStatements";
import HowItWorks from "@/components/HowItWorks";
import PrivacySection from "@/components/sections/PrivacySection";
import TrustSection from "@/components/TrustSection";
import OpenSourceSection from "@/components/sections/OpenSourceSection";
import ToolFinder from "@/components/sections/ToolFinder";
import FinalCTA from "@/components/FinalCTA";
import IntroLoader from "@/components/ui/IntroLoader";
import { tools } from "@/lib/tools";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://ozaar.theinnovations.tech/#website",
      url: "https://ozaar.theinnovations.tech",
      name: "Ozaar",
      description: "12 free browser-based tools for everyone.",
      publisher: { "@id": "https://ozaar.theinnovations.tech/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://ozaar.theinnovations.tech/#organization",
      name: "The Innovations",
      url: "https://theinnovations.tech",
      logo: {
        "@type": "ImageObject",
        url: "https://ozaar.theinnovations.tech/og-image.png",
      },
      sameAs: [
        "https://www.facebook.com/theinnovations.tech",
        "https://www.instagram.com/theinnovations.tech/",
        "https://www.linkedin.com/company/theinnovations/",
        "https://github.com/zohaibIslam03/Ozaar",
      ],
    },
    {
      "@type": "ItemList",
      name: "Free Online Tools",
      description: "12 free browser-based tools",
      numberOfItems: 12,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Image Compressor",
          url: "https://ozaar.theinnovations.tech/tools/image-compressor",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Resume Builder",
          url: "https://ozaar.theinnovations.tech/tools/resume-builder",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "QR Code Generator",
          url: "https://ozaar.theinnovations.tech/tools/qr-generator",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Background Remover",
          url: "https://ozaar.theinnovations.tech/tools/bg-remover",
        },
        {
          "@type": "ListItem",
          position: 5,
          name: "PDF Toolkit",
          url: "https://ozaar.theinnovations.tech/tools/pdf-toolkit",
        },
        {
          "@type": "ListItem",
          position: 6,
          name: "Password Generator",
          url: "https://ozaar.theinnovations.tech/tools/password-generator",
        },
        {
          "@type": "ListItem",
          position: 7,
          name: "Color Palette Generator",
          url: "https://ozaar.theinnovations.tech/tools/color-palette",
        },
        {
          "@type": "ListItem",
          position: 8,
          name: "Word Counter",
          url: "https://ozaar.theinnovations.tech/tools/word-counter",
        },
        {
          "@type": "ListItem",
          position: 9,
          name: "Image Resizer",
          url: "https://ozaar.theinnovations.tech/tools/image-resizer",
        },
        {
          "@type": "ListItem",
          position: 10,
          name: "Age Calculator",
          url: "https://ozaar.theinnovations.tech/tools/age-calculator",
        },
        {
          "@type": "ListItem",
          position: 11,
          name: "Currency Converter",
          url: "https://ozaar.theinnovations.tech/tools/currency-converter",
        },
        {
          "@type": "ListItem",
          position: 12,
          name: "Unit Converter",
          url: "https://ozaar.theinnovations.tech/tools/unit-converter",
        },
      ],
    },
  ],
};

export default function HomePage() {
  const [showLoader, setShowLoader] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Full document reload (F5, Ctrl+Shift+R, etc.): play intro again.
    // Browsers do not expose "hard" vs "soft" reload separately; both are type "reload".
    if (typeof performance !== "undefined") {
      const nav = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming | undefined;
      if (nav?.type === "reload") {
        sessionStorage.removeItem("intro-played");
      }
    }

    const played = sessionStorage.getItem("intro-played");
    if (!played) {
      setShowLoader(true);
    } else {
      setLoaderDone(true);
    }
    setHydrated(true);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    sessionStorage.setItem("intro-played", "true");
    setShowLoader(false);
    setLoaderDone(true);
  }, []);

  const contentVisible =
    hydrated && (loaderDone || !showLoader);

  return (
    <>
      {showLoader && <IntroLoader onComplete={handleLoaderComplete} />}
      <div
        className={
          contentVisible
            ? "opacity-100 transition-opacity duration-500"
            : "opacity-0"
        }
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <HeroSection />
        <MarqueeStrip />
        <TrustBar />
        <ToolsGrid tools={tools} />
        <ToolSpotlight />
        <LiveDemo />
        <WhoSection />
        <HowItWorks />
        <WhyStatements />
        <PrivacySection />
        <ToolFinder />
        <OpenSourceSection />
        <TrustSection />
        <FinalCTA />
      </div>
    </>
  );
}
