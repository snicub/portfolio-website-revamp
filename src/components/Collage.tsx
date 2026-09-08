"use client";

import React, { memo, useState } from "react";
import { animate, createTimeline, onScroll, utils } from "animejs";
import Lightbox from "./Lightbox";
import { responsive } from "@/lib/imageManifest";
import { DUR, EASE, drift, enterView, passThrough, useAnimeScope } from "@/lib/motion";

const COLLAGE_SIZES = "(max-width: 640px) 90vw, 300px";

interface CollageProps {
  plpImages: { src: string }[] | undefined;
  /** What these photographs are of, numbered per image. Feeds both the alt
   *  text and the button label — "Collage 3" tells a search engine and a
   *  screen-reader user exactly nothing. */
  imageAlt: string;
}

const CollageImage: React.FC<{
  src: string;
  index: number;
  alt: string;
  onClick: () => void;
}> = memo(({ src, index, alt, onClick }) => {
  return (
    <button
      type="button"
      className="collage__item"
      onClick={onClick}
      data-cursor="open"
      aria-label={`Open ${alt} full screen`}
    >
      {/* Curtain only — see the note on the hero in PLPContent. */}
      <div className="frame frame--parallax">
        <img
          {...responsive(src, COLLAGE_SIZES)}
          alt={alt}
          loading={index < 4 ? "eager" : "lazy"}
          decoding="async"
        />
        <div className="frame__curtain" aria-hidden="true" />
      </div>
    </button>
  );
});

CollageImage.displayName = "CollageImage";

const Collage: React.FC<CollageProps> = ({ plpImages, imageAlt }) => {
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
            alt={`${imageAlt} — photo ${index + 1} of ${plpImages.length}`}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>
      {selectedIndex !== null && (
        <Lightbox
          images={plpImages}
          initialIndex={selectedIndex}
          imageAlt={imageAlt}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
};

export default Collage;
