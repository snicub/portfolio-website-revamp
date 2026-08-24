"use client";

import { animate, onScroll } from "animejs";
import { DUR, EASE, useAnimeScope } from "@/lib/motion";

interface GoToTopBottomBarProps {
  showBelow: number;
}

/**
 * Appears once you are `showBelow` pixels down. The threshold is expressed to
 * anime.js as a scroll position rather than watched with a scroll listener, so
 * this shares the engine's single scroll loop with everything else on the page.
 */
export default function GoToTopBottomBar({ showBelow }: GoToTopBottomBarProps) {
  const { root } = useAnimeScope<HTMLDivElement>(
    (self) => {
      const bar = self.root as HTMLElement;
      const show = (on: boolean) => {
        bar.style.pointerEvents = on ? "auto" : "none";
        animate(bar, {
          opacity: on ? 1 : 0,
          y: on ? 0 : 8,
          duration: DUR.fast,
          ease: EASE.out,
        });
      };

      onScroll({
        target: document.documentElement,
        // Pushing the container edge above the document start moves the entry
        // point exactly `showBelow` pixels down the page.
        enter: `start-=${showBelow} start`,
        leave: "end end",
        onEnter: () => show(true),
        onLeaveBackward: () => show(false),
      });
    },
    [showBelow],
  );

  return (
    <div className="utility-bar utility-bar--right go-top" ref={root}>
      <button
        type="button"
        className="nav-link hover-highlight"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        [ Go to Top ]
      </button>
    </div>
  );
}
