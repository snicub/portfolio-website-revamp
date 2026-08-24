"use client";

import { createScope, splitText, utils, type Scope } from "animejs";
import { useEffect, useRef, type DependencyList } from "react";

/* ==========================================================================
   Motion tokens
   Every animation on the site pulls its timing from here. That is the whole
   reason the page reads as one system rather than a pile of effects.
   ========================================================================== */

export const DUR = {
  /** hover states, cursor snaps */
  micro: 180,
  /** UI acknowledgements */
  fast: 340,
  /** the default: content entering */
  base: 620,
  /** hero content, image curtains */
  slow: 980,
  /** the enter-page transition */
  cinematic: 1500,
} as const;

export const EASE = {
  /** entrances — decisive, no overshoot */
  out: "out(3)",
  /** long editorial entrances */
  outSoft: "out(2)",
  /** travel between two resting states */
  inOut: "inOut(2.4)",
  /** big cinematic pushes */
  expo: "outExpo",
  /** scroll-scrubbed values must stay linear or the scrub feels laggy */
  scrub: "linear",
  /** for scrubbed poses that should REST in the middle of their travel.
   *  Easing a scrubbed value remaps position, not time, so this stays
   *  locked to the scroll — it just spends more of the range at the
   *  keyframe than between them. */
  settle: "inOut(1.8)",
} as const;

/** Parameters for `spring()`. Kept as plain objects so nothing is
 *  constructed at import time (these modules are evaluated during export). */
export const SPRING = {
  /** cursor scale, magnetic release */
  snappy: { stiffness: 190, damping: 18, mass: 1 },
  /** timeline dots, badges */
  pop: { bounce: 0.35, duration: 620 },
} as const;

export const MEDIA = {
  sm: "(max-width: 767px)",
  touch: "(hover: none), (pointer: coarse)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

/* ==========================================================================
   Motion gate
   `html.anime` is written by a blocking inline script in the root layout,
   and only when reduced motion is off. CSS hides "starts hidden" elements
   behind that same class, so if the script never runs the page is simply a
   finished, readable document. Nothing here is load-bearing for content.
   ========================================================================== */

export function motionEnabled(): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("anime")
  );
}

/* ==========================================================================
   useAnimeScope
   The anime.js × React contract: build every instance inside a Scope rooted
   at this component's DOM node, then revert() the whole scope on unmount.
   That single call tears down animations, scroll observers, text splits and
   draggables together, and restores the inline styles they wrote.
   ========================================================================== */

export type ScopeSetup = (self: Scope) => void | (() => void);

export function useAnimeScope<T extends HTMLElement = HTMLDivElement>(
  setup: ScopeSetup,
  deps: DependencyList = [],
) {
  const root = useRef<T>(null);
  const scope = useRef<Scope | null>(null);

  // Keep the latest closure without making it a dependency: re-running the
  // scope on every render would restart animations mid-flight.
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useEffect(() => {
    if (!motionEnabled() || !root.current) return;

    // Returning a function from the constructor registers it as the scope's
    // own teardown, which is also what runs when a media query flips and the
    // scope rebuilds itself. Anything the setup subscribes to by hand — DOM
    // listeners, mostly — must come back out that way.
    const created = createScope({ root, mediaQueries: MEDIA }).add((self) =>
      setupRef.current(self as Scope),
    );
    scope.current = created;

    return () => {
      created.revert();
      scope.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { root, scope };
}

/* ==========================================================================
   Scroll vocabulary
   anime.js reads thresholds as "<container position> <target position>".
   Getting that order backwards is the classic bug, so both directions the
   site needs are named once, here, and never spelled out again.
   ========================================================================== */

/** One-shot reveal: fires once the target's top has risen into the top 88%
 *  of the viewport. `repeat: false` retires the observer after it fires. */
export function enterView(target: Element, extra: Record<string, unknown> = {}) {
  return {
    target,
    enter: "end-=12% start",
    sync: "play",
    repeat: false,
    ...extra,
  };
}

/** Continuous scrub across the target's full travel through the viewport:
 *  progress 0 as its top touches the bottom edge, 1 as its bottom leaves the
 *  top edge. `sync` below 1 lerps the scrub so it trails the scroll slightly;
 *  `true` locks it 1:1. */
export function passThrough(target: Element, smooth: number | boolean = 0.65) {
  return {
    target,
    enter: "end start",
    leave: "start end",
    sync: smooth,
  };
}

/**
 * Scroll-scrub settings, tuned per input device.
 *
 * On a phone, iOS batches scroll events during momentum scrolling, so a lerped
 * scrub visibly rubber-bands behind your thumb — `sync: true` pins it 1:1
 * instead. The travel is shallower too: the same percentage of a 390px screen
 * reads as far more movement than it does on a desktop.
 */
export function drift(touch: boolean) {
  return {
    range: touch ? ["-3%", "3%"] : ["-5.5%", "5.5%"],
    sync: touch ? true : 0.65,
  };
}

/**
 * The scroll-scrubbed 3D pose of a photograph, tuned per input device.
 *
 * Each photo is a plane standing in its own perspective box: tipped back and
 * pushed away as it rises into view, square and at rest as it crosses the
 * middle of the screen, tipping away again as it leaves the top. The middle
 * of the screen is where you actually look at a photograph, so the middle is
 * the one place the plane is flat — `EASE.settle` widens that resting zone
 * and pushes the folding out to the edges where you are not reading.
 *
 * A phone gets the deeper arc, not the shallower one. One column means every
 * card passes dead through the centre of its own perspective box, so the
 * tilt resolves honestly and reads as a print being turned over. A wide grid
 * shows three of these at once at three different heights, where the same
 * angle stops being depth and starts being noise — so it is roughly halved.
 *
 * Returned as plain keyframe stops; `EASE` and the observer come from the
 * caller, so this stays a token and not an animation.
 */
export function tilt(touch: boolean) {
  return touch
    ? { rotateX: [10, 0, -8], z: [-90, 0, -40] }
    : { rotateX: [6, 0, -5], z: [-52, 0, -24] };
}

/**
 * The scroll-scrubbed pose of a masthead handing the page over to its content.
 *
 * It rises and dims either way; on a pointer device it also tips back around
 * its own foot and pushes into the distance, the way a title card is set down
 * on a table. The 3D half is withheld from touch on purpose — a masthead is
 * type, and iOS renders rotated text through a re-rastered texture, which at
 * display sizes is visible as a soft edge for the whole length of the scrub.
 */
export function recede(touch: boolean): Record<string, number[]> {
  // Typed as a bag of tweens rather than by inference: the two branches have
  // different keys, and a union of object shapes will not spread into
  // anime.js's params without the optional-undefined members tripping it.
  return touch
    ? { y: [0, -70], opacity: [1, 0.08] }
    : { y: [0, -70], opacity: [1, 0.08], rotateX: [0, 12], z: [0, -190] };
}

/**
 * A leaf swinging shut on its inboard edge — the timeline rows, hinged on the
 * rail they hang off.
 *
 * Unlike `tilt()` this is a one-shot, not a scrub: it lands flat and stays
 * flat, because you read the thing it poses. Same reason the travel is short
 * on touch, where the row is close to your eye and the full swing reads as a
 * lurch rather than a hinge.
 */
export function hinge(touch: boolean) {
  return touch
    ? { rotateY: [-11, 0], z: [-40, 0] }
    : { rotateY: [-19, 0], z: [-80, 0] };
}

/**
 * The vanishing point the gallery's perspective boxes share, as a percentage
 * of card height, scrubbed from the top of the grid to the bottom.
 *
 * Every card owns its own `perspective`, but they all read the origin from
 * one inherited custom property — so this is a single animation that moves
 * the viewer's eye down the page and lets ten cards respond to it. It is what
 * stops `tilt()` from looking like the same canned rotation ten times over.
 *
 * Pointer devices only: `perspective-origin` is not a compositor property, so
 * every frame re-projects each promoted card layer. That is affordable on a
 * laptop and is not on a phone.
 */
export function pov(): [number, number] {
  return [36, 64];
}

/* ==========================================================================
   Text
   ========================================================================== */

/** Split into lines that clip their own contents, so each line can slide up
 *  from under its own baseline. `accessible` keeps the original string
 *  readable to screen readers via a visually-hidden copy. */
export function splitLines(target: Element) {
  return splitText(target, {
    lines: { wrap: "clip" },
    accessible: true,
  });
}

/**
 * Reveal an element line by line.
 *
 * Where text wraps depends on the loaded font, so anime.js defers line
 * splitting until `document.fonts.ready` — reading `splitter.lines` straight
 * after `splitText()` returns an empty array. It also re-splits whenever the
 * element's width changes.
 *
 * `addEffect` is the hook built for both cases: it runs the callback once the
 * split is ready, re-runs it after every re-split, and — because it wraps the
 * callback in `keepTime` — resumes the returned animation where it had got to
 * instead of restarting it. Returning the animation also hands the splitter
 * ownership of it, so the enclosing Scope reverts it on unmount.
 */
type Splitter = ReturnType<typeof splitLines>;

/** The element's markup as React rendered it, before any splitter touched it. */
const pristine = new WeakMap<Element, string>();
/** The splitter currently owning each element. */
const owner = new WeakMap<Element, Splitter>();

/**
 * Hand an element to a new splitter, retiring whatever held it before.
 *
 * A scope constructor can run more than once on the same element — React
 * Strict Mode, a client-side navigation, or a media query flipping all re-run
 * it. Splitting twice is destructive: the second pass treats the first pass's
 * output (including its visually-hidden accessibility copy) as the source
 * text, and buries the real content inside a 1px clipped box.
 *
 * Reverting the old splitter is not enough on its own — a reverted splitter
 * still holds a pending `document.fonts.ready` callback that will happily
 * re-split the element later. Clearing `html` disarms it, because that is the
 * guard anime.js itself checks before splitting.
 */
function claim<T extends Splitter>(target: HTMLElement, split: () => T): T {
  if (!pristine.has(target)) pristine.set(target, target.innerHTML);

  const previous = owner.get(target);
  if (previous) {
    previous.revert();
    previous.html = "";
    owner.delete(target);
  }
  target.innerHTML = pristine.get(target)!;

  const splitter = split();
  owner.set(target, splitter);
  return splitter;
}

/** Reveal an element one line at a time. */
export function revealLines(
  target: HTMLElement,
  build: (lines: HTMLElement[]) => unknown,
) {
  const splitter = claim(target, () => splitLines(target));
  splitter.addEffect((self) => {
    // Unhide only once the line boxes exist, so text never flashes unsplit.
    utils.set(target, { opacity: 1 });
    return build(self.lines as HTMLElement[]) as never;
  });
  return splitter;
}

/** Reveal an element one character at a time. */
export function revealChars(
  target: HTMLElement,
  build: (chars: HTMLElement[]) => unknown,
) {
  const splitter = claim(target, () => splitChars(target));
  splitter.addEffect((self) => {
    utils.set(target, { opacity: 1 });
    return build(self.chars as HTMLElement[]) as never;
  });
  return splitter;
}

/** Split into characters (still grouped by word so wrapping survives). */
export function splitChars(target: Element) {
  return splitText(target, {
    words: { wrap: "clip" },
    chars: true,
    accessible: true,
  });
}
