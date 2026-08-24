"use client";

import React from "react";
import { animate, onScroll, scrambleText } from "animejs";
import { enterView, useAnimeScope } from "@/lib/motion";

/**
 * Types a label in out of character noise when it scrolls into view.
 * anime.js's scrambleText builds the whole reveal — cursor, settle rate,
 * character set — as a tween value on `innerHTML`, so there is no rAF loop,
 * no interval and no per-frame React state here.
 */
const TextEffect: React.FC<{ text?: string }> = ({ text = "" }) => {
  const { root } = useAnimeScope<HTMLSpanElement>(
    (self) => {
      const el = self.root as HTMLElement;
      animate(el, {
        innerHTML: scrambleText({
          chars: "lowercase",
          revealRate: 22,
          settleDuration: 320,
          from: "left",
          cursor: true,
        }),
        autoplay: onScroll(enterView(el)),
      });
    },
    [text],
  );

  return (
    <span className="text-effect" ref={root} suppressHydrationWarning>
      {text}
    </span>
  );
};

export default TextEffect;
