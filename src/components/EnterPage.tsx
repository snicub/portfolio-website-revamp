"use client";

import Marquee from "react-fast-marquee";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import useDevice from "@/hooks/useDevice";
import type { ImageObject } from "@/lib/data";

interface EnterPageProps {
  images: ImageObject[] | undefined;
  duration?: number;
}

export default function EnterPage({ images, duration = 3500 }: EnterPageProps) {
  const [isMobile] = useDevice();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const firstImgRef = useRef<HTMLImageElement | null>(null);

  const safeImages = images ?? [];

  const goHome = useCallback(() => router.push("/home"), [router]);

  useEffect(() => {
    if (!firstLoaded && firstImgRef.current?.complete) {
      setFirstLoaded(true);
    }
  }, [firstLoaded]);

  useEffect(() => {
    if (!firstLoaded || safeImages.length <= 1) return;
    let id: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (id !== null) return;
      id = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % safeImages.length);
      }, duration);
    };
    const stop = () => {
      if (id !== null) {
        clearInterval(id);
        id = null;
      }
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [firstLoaded, safeImages.length, duration]);

  return (
    <div
      className="enter-page-main"
      style={{
        position: "relative",
        height: "100vh",
        opacity: firstLoaded ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
        backgroundColor: "white",
      }}
    >
      <Marquee
        className="marquee"
        style={{
          fontFamily: "favorit",
          padding: 0,
          margin: 0,
          color: "rgba(0, 0, 0, 0.85)",
          fontSize: "1rem",
          lineHeight: 0.25,
          fontVariationSettings: "'slnt' 0",
          letterSpacing: 0,
          position: "absolute",
          backgroundColor: "white",
          zIndex: 2,
          cursor: "pointer",
        }}
        autoFill
      >
        <p>
          Daniel Han is a passionate software engineer based in New Jersey. He
          is currently a web developer at Nespresso focusing on making the best
          user experience &#9749; He gets it done with quality.&nbsp;
        </p>
      </Marquee>

      <button
        type="button"
        className="enter"
        onClick={goHome}
        aria-label="Enter site"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "rgba(0,0,0,1)",
          fontSize: "2rem",
          fontFamily:
            '"Helvetica Neue", Helvetica, sans-serif, "Helvetica Neue Regular", Icons',
          fontStyle: "normal",
          fontWeight: "bold",
          letterSpacing: "0.1em",
          background: "rgba(255, 255, 255, 0.3)",
          zIndex: 2,
          cursor: "pointer",
          border: "none",
          padding: "8px 12px",
        }}
      >
        [ enter ]
      </button>

      <div
        onClick={goHome}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {safeImages.map((image, index) => {
          const src =
            isMobile || !image.desktopSrc ? image.mobileSrc : image.desktopSrc;
          const isActive = currentIndex === index;
          return (
            <img
              ref={index === 0 ? firstImgRef : undefined}
              key={index}
              src={src}
              alt=""
              aria-hidden={!isActive}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              {...{ fetchPriority: index === 0 ? ("high" as const) : ("low" as const) }}
              onLoad={() => {
                if (index === 0) setFirstLoaded(true);
              }}
              onError={() => {
                if (index === 0) setFirstLoaded(true);
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: isActive ? 1 : 0,
                transition: "opacity 1s ease-in-out",
                willChange: "opacity",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
