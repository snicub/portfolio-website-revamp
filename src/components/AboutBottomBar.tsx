"use client";

import Link from "next/link";
import useDevice from "@/hooks/useDevice";

export default function AboutBottomBar() {
  const [isMobile] = useDevice();

  return (
    <div className="entire-bottom-back-about-navbar">
      <div
        className="experience-wrapper"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
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
        <Link href="/home" className="nav-link hover-highlight">
          [ Back ]
        </Link>
      </div>
    </div>
  );
}
