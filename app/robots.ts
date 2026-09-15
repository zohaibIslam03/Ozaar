import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://ozaar.theinnovations.tech/sitemap.xml",
    host: "https://ozaar.theinnovations.tech",
  };
}
