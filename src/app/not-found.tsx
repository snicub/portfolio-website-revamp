import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// A dead link should still land somewhere that looks like the site and offers
// a way back in — Next's default is unstyled and links nowhere. Next adds its
// own noindex here, but the root layout's `index, follow` would otherwise sit
// beside it as a second, contradicting robots tag.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <div className="chrome-anchor">
        <Navbar />
      </div>
      {/* The masthead's data-reveal / data-split hooks are left off on
          purpose: they start hidden and wait on page script this route
          doesn't run, so the copy here is simply printed. */}
      <main className="page">
        <div className="masthead-stage">
          <header className="masthead">
            <p className="mono masthead__eyebrow">Error — 404</p>
            <h1 className="display masthead__title">Page not found</h1>
            <p className="masthead__lede">
              That page doesn&apos;t exist, or it moved. Try the{" "}
              <Link href="/home">gallery</Link> or the{" "}
              <Link href="/about">about page</Link>.
            </p>
          </header>
        </div>
      </main>
    </>
  );
}
