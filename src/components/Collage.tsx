"use client";

import React, { memo, useState } from "react";
import Lightbox from "./Lightbox";
import { responsive } from "@/lib/imageManifest";

// Collage cells render in a `minmax(240px, 1fr)` grid (~1 col on phones, ~240–300px
// otherwise), so request the small thumbnail and let the browser upgrade on large/high-DPR slots.
const COLLAGE_SIZES = "(max-width: 640px) 90vw, 280px";

interface CollageProps {
  plpImages: { src: string }[] | undefined;
}

const CollageImage: React.FC<{
  src: string;
  index: number;
  onClick: () => void;
}> = memo(({ src, index, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View collage image ${index + 1}`}
      style={{
        display: "block",
        width: "100%",
        padding: 0,
        border: "none",
        background: "none",
        cursor: "pointer",
      }}
    >
      <div
        className={`shimmer${isLoaded ? " is-loaded" : ""}`}
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          {...responsive(src, COLLAGE_SIZES)}
          alt={`Collage ${index + 1}`}
          loading={index < 4 ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
            zIndex: 2,
          }}
        />
      </div>
    </button>
  );
});

CollageImage.displayName = "CollageImage";

const Collage: React.FC<CollageProps> = ({ plpImages }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!plpImages?.length) return null;
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "10px",
          width: "100%",
        }}
      >
        {plpImages.map((image, index) => (
          <CollageImage
            key={image.src}
            src={image.src}
            index={index}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>
      {selectedIndex !== null && (
        <Lightbox
          images={plpImages}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
};

export default Collage;
