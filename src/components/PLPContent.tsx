"use client";

import { animate, createTimeline, onScroll, stagger, utils } from "animejs";
import Collage from "./Collage";
import Bottombar from "./Bottombar";
import Data, { type GalleryItem } from "@/lib/data";
import {
  DUR,
  EASE,
  enterView,
  drift,
  passThrough,
  revealLines,
  useAnimeScope,
} from "@/lib/motion";

interface PLPContentProps {
  item: GalleryItem;
}

export default function PLPContent({ item }: PLPContentProps) {
  const position = Data.galleryCardInfo.findIndex((g) => g.slug === item.slug);
  const total = Data.galleryCardInfo.length;

  const { root } = useAnimeScope<HTMLElement>(
    (self) => {
      const motion = drift(!!self.matches.touch);
      const [index] = utils.$(".plp__index") as HTMLElement[];
      const [title] = utils.$(".plp__title") as HTMLElement[];
      const [info] = utils.$(".plp__info") as HTMLElement[];
      const [hero] = utils.$(".plp__hero") as HTMLElement[];
      if (!title || !hero) return;

      const heroImg = hero.querySelector("img") as HTMLElement | null;
      const heroCurtain = hero.querySelector(".frame__curtain") as HTMLElement | null;

      /* ---- arrival ---- */
      revealLines(title, (lines) =>
        animate(lines, {
          y: ["105%", "0%"],
          duration: DUR.slow,
          ease: EASE.expo,
          delay: stagger(80, { start: 100 }),
        }),
      );

      const intro = createTimeline({ defaults: { ease: EASE.out } });
      if (index) {
        intro.add(index, { opacity: [0, 1], y: [10, 0], duration: DUR.base }, 0);
      }
      if (heroCurtain) {
        intro.add(heroCurtain, { y: ["0%", "-101%"], duration: DUR.slow, ease: EASE.expo }, 200);
      }
      if (heroImg) {
        intro.add(heroImg, { scale: [1.18, 1], duration: 1600, ease: EASE.expo }, 200);
      }

      /* ---- scroll-linked: the hero photo drifts inside its frame ---- */
      if (heroImg) {
        animate(heroImg, {
          y: motion.range,
          ease: EASE.scrub,
          autoplay: onScroll(passThrough(hero, motion.sync)),
        });
      }

      /* ---- the blurb reveals a line at a time on the way in ---- */
      if (info) {
        revealLines(info, (lines) =>
          animate(lines, {
            y: ["110%", "0%"],
            opacity: [0, 1],
            duration: DUR.base,
            ease: EASE.out,
            delay: stagger(55),
            autoplay: onScroll(enterView(info)),
          }),
        );
      }
    },
    [item.slug],
  );

  return (
    <main className="page plp" ref={root}>
      <header className="plp__head">
        <p className="mono plp__index" data-reveal>
          {String(position + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <h1 className="display plp__title" data-split>
          {item.title}
        </h1>
      </header>

      <div className="plp__lead">
        {/* No loading shimmer here: the paper curtain below is already the
            reveal, and a highlight sweeping under it read as a second,
            competing animation on the same photograph. */}
        <div className="frame frame--parallax plp__hero">
          <img
            className="mainImage"
            src={item.img}
            alt={item.altText}
            loading="eager"
            decoding="async"
          />
          <div className="frame__curtain" aria-hidden="true" />
        </div>
        <p className="plp__info" data-split>
          {item.info}
        </p>
      </div>

      <Collage plpImages={item.plpImages} />

      {/* Fixed chrome last, so it is never the segment's first element. */}
      <Bottombar slug={item.slug} />
    </main>
  );
}
