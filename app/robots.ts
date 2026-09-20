import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * App Router robots — served at /robots.txt with Sitemap pointing at /sitemap.xml.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
