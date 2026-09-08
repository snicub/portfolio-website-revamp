import type { MetadataRoute } from "next";
import Data from "@/lib/data";
import { abs, BUILD_DATE } from "@/lib/seo";

/**
 * Generated, not hand-written. The previous static file listed the gallery
 * slugs by hand, which is a list that silently goes stale the first time an
 * entry is added — a 404 in a sitemap is a crawl-budget hole and the one
 * error Search Console reports loudest.
 *
 * `images` emits the Google image-sitemap extension, which is how the
 * photographs on this site become eligible for Google Images at all.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = BUILD_DATE;

  return [
    {
      url: abs("/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: abs("/home"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      images: Data.galleryCardInfo.map((item) => abs(item.img)),
    },
    {
      url: abs("/about"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...Data.galleryCardInfo.map((item) => ({
      url: abs(`/gallery/${item.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: [abs(item.img), ...item.plpImages.map((p) => abs(p.src))],
    })),
  ];
}
