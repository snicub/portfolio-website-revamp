"use client";

import { memo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import TextEffect from "./TextEffect";

interface GalleryCardProps {
  slug: string;
  imageSrc: string;
  altText: string;
  title: string;
  index?: number;
}

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
    if (!loaded && imgRef.current?.complete) {
      setLoaded(true);
    }
  }, [loaded]);

  return (
    <Link
      href={`/gallery/${slug}`}
      className="gallery-card"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        cursor: "pointer",
        boxSizing: "border-box",
        margin: "40px 0",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        className={`gallery-card-image-container shimmer${loaded ? " is-loaded" : ""}`}
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          ref={imgRef}
          className="gallery-card-image"
          src={imageSrc}
          alt={altText}
          loading={index < 3 ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.4s ease-out, transform 0.3s ease-in-out",
            display: "block",
            position: "relative",
            zIndex: 2,
          }}
        />
      </div>
      <div style={{ paddingTop: "10px", width: "100%" }}>
        <TextEffect text={title} />
      </div>
    </Link>
  );
}

export default memo(GalleryCard);
