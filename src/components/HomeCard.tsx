"use client";

import Link from "next/link";
import Clock from "./Clock";
import DateComp from "./DateComp";
import useDevice from "@/hooks/useDevice";

export default function HomeCard() {
  const [isMobile] = useDevice();
  const fontSize = isMobile ? "1.25rem" : "3rem";

  return (
    <div
      style={{
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
        margin: "10px",
      }}
    >
      <Link
        href="/home"
        className="hover-highlight"
        style={{
          transition: "background-color 0.3s ease",
          fontSize,
          cursor: "pointer",
          width: "fit-content",
          display: "block",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        Daniel Han
      </Link>
      <DateComp />
      <Clock />
    </div>
  );
}
