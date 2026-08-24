"use client";

import { animate, createTimeline, onScroll, stagger, utils } from "animejs";
import Gallery from "@/components/Gallery";
import GoToTopBottomBar from "@/components/GoToTopBottomBar";
import Data from "@/lib/data";
import { DUR, EASE, recede, revealLines, useAnimeScope } from "@/lib/motion";
import { breadcrumb, collectionPage, imageGallery, SITE_URL } from "@/lib/seo";

const LEDE =
  "Ultimate frisbee, cooking, sourdough, family, friends, and the road from a Taco Bell line to shipping Nespresso.com.";

export default function HomeContent() {
  const jsonLd = [
    breadcrumb([
      { name: "Home", path: "/" },
      { name: "Gallery", path: "/home" },
    ]),
    collectionPage({
      items: Data.galleryCardInfo.map((item) => ({
        title: item.title,
        image: item.img,
        url: `${SITE_URL}/gallery/${item.slug}`,
        description: item.info,
      })),
    }),
    imageGallery(
      Data.galleryCardInfo.map((item) => ({
        title: item.title,
        image: item.img,
      })),
    ),
  ];

  const { root } = useAnimeScope<HTMLElement>((self) => {
    const [masthead] = utils.$(".masthead") as HTMLElement[];
    const [title] = utils.$(".masthead__title") as HTMLElement[];
    if (!title || !masthead) return;

    createTimeline({ defaults: { ease: EASE.out } })
      .add(
        ".masthead__eyebrow",
        { opacity: [0, 1], y: [10, 0], duration: DUR.base },
        0,
      )
      .add(
        ".masthead__lede",
        { opacity: [0, 1], y: [12, 0], duration: DUR.base },
        380,
      )
      .add(
        ".masthead__rule",
        { scaleX: [0, 1], duration: DUR.slow, ease: EASE.expo },
        300,
      );

    // Each line rises out from under its own baseline.
    revealLines(title, (lines) =>
      animate(lines, {
        y: ["105%", "0%"],
        duration: DUR.slow,
        ease: EASE.expo,
        delay: stagger(90, { start: 120 }),
      }),
    );

    // Scroll-linked: the masthead is set down as the grid takes over. This
    // isn't played — anime.js seeks it from the masthead's own scroll
    // progress, from the moment its top reaches the viewport top to the
    // moment its bottom leaves it. On a pointer device it also tips back
    // around its foot inside the stage's perspective box; see `recede()`.
    animate(masthead, {
      ...recede(!!self.matches.touch),
      ease: EASE.scrub,
      autoplay: onScroll({
        target: masthead,
        enter: "start start",
        leave: "start end",
        sync: 0.8,
      }),
    });
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="page" ref={root}>
        <div className="masthead-stage">
          <header className="masthead">
            <p className="mono masthead__eyebrow" data-reveal>
              Index — {String(Data.galleryCardInfo.length).padStart(3, "0")}{" "}
              entries
            </p>
            <h1 className="display masthead__title" data-split>
              Portfolio Gallery
            </h1>
            <p className="masthead__lede" data-reveal>
              {LEDE}
            </p>
            <hr className="rule masthead__rule" />
          </header>
        </div>

        <section className="gallery-wrapper" aria-label="Portfolio gallery">
          <Gallery />
        </section>

        <footer className="site-footer">
          <span>designed &amp; developed by Daniel Han</span>
          <span>built with next.js</span>
        </footer>
      </main>
      {/* After <main>: a fixed element at the top of a route segment makes
          Next skip its scroll-to-top on navigation. */}
      <GoToTopBottomBar showBelow={300} />
    </>
  );
}
