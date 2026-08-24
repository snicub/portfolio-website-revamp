"use client";

import Link from "next/link";
import { animate, onScroll, utils } from "animejs";
import Clock from "./Clock";
import DateComp from "./DateComp";
import Odometer, { createOdometer } from "./Odometer";
import { DUR, EASE, useAnimeScope } from "@/lib/motion";

/**
 * The site's only persistent chrome, and the home of its scroll-progress
 * readout. One ScrollObserver spans the whole document and does three jobs:
 * it drives the hairline under the bar (a linked animation anime.js seeks
 * from scroll position), it turns the digit drums that report the same
 * number, and it decides when the bar has left the paper behind it.
 */
export default function Navbar() {
  const { root } = useAnimeScope<HTMLElement>((self) => {
    const bar = self.root as HTMLElement;
    const [rule] = utils.$(".nav__progress") as HTMLElement[];
    const [pct] = utils.$(".nav__pct") as HTMLElement[];
    const setPct = pct ? createOdometer(pct) : null;

    animate(bar, {
      opacity: [0, 1],
      y: [-16, 0],
      duration: DUR.slow,
      ease: EASE.expo,
    });

    // Touch devices get no backdrop blur (it costs too much per scroll frame),
    // so the bar has to be genuinely opaque there or the page ghosts through it.
    const condensedBg = self.matches.touch
      ? "rgba(241, 240, 234, 1)"
      : "rgba(241, 240, 234, 0.86)";

    let condensed = false;

    const progress = onScroll({
      target: document.documentElement,
      // Both edges aligned: 0 at the top of the document, 1 at the bottom.
      enter: "start start",
      leave: "end end",
      // Below 1, anime.js lerps the scrub so the hairline trails the scroll.
      sync: 0.65,
      onUpdate: (obs) => {
        setPct?.(Math.round(obs.progress * 100));
        // Lift the bar off the page the moment it stops sitting on paper.
        const shouldCondense = obs.scroll > 40;
        if (shouldCondense !== condensed) {
          condensed = shouldCondense;
          animate(bar, {
            backgroundColor: shouldCondense ? condensedBg : "rgba(241, 240, 234, 0)",
            duration: DUR.fast,
            ease: EASE.out,
          });
        }
      },
    });

    if (rule) {
      animate(rule, { scaleX: [0, 1], ease: EASE.scrub, autoplay: progress });
    }
  });

  return (
    <header className="nav" ref={root}>
      <div className="nav__inner">
        <Link href="/home" className="nav__brand nav-link hover-highlight">
          Daniel Han
        </Link>

        <p className="nav__meta mono" aria-hidden="true">
          <DateComp />
          <Clock />
        </p>

        <nav className="nav__links mono" aria-label="Primary">
          <Odometer className="nav__pct" places={2} unit="%" />
          <Link href="/about" className="nav-link hover-highlight">
            [ About ]
          </Link>
          <Link href="/" className="nav-link hover-highlight">
            [ Exit ]
          </Link>
        </nav>
      </div>
      <span className="nav__progress" aria-hidden="true" />
    </header>
  );
}
