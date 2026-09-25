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
import { PUBLISHER, SITE_URL } from "@/lib/site";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Ozaar",
  alternateName: ["Ozaar Tools", "Ozaar Free Online Tools"],
  url: SITE_URL,
  description:
    "12 free open-source browser tools. PDF, image, QR, resume, currency and more. No signup required.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: PUBLISHER.name,
  url: PUBLISHER.url,
  description: "Technology company that builds and publishes Ozaar.",
  brand: {
    "@type": "Brand",
    name: "Ozaar",
    url: SITE_URL,
  },
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "Ozaar",
      alternateName: ["Ozaar Tools", "Ozaar Free Online Tools"],
      url: SITE_URL,
      applicationCategory: "UtilitiesApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free Online Tools",
  description: "A curated collection of 12 free, open-source browser tools.",
  numberOfItems: tools.length,
  itemListElement: tools.map((tool, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: tool.name,
    url: `${SITE_URL}/tools/${tool.slug}`,
    description: tool.desc,
  })),
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
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
