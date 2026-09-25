/** Canonical production origin (HTTPS, non-www). */
export const SITE_URL = "https://ozaar.involiq.tech";

export const SITE_NAME = "Ozaar";

export const SITE_TAGLINE = "Free online tools. No signup. No ads. No limits.";

/** Company that built Ozaar — linked for brand SEO. */
export const PUBLISHER = {
  name: "Involiq",
  url: "https://www.involiq.tech/",
  legalName: "Involiq",
} as const;

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function toolUrl(slug: string): string {
  return absoluteUrl(`/tools/${slug}`);
}
