"use client";

import { type CSSProperties } from "react";
import { animate, createTimeline, onScroll, spring, stagger, utils } from "animejs";
import Data from "@/lib/data";
import AboutBottomBar from "@/components/AboutBottomBar";
import {
  DUR,
  EASE,
  SPRING,
  enterView,
  drift,
  hinge,
  passThrough,
  recede,
  revealLines,
  useAnimeScope,
} from "@/lib/motion";
import {
  breadcrumb,
  aboutPageSchema,
  faqSchema,
  skillsList,
  PERSON,
} from "@/lib/seo";

const LEDE =
  "Software engineer in New Jersey, currently building Nespresso.com. Rutgers, Computer Science and Korean. Before that, the line at Taco Bell.";

// The logos stand on the faces of a drum, so the set never has to be
// repeated to keep the band full — a cylinder is already a loop.
const DRUM_FACES = Data.programmingSection.length;

// Distance from the drum's axis to a face, as a multiple of face width: the
// apothem of a regular polygon, w / (2·tan(π/n)). Handed to CSS as a plain
// number so the face width itself can stay a clamp().
const DRUM_RADIUS = 1 / (2 * Math.tan(Math.PI / DRUM_FACES));

export default function AboutContent() {
  const jsonLd = [
    breadcrumb([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ]),
    aboutPageSchema(),
    skillsList(PERSON.knowsAbout),
    faqSchema([
      {
        question: "Who is Daniel Han?",
        answer:
          "Daniel Han is a software engineer based in New Jersey. He currently works at Nestle Nespresso building Nespresso.com. He graduated from Rutgers University with degrees in Computer Science and Korean.",
      },
      {
        question: "Where does Daniel Han work?",
        answer:
          "Daniel Han works at Nestle Nespresso as a Software Engineer, making the Nespresso website fast, functional, and user friendly.",
      },
      {
        question: "What programming languages does Daniel Han know?",
        answer:
          "Daniel Han is proficient in Java, Python, SQL, TypeScript, HTML, CSS, JavaScript, Swift, React, and Salesforce Marketing Cloud.",
      },
      {
        question: "Where did Daniel Han go to college?",
        answer:
          "Daniel Han attended Rutgers University from September 2021 to May 2025, double-majoring in Computer Science and Korean.",
      },
      {
        question: "How can I contact Daniel Han?",
        answer:
          "You can reach Daniel Han via email at daniel.hangb@gmail.com or through his YouTube channel @danhantbell.",
      },
    ]),
  ];

  const { root } = useAnimeScope<HTMLElement>((self) => {
    const motion = drift(!!self.matches.touch);
    /* ---- masthead ---- */
    const [masthead] = utils.$(".masthead") as HTMLElement[];
    const [title] = utils.$(".masthead__title") as HTMLElement[];

    // Scroll-linked: the masthead is set down as the page takes over. Seeked
    // from its own scroll progress, not played.
    if (masthead) {
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
    }

    if (title) {
      createTimeline({ defaults: { ease: EASE.out } })
        .add(".masthead__eyebrow", { opacity: [0, 1], y: [10, 0], duration: DUR.base }, 0)
        .add(".masthead__lede", { opacity: [0, 1], y: [12, 0], duration: DUR.base }, 380)
        .add(".masthead__rule", { scaleX: [0, 1], duration: DUR.slow, ease: EASE.expo }, 300);

      revealLines(title, (lines) =>
        animate(lines, {
          y: ["105%", "0%"],
          duration: DUR.slow,
          ease: EASE.expo,
          delay: stagger(90, { start: 120 }),
        }),
      );
    }

    /* ---- the logo drum is driven entirely by scroll position ----
       One number for the whole band: the ring turns once, and CSS has
       already put every logo on its own face of the cylinder. */
    const [band] = utils.$(".drum") as HTMLElement[];
    const [ring] = utils.$(".drum__ring") as HTMLElement[];
    if (band && ring) {
      animate(ring, {
        rotateY: [0, -360],
        ease: EASE.scrub,
        autoplay: onScroll(passThrough(band, motion.sync === true ? true : 0.85)),
      });
    }

    /* ---- timelines draw themselves as you read down them ---- */
    (utils.$(".timeline") as HTMLElement[]).forEach((list) => {
      const rail = list.querySelector(".timeline__rail") as HTMLElement | null;
      if (rail) {
        animate(rail, {
          scaleY: [0, 1],
          ease: EASE.scrub,
          autoplay: onScroll({
            target: list,
            // Starts drawing as the list crosses three quarters of the
            // viewport and completes as its foot reaches the middle.
            enter: "end-=25% start",
            leave: "center end",
            sync: motion.sync === true ? true : 0.7,
          }),
        });
      }

      const swing = hinge(!!self.matches.touch);

      list.querySelectorAll<HTMLElement>(".timeline__row").forEach((row) => {
        const dot = row.querySelector(".timeline__dot") as HTMLElement | null;
        const leaf = row.querySelector(".timeline__leaf") as HTMLElement | null;

        const tl = createTimeline({ autoplay: onScroll(enterView(row)) }).add(
          row,
          { opacity: [0, 1], duration: DUR.base, ease: EASE.out },
          0,
        );

        // The row swings shut on the edge that touches the rail. The dot
        // stays behind, flat on the rail itself, the way the caption under a
        // gallery card stays flat while the print above it turns.
        if (leaf) {
          tl.add(
            leaf,
            {
              rotateY: swing.rotateY,
              z: swing.z,
              duration: DUR.slow,
              ease: EASE.outSoft,
              // An element left holding rotateY(0deg) is still a 3D layer,
              // and iOS keeps serving it from the softened texture it
              // rendered mid-swing. Hand the layer back once it is shut.
              onComplete: () => {
                leaf.style.transform = "";
                leaf.style.willChange = "";
              },
            },
            0,
          );
        }

        if (dot) tl.add(dot, { scale: [0, 1], ease: spring(SPRING.pop) }, 120);
      });
    });

    /* ---- everything else fades up on arrival ---- */
    (utils.$("[data-reveal-scroll]") as HTMLElement[]).forEach((el) => {
      animate(el, {
        opacity: [0, 1],
        y: [18, 0],
        duration: DUR.base,
        ease: EASE.out,
        autoplay: onScroll(enterView(el)),
      });
    });
  });

  return (
    <main className="page about" ref={root}>
      <h1 className="sr-only">About Daniel Han</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="masthead-stage">
        <header className="masthead">
          <p className="mono masthead__eyebrow" data-reveal>
            About
          </p>
          <p className="display masthead__title" data-split>
            Daniel Han
          </p>
          <p className="masthead__lede" data-reveal>
            {LEDE}
          </p>
          <hr className="rule masthead__rule" />
        </header>
      </div>

      <section className="about__block" data-reveal-scroll>
        <h2 className="about__h mono">Contact</h2>
        <ul className="about__contact">
          <li>
            <a
              href="https://www.youtube.com/@danhantbell"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link hover-highlight"
            >
              YouTube — @danhantbell
            </a>
          </li>
          <li>
            <a
              href={`mailto:${Data.aboutMeSection.contact.email}`}
              className="nav-link hover-highlight"
            >
              {Data.aboutMeSection.contact.email}
            </a>
          </li>
        </ul>
      </section>

      {/* A turn of the drum comes from vertical scroll — no autoplay loop. */}
      <div
        className="drum"
        aria-label="Languages and tools"
        style={
          {
            "--drum-n": DRUM_FACES,
            "--drum-k": DRUM_RADIUS.toFixed(4),
          } as CSSProperties
        }
      >
        <div className="drum__ring">
          {Data.programmingSection.map((tile, i) => (
            <span
              className="drum__face"
              key={tile.img}
              style={{ "--i": i } as CSSProperties}
            >
              <img src={tile.img} alt="" loading="lazy" decoding="async" />
            </span>
          ))}
        </div>
      </div>

      <section className="about__block">
        <h2 className="about__h mono" data-reveal-scroll>
          Experience
        </h2>
        <div className="timeline">
          <span className="timeline__rail" aria-hidden="true" />
          <ol className="timeline__list">
            {Data.aboutMeSection.experience.map((exp, index) => (
              <li className="timeline__row" key={index}>
                <span className="timeline__dot" aria-hidden="true" />
                {/* The hinged half. The dot above stays flat on the rail. */}
                <div className="timeline__leaf">
                  <h3 className="timeline__title">{exp.position}</h3>
                  <p className="timeline__org">{exp.title}</p>
                  <p className="timeline__date mono">{exp.date}</p>
                  {exp.description && (
                    <p className="timeline__body">{exp.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="about__block">
        <h2 className="about__h mono" data-reveal-scroll>
          Education
        </h2>
        <div className="timeline">
          <span className="timeline__rail" aria-hidden="true" />
          <ol className="timeline__list">
            {Data.aboutMeSection.education.map((edu, index) => (
              <li className="timeline__row" key={index}>
                <span className="timeline__dot" aria-hidden="true" />
                <div className="timeline__leaf">
                  <h3 className="timeline__title">{edu.title}</h3>
                  <p className="timeline__date mono">{edu.date}</p>
                  {Object.values(edu.majors).map((major, majorIndex) => (
                    <div className="timeline__major" key={majorIndex}>
                      <h4 className="timeline__major-title">{major.title}</h4>
                      <p className="timeline__label mono">Coursework</p>
                      <p className="timeline__body">
                        {major.courses.join(" · ")}
                      </p>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Fixed chrome last, so it is never the segment's first element. */}
      <AboutBottomBar />
    </main>
  );
}
