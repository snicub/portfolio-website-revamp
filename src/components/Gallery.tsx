"use client";

import React from "react";
import {
  animate,
  createAnimatable,
  createTimeline,
  onScroll,
  spring,
  utils,
} from "animejs";
import Data from "@/lib/data";
import GalleryCard from "./GalleryCard";
import {
  DUR,
  EASE,
  SPRING,
  enterView,
  drift,
  passThrough,
  pov,
  tilt,
  useAnimeScope,
} from "@/lib/motion";

/**
 * One Scope drives the whole grid. Each card gets two ScrollObservers:
 *
 *   1. a one-shot reveal — the paper curtain wipes off the photo as the card
 *      crosses into view, and retires itself afterwards (`repeat: false`);
 *   2. a continuous scrub, shared by two moves one range apart — the frame
 *      turns as a plane in the card's own perspective box, and the oversized
 *      photo drifts inside that frame. Depth of the object, then depth
 *      inside it. Both hang off the same observer, so one scroll gesture
 *      drives one coherent movement rather than two competing ones.
 *
 * Above all of that, one animation for the whole grid moves the vanishing
 * point every card reads its perspective origin from — see `pov()`.
 */
const Gallery: React.FC = () => {
  const { root } = useAnimeScope<HTMLDivElement>((self) => {
    const cleanups: Array<() => void> = [];
    const cards = utils.$(".gallery-card") as HTMLElement[];
    const touch = !!self.matches.touch;
    const motion = drift(touch);
    const pose = tilt(touch);

    /* `scale` on a photo has exactly one owner at a time. The reveal claims
       it first; the pointer may only take over once the reveal has landed.
       Without this, scrolling with the cursor resting over the grid fires
       pointerenter on a card that is still zooming, and anime's `replace`
       composition hands `scale` back and forth between the two animations
       every frame — which reads as the photo flickering. */
    const revealed = new WeakSet<HTMLElement>();

    cards.forEach((card) => {
      const frame = card.querySelector(".gallery-card__frame") as HTMLElement | null;
      const img = card.querySelector("img") as HTMLElement | null;
      const curtain = card.querySelector(".frame__curtain") as HTMLElement | null;
      const meta = card.querySelector(".gallery-card__meta") as HTMLElement | null;
      if (!frame || !img || !curtain || !meta) return;

      createTimeline({
        autoplay: onScroll(enterView(card)),
        onComplete: () => revealed.add(card),
      })
        .add(curtain, { y: ["0%", "-101%"], duration: DUR.slow, ease: EASE.expo }, 0)
        .add(img, { scale: [1.16, 1], duration: 1500, ease: EASE.expo }, 0)
        .add(meta, { opacity: [0, 1], y: [16, 0], duration: DUR.base, ease: EASE.out }, 280);

      // The photograph as an object: a plane turning in the card's own
      // perspective box. Three stops, so it is square exactly once — in the
      // middle of the screen, where you are actually looking at it.
      //
      // The frame is the only thing posed. Its caption stays flat and crisp
      // underneath, the way a label under a print does — and text rotated in
      // 3D on iOS renders through a texture and goes soft.
      //
      // Passed as bare number arrays on purpose. anime reads `[a, b, c]` as
      // "from a to b, then to c" — two segments. The `[{to}, {to}, {to}]`
      // object form would read as three, and the first would start from
      // whatever the element sits at now (0deg), spending the bottom third
      // of the range tilting *into* the pose before playing it.
      animate(frame, {
        z: pose.z,
        rotateX: pose.rotateX,
        ease: EASE.settle,
        autoplay: onScroll(passThrough(card, motion.sync)),
      });

      // Depth inside the object: the oversized photo slides within the frame
      // it is clipped by. Same observer range, so the two never disagree.
      animate(img, {
        y: motion.range,
        ease: EASE.scrub,
        autoplay: onScroll(passThrough(card, motion.sync)),
      });
    });

    /* ---- the eye moves down the grid, desktop only ----
       Every card owns its own `perspective`, but they all take the origin
       from one inherited custom property on the grid. Moving that is one
       animation that ten cards answer, and it is what keeps `tilt()` from
       reading as the same canned rotation ten times over.

       Written by hand in `onUpdate` rather than animated as a CSS variable
       directly: the target is a plain object, so there is no question of
       what unit anime.js decides to serialise the value with. */
    if (!touch) {
      const grid = self.root as HTMLElement;
      const [from, to] = pov();
      const eye = { y: from };
      let written = -1;

      animate(eye, {
        y: to,
        ease: EASE.scrub,
        autoplay: onScroll(passThrough(grid, motion.sync)),
        onUpdate: () => {
          // Quantised, because this is the one property here that the
          // compositor cannot take: changing it re-projects every promoted
          // card layer under this grid. Half a percent of card height is
          // about a pixel and a half of vanishing point — far below what
          // anyone can see, and it cuts the writes that reach style recalc
          // to a fraction of the frames that ask for one.
          const next = Math.round(eye.y * 2) / 2;
          if (next === written) return;
          written = next;
          grid.style.setProperty("--pov", String(next));
        },
      });
    }

    /* ---- pointer response, desktop only ---- */
    if (!self.matches.touch) {
      cards.forEach((card) => {
        const img = card.querySelector("img") as HTMLElement | null;
        const pull = createAnimatable(card, {
          x: { duration: 700, ease: EASE.out },
          y: { duration: 700, ease: EASE.out },
        });

        const onMove = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          pull.x(((e.clientX - r.left) / r.width - 0.5) * 18);
          pull.y(((e.clientY - r.top) / r.height - 0.5) * 18);
        };
        const onEnter = () => {
          if (img && revealed.has(card)) {
            animate(img, { scale: 1.05, duration: 800, ease: EASE.out });
          }
        };
        const onLeave = () => {
          pull.x(0);
          pull.y(0);
          if (img && revealed.has(card)) {
            animate(img, { scale: 1, ease: spring(SPRING.snappy) });
          }
        };

        card.addEventListener("pointermove", onMove, { passive: true });
        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("pointerleave", onLeave);
        });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  });

  return (
    <div className="gallery-grid" ref={root}>
      {Data.galleryCardInfo.map((item, index) => (
        <GalleryCard
          key={item.img}
          slug={item.slug}
          index={index}
          imageSrc={item.img}
          altText={item.altText}
          title={item.title}
        />
      ))}
    </div>
  );
};

export default Gallery;
