/** @type {import('next-sitemap').IConfig} */
const toolSlugs = [
  "image-compressor",
  "resume-builder",
  "pdf-toolkit",
  "qr-generator",
  "password-generator",
  "color-palette",
  "word-counter",
  "image-resizer",
  "bg-remover",
  "age-calculator",
  "currency-converter",
  "unit-converter",
];

module.exports = {
  siteUrl: "https://ozaar.theinnovations.tech",
  generateRobotsTxt: true,
  outDir: "public",
  changefreq: "weekly",
  priority: 0.8,
  sitemapSize: 7000,
  additionalPaths: async (config) => {
    const result = [];
    // Homepage
    result.push({
      loc: "/",
      changefreq: "weekly",
      priority: 1.0,
      lastmod: new Date().toISOString(),
    });
    // Tool pages — highest priority
    for (const slug of toolSlugs) {
      result.push({
        loc: `/tools/${slug}`,
        changefreq: "weekly",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      });
    }
    return result;
  },
};
