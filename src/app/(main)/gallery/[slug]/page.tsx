import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGalleryItem, getAllSlugs } from "@/lib/data";
import { galleryItemGraph, jsonLd, pageMetadata } from "@/lib/seo";
import PLPContent from "@/components/PLPContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getGalleryItem(slug);
  if (!item) return { title: "Not Found", robots: { index: false, follow: false } };

  return pageMetadata({
    path: `/gallery/${slug}`,
    title: item.title,
    description: item.info,
    image: `/og/${slug}.jpg`,
    imageAlt: `${item.title} — ${item.altText}`,
    type: "article",
  });
}

export default async function GalleryPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getGalleryItem(slug);
  if (!item) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(galleryItemGraph(item)) }}
      />
      <PLPContent item={item} />
    </>
  );
}
