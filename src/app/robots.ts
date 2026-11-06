import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://cm.balochistan.gob.pk";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/enter/", "/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
