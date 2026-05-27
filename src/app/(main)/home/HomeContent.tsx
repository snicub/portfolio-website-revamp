"use client";

import Gallery from "@/components/Gallery";
import GoToTopBottomBar from "@/components/GoToTopBottomBar";
import useDevice from "@/hooks/useDevice";
import Data from "@/lib/data";
import { breadcrumb, collectionPage, imageGallery, SITE_URL } from "@/lib/seo";

export default function HomeContent() {
  const [isMobile] = useDevice();

  const jsonLd = [
    breadcrumb([
      { name: "Home", path: "/" },
      { name: "Gallery", path: "/home" },
    ]),
    collectionPage({
      items: Data.galleryCardInfo.map((item) => ({
        title: item.title,
        image: item.img,
        url: `${SITE_URL}/gallery/${item.slug}`,
        description: item.info,
      })),
    }),
    imageGallery(
      Data.galleryCardInfo.map((item) => ({
        title: item.title,
        image: item.img,
      })),
    ),
  ];

  return (
    <>
      <GoToTopBottomBar showBelow={300} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main
        className="home-main-wrapper"
        style={{
          display: "flex",
          gap: "20px",
          flexDirection: "column",
          marginBottom: "50px",
          marginTop: isMobile ? "100px" : "120px",
        }}
      >
        <h1 className="sr-only">Daniel Han — Portfolio Gallery</h1>
        <section
          className="gallery-wrapper"
          aria-label="Portfolio gallery"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Gallery />
        </section>
        <footer
          style={{
            fontFamily: "monospace",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
          className="bottom-message"
        >
          designed &amp; developed by Daniel Han
          <br />
          built in next js
        </footer>
      </main>
    </>
  );
}
