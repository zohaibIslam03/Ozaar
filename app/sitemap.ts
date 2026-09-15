import { MetadataRoute } from "next";

const BASE_URL = "https://ozaar.theinnovations.tech";

const tools = [
  "pdf-toolkit",
  "image-compressor",
  "image-resizer",
  "bg-remover",
  "qr-generator",
  "password-generator",
  "color-palette",
  "word-counter",
  "resume-builder",
  "age-calculator",
  "currency-converter",
  "unit-converter",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const toolPages: MetadataRoute.Sitemap = tools.map((slug) => ({
    url: `${BASE_URL}/tools/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...toolPages];
}
