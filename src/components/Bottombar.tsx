"use client";

import Link from "next/link";
import { getAdjacentSlugs } from "@/lib/data";

interface BottombarProps {
  slug: string;
}

export default function Bottombar({ slug }: BottombarProps) {
  const adjacent = getAdjacentSlugs(slug);

  return (
    <>
      <div className="utility-bar utility-bar--left">
        <Link href="/home" className="nav-link hover-highlight">
          [ Back ]
        </Link>
      </div>
      {adjacent && (
        <div className="utility-bar utility-bar--right">
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
    </>
  );
}
