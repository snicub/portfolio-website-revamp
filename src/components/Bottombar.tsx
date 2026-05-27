"use client";

import Link from "next/link";
import useDevice from "@/hooks/useDevice";
import { getAdjacentSlugs } from "@/lib/data";

interface BottombarProps {
  slug: string;
}

export default function Bottombar({ slug }: BottombarProps) {
  const [isMobile] = useDevice();
  const adjacent = getAdjacentSlugs(slug);

  return (
    <div className="entire-navbar">
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
      {adjacent && (
        <div
          className="experience-wrapper"
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            margin: isMobile ? "10px" : "20px",
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "3px" : "10px",
            zIndex: 2,
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "bold",
            alignItems: "flex-end",
          }}
        >
          <Link
            href={`/gallery/${adjacent.next}`}
            className="nav-link hover-highlight"
          >
            [ Next ]
          </Link>
          <Link
            href={`/gallery/${adjacent.prev}`}
            className="nav-link hover-highlight"
          >
            [ Previous ]
          </Link>
        </div>
      )}
    </div>
  );
}
