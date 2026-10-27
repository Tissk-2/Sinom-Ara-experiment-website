import type { MetadataRoute } from "next";
import { SITE_URL } from "@/components/product/productContent";

export default function sitemap(): MetadataRoute.Sitemap {
  // The site is a single route; fragment URLs (/#produk, /#faq) are not
  // separate pages and are ignored by search engines in sitemaps.
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}