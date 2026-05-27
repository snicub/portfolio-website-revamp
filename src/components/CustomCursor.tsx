"use client";

import { useEffect, useRef, useState } from "react";

const CURSOR_SIZE = 12;
const LERP_FACTOR = 0.15;
const INTERACTIVE_SELECTOR = "a, button, [role='button']";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const position = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const animationFrame = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only activate on devices with a fine pointer (mouse)
    const pointerQuery = window.matchMedia("(pointer: fine)");
    if (!pointerQuery.matches) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Hide the default cursor
    document.documentElement.style.cursor = "none";

    const handleMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      if (reducedMotion) {
        // Snap directly — no animation lag
        position.current = { x: e.clientX, y: e.clientY };
        applyPosition();
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest(INTERACTIVE_SELECTOR)) {
        cursorRef.current?.classList.add("cursor--hover");
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest(INTERACTIVE_SELECTOR)) {
        cursorRef.current?.classList.remove("cursor--hover");
      }
    };

    function applyPosition() {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate3d(${position.current.x - CURSOR_SIZE / 2}px, ${position.current.y - CURSOR_SIZE / 2}px, 0)`;
    }

    function animate() {
      if (!reducedMotion) {
        position.current.x +=
          (target.current.x - position.current.x) * LERP_FACTOR;
        position.current.y +=
          (target.current.y - position.current.y) * LERP_FACTOR;
        applyPosition();
      }
      animationFrame.current = requestAnimationFrame(animate);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        borderRadius: "50%",
        border: "1px solid #000",
        backgroundColor: "transparent",
        pointerEvents: "none",
        zIndex: 99999,
        opacity: isVisible ? 1 : 0,
        transition:
          "opacity 0.2s ease, width 0.2s ease, height 0.2s ease, margin 0.2s ease",
        willChange: "transform",
      }}
      className="custom-cursor"
    />
  );
}
