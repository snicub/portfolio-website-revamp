import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGalleryItem, getAllSlugs } from "@/lib/data";
import { SITE_URL, breadcrumb, creativeWork } from "@/lib/seo";
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
  if (!item) return { title: "Not Found" };

  return {
    title: item.title,
    description: item.info,
    openGraph: {
      type: "article",
      title: `${item.title} · Daniel Han`,
      description: item.info,
      url: `${SITE_URL}/gallery/${slug}`,
      images: [{ url: `${SITE_URL}${item.img}`, alt: item.altText }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.title} · Daniel Han`,
      description: item.info,
      images: [`${SITE_URL}${item.img}`],
    },
  };
}

export default async function GalleryPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getGalleryItem(slug);
  if (!item) notFound();

  const jsonLd = [
    breadcrumb([
      { name: "Home", path: "/" },
      { name: "Gallery", path: "/home" },
      { name: item.title, path: `/gallery/${slug}` },
    ]),
    creativeWork({
      slug: item.slug,
      title: item.title,
      description: item.info,
      image: item.img,
      galleryImages: item.plpImages.map((p) => p.src),
    }),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PLPContent item={item} />
    </>
  );
}
