"use client";

import Link from "next/link";

export default function AboutBottomBar() {
  return (
    <div className="utility-bar utility-bar--left">
      <Link href="/home" className="nav-link hover-highlight">
        [ Back ]
      </Link>
    </div>
  );
}
