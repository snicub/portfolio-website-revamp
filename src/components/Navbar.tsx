"use client";

import Link from "next/link";
import HomeCard from "./HomeCard";
import useDevice from "@/hooks/useDevice";

export default function Navbar() {
  const [isMobile] = useDevice();

  return (
    <div className="entire-navbar">
      <div
        className="homecard-wrapper"
        style={{ position: "fixed", top: 0, zIndex: 2 }}
      >
        <HomeCard />
      </div>
      <div
        className="about-wrapper"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          margin: isMobile ? "10px" : "20px",
          display: "flex",
          alignItems: isMobile ? "flex-end" : undefined,
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "1px" : "10px",
          zIndex: 2,
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
        }}
      >
        <Link href="/about" className="nav-link hover-highlight">
          [ About ]
        </Link>
        <Link href="/" className="nav-link hover-highlight">
          [ Exit ]
        </Link>
      </div>
    </div>
  );
}
