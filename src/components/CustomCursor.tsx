"use client";

import { animate, createAnimatable, spring, utils } from "animejs";
import { useEffect, useRef } from "react";
import { DUR, EASE, SPRING, motionEnabled } from "@/lib/motion";

const HOVER_SELECTOR = "a, button, [role='button'], [data-cursor]";
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/** The ring's resting size, as a fraction of its box. */
const RING_REST = 0.66;

/**
 * Two parts, because one element can't do both jobs well:
 *
 *   • the dot is the actual pointer — written straight to the element on
 *     every mousemove so it never lags behind where you are pointing;
 *   • the ring is the flourish — an anime.js Animatable, so it eases in behind
 *     the dot and the engine owns the frame loop.
 *
 * Both blend with `difference`, so a white cursor reads black on paper and
 * white over a dark photograph. An ink-coloured cursor disappears over half
 * the images on this site.
 *
 * The dot's position goes to the standalone `translate` property, NOT to
 * `transform`. anime.js owns `transform` on any element it animates: it keeps
 * a cache of that element's transform components and rewrites the whole
 * `transform` string from the cache on every frame. So a hand-written
 * `style.transform` and an in-flight `scale` tween are two authors fighting
 * over one property, and anime's write — which lands after the mousemove, in
 * the frame callback — wins. The dot would pin to wherever it was when the
 * hover started and stay there for the length of the spring, which on a page
 * of links restarts continuously. `translate` is a separate property that the
 * browser applies before `transform`, so the two authors never collide.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    // Never take the native cursor away from someone who asked for reduced
    // motion, or from a device that has no pointer to replace.
    if (!motionEnabled()) return;
    if (!window.matchMedia(FINE_POINTER).matches) return;

    document.documentElement.classList.add("has-custom-cursor");

    // Seed the resting scale through anime rather than CSS. The Animatable
    // below composes `transform` from anime's own cache, so a `scale()` that
    // only ever existed in the stylesheet is dropped the first time the ring
    // moves — it would snap to full size on the first mousemove.
    utils.set(ring, { scale: RING_REST });

    const trail = createAnimatable(ring, {
      x: { duration: 300, ease: EASE.out },
      y: { duration: 300, ease: EASE.out },
    });

    let shown = false;
    let hovering = false;
    /** The hover target we last resolved against, to skip redundant work. */
    let lastTarget: Element | null = null;
    /** The element currently driving the hover state, if any. */
    let hoverEl: Element | null = null;

    const setHover = (on: boolean, text: string) => {
      if (hovering === on && label.textContent === text) return;
      hovering = on;
      label.textContent = text;
      animate(ring, { scale: on ? 1 : RING_REST, ease: spring(SPRING.snappy) });
      animate(ring, {
        backgroundColor: on ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
        duration: DUR.fast,
        ease: EASE.out,
      });
      animate(dot, { scale: on ? 0 : 1, ease: spring(SPRING.snappy) });
      animate(label, {
        opacity: on && text ? 1 : 0,
        duration: DUR.fast,
        ease: EASE.out,
      });
    };

    /** Recompute the hover state from whatever is under the pointer. */
    const resolve = (target: EventTarget | null) => {
      const node = target instanceof Element ? target : null;
      const hit = node?.closest?.(HOVER_SELECTOR) ?? null;
      // A detached node still answers closest(), so check before latching on:
      // holding a dead element here would re-resolve on every later move.
      hoverEl = hit?.isConnected ? hit : null;
      setHover(!!hoverEl, hoverEl?.getAttribute("data-cursor") ?? "");
    };

    const onMove = (e: MouseEvent) => {
      dot.style.translate = `${e.clientX}px ${e.clientY}px`;
      trail.x(e.clientX);
      trail.y(e.clientY);

      // Hover is derived here rather than from mouseout, so it is
      // self-healing: a link that is removed, replaced by a view transition,
      // or swapped under a still pointer can't leave the dot stuck at scale 0.
      if (e.target !== lastTarget || (hoverEl && !hoverEl.isConnected)) {
        lastTarget = e.target as Element | null;
        resolve(e.target);
      }

      if (!shown) {
        shown = true;
        animate([dot, ring], { opacity: 1, duration: DUR.micro, ease: EASE.out });
      }
    };

    // Fires when the element under the pointer changes without the pointer
    // moving — scrolling, or content swapping underneath it.
    const onOver = (e: MouseEvent) => {
      lastTarget = e.target as Element | null;
      resolve(e.target);
    };

    const onDown = () =>
      animate(ring, { scale: hovering ? 0.88 : 0.5, duration: DUR.micro, ease: EASE.out });
    const onUp = () =>
      animate(ring, { scale: hovering ? 1 : RING_REST, ease: spring(SPRING.snappy) });

    const onLeaveWindow = () => {
      shown = false;
      animate([dot, ring], { opacity: 0, duration: DUR.micro, ease: EASE.out });
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mousedown", onDown, { passive: true });
    document.addEventListener("mouseup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeaveWindow);
      trail.revert();
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="cursor-ring__label" />
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
