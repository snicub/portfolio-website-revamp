"use client";

import { animate, createAnimatable, spring } from "animejs";
import { useEffect, useRef } from "react";
import { DUR, EASE, SPRING, motionEnabled } from "@/lib/motion";

const HOVER_SELECTOR = "a, button, [role='button'], [data-cursor]";
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/**
 * Two parts, because one element can't do both jobs well:
 *
 *   • the dot is the actual pointer — written straight to `style.transform` on
 *     every mousemove so it never lags behind where you are pointing;
 *   • the ring is the flourish — an anime.js Animatable, so it eases in behind
 *     the dot and the engine owns the frame loop.
 *
 * Both blend with `difference`, so a white cursor reads black on paper and
 * white over a dark photograph. An ink-coloured cursor disappears over half
 * the images on this site.
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

    const trail = createAnimatable(ring, {
      x: { duration: 300, ease: EASE.out },
      y: { duration: 300, ease: EASE.out },
    });

    let shown = false;
    let hovering = false;

    const onMove = (e: MouseEvent) => {
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      trail.x(e.clientX);
      trail.y(e.clientY);
      if (!shown) {
        shown = true;
        animate([dot, ring], { opacity: 1, duration: DUR.micro, ease: EASE.out });
      }
    };

    const setHover = (on: boolean, text: string) => {
      if (hovering === on && label.textContent === text) return;
      hovering = on;
      label.textContent = text;
      animate(ring, { scale: on ? 1 : 0.66, ease: spring(SPRING.snappy) });
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

    const onOver = (e: MouseEvent) => {
      const hit = (e.target as HTMLElement)?.closest?.(HOVER_SELECTOR);
      if (!hit) return;
      setHover(true, hit.getAttribute("data-cursor") ?? "");
    };

    const onOut = (e: MouseEvent) => {
      if (!(e.target as HTMLElement)?.closest?.(HOVER_SELECTOR)) return;
      setHover(false, "");
    };

    const onDown = () =>
      animate(ring, { scale: hovering ? 0.88 : 0.5, duration: DUR.micro, ease: EASE.out });
    const onUp = () =>
      animate(ring, { scale: hovering ? 1 : 0.66, ease: spring(SPRING.snappy) });

    const onLeaveWindow = () => {
      shown = false;
      animate([dot, ring], { opacity: 0, duration: DUR.micro, ease: EASE.out });
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    document.addEventListener("mousedown", onDown, { passive: true });
    document.addEventListener("mouseup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
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
