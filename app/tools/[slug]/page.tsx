import { notFound } from "next/navigation";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getToolBySlug, tools } from "@/lib/tools";
import { getToolConfig } from "@/lib/toolConfig";
import ToolHero from "@/components/tool-page/ToolHero";
import ToolWorkspace from "@/components/tool-page/ToolWorkspace";
import ToolHowItWorks from "@/components/tool-page/ToolHowItWorks";
import ToolFeatures from "@/components/tool-page/ToolFeatures";
import ToolUseCases from "@/components/tool-page/ToolUseCases";
import ToolSEOContent from "@/components/tool-page/ToolSEOContent";
import ToolFAQ from "@/components/tool-page/ToolFAQ";
import RelatedTools from "@/components/tool-page/RelatedTools";
import ToolCTABanner from "@/components/tool-page/ToolCTABanner";
import PdfToolkit from "@/components/tools/PdfToolkit";
import ImageCompressor from "@/components/tools/ImageCompressor";
import QrGenerator from "@/components/tools/QrGenerator";
import PasswordGenerator from "@/components/tools/PasswordGenerator";
import ColorPalette from "@/components/tools/ColorPalette";
import WordCounter from "@/components/tools/WordCounter";
import ImageResizer from "@/components/tools/ImageResizer";
import AgeCalculator from "@/components/tools/AgeCalculator";
import CurrencyConverter from "@/components/tools/CurrencyConverter";
import UnitConverter from "@/components/tools/UnitConverter";

const BgRemover = dynamic(() => import("@/components/tools/BgRemover"), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse bg-[#F7F7F7] rounded-xl" />,
});

const ResumeBuilder = dynamic(() => import("@/components/tools/ResumeBuilder"), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse bg-[#F7F7F7] rounded-xl" />,
});

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  const config = getToolConfig(params.slug);
  if (!tool) return { title: "Tool Not Found" };

  const title = config?.metaTitle ?? `${tool.name}: Free Online Tool | Ozaar`;
  const description = config?.metaDesc ?? tool.desc;
  const keywords = config?.keywords ?? [];
  const url = `https://ozaar.theinnovations.tech/tools/${tool.slug}`;

  return {
    title: { absolute: title },
    description,
    keywords: keywords.join(", "),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Ozaar",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

type LiveTool = React.ComponentType;

const liveTools: Record<string, LiveTool> = {
  "pdf-toolkit": PdfToolkit,
  "image-compressor": ImageCompressor,
  "qr-generator": QrGenerator,
  "password-generator": PasswordGenerator,
  "color-palette": ColorPalette,
  "word-counter": WordCounter,
  "image-resizer": ImageResizer,
  "bg-remover": BgRemover,
  "resume-builder": ResumeBuilder,
  "age-calculator": AgeCalculator,
  "currency-converter": CurrencyConverter,
  "unit-converter": UnitConverter,
};

export default function ToolPage({ params }: PageProps) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const config = getToolConfig(params.slug);
  const LiveComponent = liveTools[tool.slug];

  if (!config) {
    return <div className="pt-32 text-center text-[#888]">Tool configuration not found.</div>;
  }

  // JSON-LD schemas
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: config.name,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: config.description,
    url: `https://ozaar.theinnovations.tech/tools/${config.slug}`,
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${config.name}`,
    step: config.howItWorks.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://ozaar.theinnovations.tech" },
      { "@type": "ListItem", position: 2, name: "Tools", item: "https://ozaar.theinnovations.tech/#tools" },
      { "@type": "ListItem", position: 3, name: config.name, item: `https://ozaar.theinnovations.tech/tools/${config.slug}` },
    ],
  };

  return (
    <>
      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Page sections */}
      <ToolHero config={config} />

      <ToolWorkspace
        accentColor={config.accentColor}
        fullBleed={config.slug === "resume-builder"}
        hideHeader={config.slug === "resume-builder"}
        toolName={config.slug === "resume-builder" ? "Resume Builder" : undefined}
      >
        {LiveComponent ? <LiveComponent /> : (
          <div className="text-center py-12 text-[#888]">This tool is coming soon.</div>
        )}
      </ToolWorkspace>

      <ToolHowItWorks
        steps={config.howItWorks}
        accentColor={config.accentColor}
        accentLight={config.accentLight}
      />

      <ToolFeatures
        features={config.features}
        accentColor={config.accentColor}
        accentLight={config.accentLight}
        toolName={config.name}
      />

      <ToolUseCases
        cases={config.useCases}
        accentColor={config.accentColor}
        accentLight={config.accentLight}
        toolSlug={config.slug}
      />

      <ToolSEOContent tool={config} />

      <ToolFAQ faqs={config.faq} accentColor={config.accentColor} />

      <RelatedTools slugs={config.relatedTools} />

      <ToolCTABanner tool={config} />
    </>
  );
}
