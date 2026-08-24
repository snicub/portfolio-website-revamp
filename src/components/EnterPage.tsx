"use client";

import Marquee from "react-fast-marquee";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  animate,
  createTimeline,
  createTimer,
  createAnimatable,
  stagger,
  utils,
} from "animejs";
import useDevice from "@/hooks/useDevice";
import { DUR, EASE, motionEnabled, revealChars, useAnimeScope } from "@/lib/motion";
import type { ImageObject } from "@/lib/data";

interface EnterPageProps {
  images: ImageObject[] | undefined;
  /** ms each photo holds before crossfading to the next */
  duration?: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function EnterPage({ images, duration = 3800 }: EnterPageProps) {
  const [isMobile] = useDevice();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const firstImgRef = useRef<HTMLImageElement | null>(null);
  const leavingRef = useRef(false);

  const safeImages = images ?? [];
  const goHome = useCallback(() => router.push("/home"), [router]);

  // Cached images fire `load` before React attaches the handler.
  useEffect(() => {
    if (!ready && firstImgRef.current?.complete) setReady(true);
  }, [ready]);

  const { root, scope } = useAnimeScope<HTMLDivElement>(
    (self) => {
      if (!ready) return;

      const cleanups: Array<() => void> = [];
      const slides = utils.$(".enter__slide") as HTMLElement[];
      const [veil] = utils.$(".enter__veil") as HTMLElement[];
      const [stack] = utils.$(".enter__stack") as HTMLElement[];
      const [overlay] = utils.$(".enter__overlay") as HTMLElement[];
      const [counter] = utils.$(".enter__counter-index") as HTMLElement[];
      const [cta] = utils.$(".enter__cta") as HTMLElement[];
      const [curtain] = utils.$(".enter__curtain") as HTMLElement[];
      if (!slides.length || !cta) return;


      /* ---- 1. intro: veil lifts, first frame settles, letters rise ---- */
      utils.set(slides[0], { opacity: 1, scale: 1.09 });

      createTimeline({ defaults: { ease: EASE.out } })
        .add(veil, { opacity: [1, 0], duration: DUR.cinematic, ease: EASE.expo }, 0)
        .add(slides[0], { scale: 1, duration: duration + 1400, ease: EASE.scrub }, 0)
        .add(
          ".enter__fade",
          { opacity: [0, 1], y: [14, 0], duration: DUR.base },
          stagger(90, { start: 520 }),
        );

      /* ---- the CTA reveals character by character. revealChars retires any
              previous split of this element first, so a re-run of this scope
              can never split an already-split node. ---- */
      const split = revealChars(cta, (chars) =>
        animate(chars, {
          opacity: [0, 1],
          y: ["110%", "0%"],
          duration: DUR.slow,
          ease: EASE.out,
          delay: stagger(34, { from: "center", start: 300 }),
        }),
      );

      /* ---- 2. the slideshow, run by the engine rather than setInterval so
              it pauses with the tab and is torn down with the scope ---- */
      let index = 0;
      if (slides.length > 1) {
        createTimer({
          duration,
          loop: true,
          onLoop: () => {
            if (leavingRef.current) return;
            const prev = index;
            index = (index + 1) % slides.length;
            const next = slides[index];

            animate(slides[prev], { opacity: 0, duration: 1200, ease: EASE.inOut });
            utils.set(next, { scale: 1.09 });
            animate(next, { opacity: 1, duration: 1200, ease: EASE.inOut });
            // Slow drift across the whole dwell — the frame is never still.
            animate(next, { scale: 1, duration: duration + 1400, ease: EASE.scrub });
            if (counter) counter.textContent = pad(index + 1);
          },
        });
      }

      /* ---- 3. pointer parallax: photo and overlay drift apart ---- */
      if (!self.matches.touch && stack && overlay) {
        const photo = createAnimatable(stack, {
          x: { duration: 1200, ease: EASE.out },
          y: { duration: 1200, ease: EASE.out },
        });
        const text = createAnimatable(overlay, {
          x: { duration: 1600, ease: EASE.out },
          y: { duration: 1600, ease: EASE.out },
        });

        const onMove = (e: MouseEvent) => {
          const dx = e.clientX / window.innerWidth - 0.5;
          const dy = e.clientY / window.innerHeight - 0.5;
          photo.x(dx * -34);
          photo.y(dy * -34);
          text.x(dx * 14);
          text.y(dy * 14);
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        cleanups.push(() => window.removeEventListener("mousemove", onMove));
      }

      /* ---- 4. hover: a ripple down the letters ---- */
      self.add("hoverCta", (on: boolean) => {
        // Read the characters at call time: a resize may have re-split them.
        animate(split.chars as HTMLElement[], {
          y: on ? ["0%", "-26%", "0%"] : "0%",
          duration: on ? 520 : 260,
          ease: EASE.out,
          delay: stagger(22, { from: "first" }),
        });
      });

      /* ---- 5. exit: the frame pushes in, letters scatter, paper wipes up ---- */
      self.add("leave", (done: () => void) => {
        createTimeline({ defaults: { ease: EASE.expo } })
          .add(split.chars as HTMLElement[], { opacity: 0, y: "-120%", duration: 460 }, stagger(18, { from: "center" }))
          .add(".enter__fade", { opacity: 0, duration: 320 }, 0)
          .add(slides[index], { scale: 1.22, duration: 900 }, 0)
          .add(curtain, { y: ["101%", "0%"], duration: 720, onComplete: done }, 240);
      });

      return () => cleanups.forEach((fn) => fn());
    },
    [ready, duration],
  );

  const handleEnter = useCallback(() => {
    if (leavingRef.current) return;
    const leave = scope.current?.methods.leave;
    if (!motionEnabled() || !leave) {
      goHome();
      return;
    }
    leavingRef.current = true;
    leave(goHome);
  }, [goHome, scope]);

  const setHover = (on: boolean) => scope.current?.methods.hoverCta?.(on);

  return (
    <div className="enter" ref={root}>
      <div className="enter__stack">
        {safeImages.map((image, index) => {
          const src =
            isMobile || !image.desktopSrc ? image.mobileSrc : image.desktopSrc;
          return (
            <img
              ref={index === 0 ? firstImgRef : undefined}
              key={src}
              className="enter__slide"
              src={src}
              alt=""
              aria-hidden="true"
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              {...{ fetchPriority: index === 0 ? ("high" as const) : ("low" as const) }}
              onLoad={() => index === 0 && setReady(true)}
              onError={() => index === 0 && setReady(true)}
            />
          );
        })}
      </div>

      <div className="enter__vignette" aria-hidden="true" />
      <div className="enter__veil" aria-hidden="true" />

      <div className="enter__overlay">
        {/* One row element, not two grid items: two children both claiming
            `grid-row: 1` would auto-place into a second implicit column and
            shrink every row below them. */}
        <header className="enter__topbar">
          <div className="enter__meta">
            <p className="mono enter__fade">Daniel Han</p>
            <p className="mono enter__fade">Software Engineer — New Jersey</p>
          </div>
          <p className="mono enter__counter enter__fade" aria-hidden="true">
            <span className="enter__counter-index">01</span>
            <span> / {pad(safeImages.length)}</span>
          </p>
        </header>

        <button
          type="button"
          className="enter__cta"
          data-split
          data-cursor="enter"
          onClick={handleEnter}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          aria-label="Enter site"
        >
          [ enter ]
        </button>

        <div className="enter__ticker enter__fade">
          <Marquee autoFill speed={38}>
            <span>
              Daniel Han is a passionate software engineer based in New Jersey. He
              is currently a software engineer at Nespresso focusing on building
              the best user experience &#9749; He gets it done with quality.
              &nbsp;&nbsp;—&nbsp;&nbsp;
            </span>
          </Marquee>
        </div>
      </div>

      <div className="enter__curtain" aria-hidden="true" />
    </div>
  );
}
