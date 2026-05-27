"use client";

import Data from "@/lib/data";
import AboutBottomBar from "@/components/AboutBottomBar";
import useDevice from "@/hooks/useDevice";
import ProgrammingTile from "@/components/ProgrammingTile";
import Marquee from "react-fast-marquee";
import {
  breadcrumb,
  aboutPageSchema,
  faqSchema,
  skillsList,
  PERSON,
} from "@/lib/seo";

export default function AboutContent() {
  const [isMobile, , isDesktop] = useDevice();

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

  return (
    <main>
      <h1 className="sr-only">About Daniel Han</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutBottomBar />
      <div
        className="navbar-wrapper-and-name-sticky-filler"
        style={{ paddingTop: isDesktop ? "150px" : "100px" }}
      >
        <Marquee
          className="marquee"
          style={{
            padding: 0,
            margin: 0,
            fontSize: "1rem",
            backgroundColor: "white",
          }}
          autoFill
        >
          {Data.programmingSection.map((tile, index) => (
            <ProgrammingTile key={index} img={tile.img} />
          ))}
        </Marquee>
      </div>
      <div
        className="navbar-filler"
        style={{ height: isMobile ? "40px" : "100px" }}
      />
      <section
        className="about-section"
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          width: "min(90%, 1200px)",
          margin: "0 auto",
          padding: isMobile ? "24px 16px" : "40px 20px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          fontFamily: "favorit",
          fontSize: "1rem",
          fontStyle: "normal",
          marginBottom: "80px",
        }}
      >
        <div
          className="contact-wrapper"
          style={{
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2 style={{ marginBottom: 10, fontSize: "1.8rem", color: "#333" }}>
            Contact
          </h2>
          <a
            href="https://www.youtube.com/@danhantbell"
            target="_blank"
            rel="noopener noreferrer"
            style={{ margin: "5px 0", fontSize: "1rem", color: "#555" }}
          >
            YouTube
          </a>
          <a
            href={`mailto:${Data.aboutMeSection.contact.email}`}
            style={{ margin: "5px 0", fontSize: "1rem", color: "#555" }}
          >
            {Data.aboutMeSection.contact.email}
          </a>
        </div>

        <div style={{ marginBottom: 40 }}>
          <h2
            style={{
              marginBottom: 24,
              fontSize: "1.8rem",
              color: "#333",
              textAlign: "center",
            }}
          >
            Experience
          </h2>
          <div
            style={{
              position: "relative",
              paddingLeft: isMobile ? 24 : 40,
              textAlign: "left",
            }}
          >
            {/* Vertical timeline line */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: isMobile ? 3 : 7,
                top: 4,
                bottom: 4,
                width: 1,
                backgroundColor: "#ddd",
              }}
            />
            {Data.aboutMeSection.experience.map((exp, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  marginBottom:
                    index < Data.aboutMeSection.experience.length - 1 ? 36 : 0,
                }}
              >
                {/* Timeline dot */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: isMobile ? -24 : -40,
                    top: 6,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    backgroundColor: "#333",
                  }}
                />
                <h4
                  style={{
                    margin: 0,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#111",
                    lineHeight: 1.3,
                  }}
                >
                  {exp.position}
                </h4>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "1rem",
                    color: "#444",
                    lineHeight: 1.4,
                  }}
                >
                  {exp.title}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "0.85rem",
                    color: "#888",
                    lineHeight: 1.4,
                    letterSpacing: "0.02em",
                  }}
                >
                  {exp.date}
                </p>
                {exp.description && (
                  <p
                    style={{
                      margin: "10px 0 0",
                      fontSize: "0.95rem",
                      color: "#555",
                      lineHeight: 1.6,
                    }}
                  >
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 0 }}>
          <h2
            style={{
              marginBottom: 24,
              fontSize: "1.8rem",
              color: "#333",
              textAlign: "center",
            }}
          >
            Education
          </h2>
          <div
            style={{
              position: "relative",
              paddingLeft: isMobile ? 24 : 40,
              textAlign: "left",
            }}
          >
            {/* Vertical timeline line */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: isMobile ? 3 : 7,
                top: 4,
                bottom: 4,
                width: 1,
                backgroundColor: "#ddd",
              }}
            />
            {Data.aboutMeSection.education.map((edu, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  marginBottom:
                    index < Data.aboutMeSection.education.length - 1 ? 36 : 0,
                }}
              >
                {/* Timeline dot */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: isMobile ? -24 : -40,
                    top: 6,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    backgroundColor: "#333",
                  }}
                />
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#111",
                    lineHeight: 1.3,
                  }}
                >
                  {edu.title}
                </h3>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "0.85rem",
                    color: "#888",
                    lineHeight: 1.4,
                    letterSpacing: "0.02em",
                  }}
                >
                  {edu.date}
                </p>
                {Object.values(edu.majors).map((major, majorIndex) => (
                  <div key={majorIndex} style={{ marginTop: 16 }}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "#333",
                        lineHeight: 1.4,
                      }}
                    >
                      {major.title}
                    </h4>
                    <p
                      style={{
                        margin: "6px 0 0",
                        fontSize: "0.85rem",
                        color: "#888",
                        fontWeight: 500,
                        lineHeight: 1.4,
                        letterSpacing: "0.03em",
                        textTransform: "uppercase",
                      }}
                    >
                      Coursework
                    </p>
                    <p
                      style={{
                        margin: "6px 0 0",
                        fontSize: "0.9rem",
                        color: "#555",
                        lineHeight: 1.7,
                      }}
                    >
                      {major.courses.join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
