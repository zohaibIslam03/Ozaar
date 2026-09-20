import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";

/**
 * App Router sitemap — preferred over static next-sitemap files here because:
 * - URLs stay in sync with lib/tools (no duplicated slug list)
 * - Served at /sitemap.xml for crawlers the same way static XML would be
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...tools.map((tool) => ({
      url: `${SITE_URL}/tools/${tool.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: tool.slug === "resume-builder" ? 0.95 : 0.9,
    })),
  ];
}
