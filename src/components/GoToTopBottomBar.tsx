"use client";

import { useEffect, useState } from "react";
import useDevice from "@/hooks/useDevice";

interface GoToTopBottomBarProps {
  showBelow: number;
}

export default function GoToTopBottomBar({ showBelow }: GoToTopBottomBarProps) {
  const [isMobile] = useDevice();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setShow(window.scrollY > showBelow);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showBelow]);

  return (
    <div
      className="entire-navbar"
      style={{
        opacity: show ? 1 : 0,
        pointerEvents: show ? "auto" : "none",
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <div
        className="experience-wrapper"
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
          margin: isMobile ? "10px" : "20px",
          display: "flex",
          textAlign: isMobile ? "right" : undefined,
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "1px" : "10px",
          zIndex: 2,
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
        }}
      >
        <button
          type="button"
          className="nav-link hover-highlight"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          [ Go to Top ]
        </button>
      </div>
    </div>
  );
}
