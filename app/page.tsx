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
import { tools } from "@/lib/tools";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "The Innovations Tools",
  url: "https://tools.theinnovations.tech",
  description: "12 free open-source browser tools. PDF, image, QR, resume, currency and more. No signup required.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://tools.theinnovations.tech/?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
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
    url: `https://tools.theinnovations.tech/tools/${tool.slug}`,
    description: tool.desc,
  })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
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
    </>
  );
}
