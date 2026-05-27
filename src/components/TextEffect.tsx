"use client";

import React, { useEffect, useRef, useState } from "react";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";
const randChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

const REVEAL_MS = 70;
const NOISE_MS = 50;

const cursorStyle: React.CSSProperties = {
  display: "inline-block",
  width: "8px",
  background: "black",
  marginLeft: "1px",
  animation: "blink 1s step-start infinite",
};

const TextEffect: React.FC<{ text?: string }> = ({ text = "" }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const noiseRef = useRef<HTMLSpanElement>(null);
  const realRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const noiseEl = noiseRef.current;
    const realEl = realRef.current;
    if (!container || !noiseEl || !realEl) return;

    if (reduceMotion) {
      noiseEl.textContent = "";
      realEl.textContent = text;
      setIsComplete(true);
      return;
    }

    let raf = 0;
    let startTime = 0;
    let lastNoiseTime = 0;
    let started = false;
    let finished = false;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const revealed = Math.min(text.length, Math.floor(elapsed / REVEAL_MS));

      if (realEl.textContent !== text.slice(0, revealed)) {
        realEl.textContent = text.slice(0, revealed);
      }

      if (revealed < text.length) {
        if (now - lastNoiseTime >= NOISE_MS) {
          lastNoiseTime = now;
          const noiseLen = text.length - revealed;
          let s = "";
          for (let i = 0; i < noiseLen; i++) s += randChar();
          noiseEl.textContent = s;
        }
        raf = requestAnimationFrame(tick);
      } else {
        noiseEl.textContent = "";
        finished = true;
        setIsComplete(true);
      }
    };

    const startAnimation = () => {
      if (started) return;
      started = true;
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (!finished) {
        if (noiseEl) noiseEl.textContent = "";
        if (realEl) realEl.textContent = "";
      }
    };
  }, [text, reduceMotion]);

  return (
    <span
      ref={containerRef}
      style={{
        fontFamily: "monospace",
        fontSize: "1rem",
        whiteSpace: "nowrap",
        display: "inline-block",
        width: `${text.length}ch`,
      }}
    >
      <span ref={realRef} />
      <span ref={noiseRef} />
      {!isComplete && (
        <span ref={cursorRef} style={cursorStyle}>
          |
        </span>
      )}
    </span>
  );
};

export default TextEffect;
