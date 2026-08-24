"use client";

import React, { memo, useState } from "react";
import { animate, createTimeline, onScroll, utils } from "animejs";
import Lightbox from "./Lightbox";
import { responsive } from "@/lib/imageManifest";
import { DUR, EASE, drift, enterView, passThrough, useAnimeScope } from "@/lib/motion";

const COLLAGE_SIZES = "(max-width: 640px) 90vw, 300px";

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
      className="collage__item"
      onClick={onClick}
      data-cursor="open"
      aria-label={`View collage image ${index + 1}`}
    >
      <div className={`frame frame--parallax shimmer${isLoaded ? " is-loaded" : ""}`}>
        <img
          {...responsive(src, COLLAGE_SIZES)}
          alt={`Collage ${index + 1}`}
          loading={index < 4 ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
        />
        <div className="frame__curtain" aria-hidden="true" />
      </div>
    </button>
  );
});

CollageImage.displayName = "CollageImage";

const Collage: React.FC<CollageProps> = ({ plpImages }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Same two-observer pattern as the home grid, so the whole site reveals
  // photographs the same way: a curtain wipes, then the frame keeps drifting.
  const { root } = useAnimeScope<HTMLDivElement>(
    (self) => {
      const items = utils.$(".collage__item") as HTMLElement[];
      const motion = drift(!!self.matches.touch);

      items.forEach((item, i) => {
        const img = item.querySelector("img") as HTMLElement | null;
        const curtain = item.querySelector(".frame__curtain") as HTMLElement | null;
        if (!img || !curtain) return;

        // A per-column offset keeps rows from landing in lockstep.
        const lag = (i % 3) * 90;

        createTimeline({ autoplay: onScroll(enterView(item)) })
          .add(curtain, { y: ["0%", "-101%"], duration: DUR.base, ease: EASE.expo }, lag)
          .add(img, { scale: [1.2, 1], duration: 1200, ease: EASE.expo }, lag);

        animate(img, {
          y: motion.range,
          ease: EASE.scrub,
          autoplay: onScroll(passThrough(item, motion.sync)),
        });
      });
    },
    [plpImages],
  );

  if (!plpImages?.length) return null;

  return (
    <>
      <div className="collage" ref={root}>
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
