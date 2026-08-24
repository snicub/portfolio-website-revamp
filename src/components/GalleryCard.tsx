"use client";

import { memo, useEffect, useRef, useState } from "react";
import Link from "next/link";
import TextEffect from "./TextEffect";
import { responsive } from "@/lib/imageManifest";

// The grid is `minmax(300px, 1fr)` capped at 1440px, so ask for the thumbnail
// and let large / high-DPR slots upgrade to the full image.
const GALLERY_SIZES = "(max-width: 600px) calc(100vw - 32px), 380px";

interface GalleryCardProps {
  slug: string;
  imageSrc: string;
  altText: string;
  title: string;
  index?: number;
}

/**
 * Pure markup. Every card's motion is orchestrated from the Gallery scope so
 * there is one anime.js Scope for the whole grid instead of one per card.
 */
function GalleryCard({
  slug,
  imageSrc,
  altText,
  title,
  index = 0,
}: GalleryCardProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!loaded && imgRef.current?.complete) setLoaded(true);
  }, [loaded]);

  return (
    <Link href={`/gallery/${slug}`} className="gallery-card" data-cursor="view">
      <div
        className={`frame frame--parallax gallery-card__frame shimmer${loaded ? " is-loaded" : ""}`}
      >
        <img
          ref={imgRef}
          {...responsive(imageSrc, GALLERY_SIZES)}
          alt={altText}
          loading={index < 3 ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
        <div className="frame__curtain" aria-hidden="true" />
      </div>
      <div className="gallery-card__meta">
        <span className="gallery-card__index mono" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <TextEffect text={title} />
      </div>
    </Link>
  );
}

export default memo(GalleryCard);
