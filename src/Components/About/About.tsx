import Data from "../../dataFile";
import "../../fonts.css";
import AboutBottomBar from "../Navbar/AboutBottomBar";
import useScrollToTop from "../../Hooks/useTop";
import useDevice from "../../Hooks/useDevice";
import ProgrammingTile from "../Programming/ProgrammingTile";
import Marquee from "react-fast-marquee";

export default function About() {
  const [isMobile, isDesktop] = useDevice();
  useScrollToTop();
  return (
    <>
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
          autoFill={true}
        >
          {Data.programmingSection.map((tile, index) => (
            <ProgrammingTile key={index} img={tile.img} />
          ))}
        </Marquee>
      </div>
      <div
        className="navbar-filler"
        style={{ height: isMobile ? "40px" : "100px" }}
      ></div>
      <div
        className="about-section"
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          width: "80%", //adjust width for smaller screens
          maxWidth: "1200px", //set max width for larger screen
          margin: "0 auto", //center horizontally
          padding: "40px 20px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          fontFamily: "favorit",
          fontSize: "1rem",
          fontStyle: "normal",
          marginBottom: "50px",
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
          <h3
            style={{ marginBottom: "10px", fontSize: "1.8rem", color: "#333" }}
          >
            Contact:
          </h3>
          <p style={{ display: "inline" }}>
            <a
              href="https://www.youtube.com/@danhantbell"
              style={{
                margin: "5px 0",
                fontSize: "1rem",
                color: "#555",
              }}
            >
              YouTube
            </a>
          </p>
          <p style={{ display: "inline" }}>
            <a
              href="mailto:daniel.hangb@gmail.com"
              style={{
                margin: "5px 0",
                fontSize: "1rem",
                color: "#555",
              }}
            >
              {Data.aboutMeSection.contact.email}
            </a>
          </p>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{ marginBottom: "10px", fontSize: "1.8rem", color: "#333" }}
          >
            Experience:
          </h3>
          {Data.aboutMeSection.experience.map((exp, index) => (
            <div
              key={index}
              style={{ marginBottom: "30px", textAlign: "left" }}
            >
              <h4
                style={{ margin: "5px 0", fontSize: "1.5rem", color: "#444" }}
              >
                {exp.title}
              </h4>
              <h5
                style={{ margin: "5px 0", fontSize: "1.2rem", color: "#666" }}
              >
                {exp.position}
              </h5>
              <p style={{ margin: "5px 0", fontSize: "1rem", color: "#777" }}>
                {exp.date}
              </p>
              <p style={{ margin: "5px 0", fontSize: "1rem", color: "#777" }}>
                {exp.description}
              </p>
            </div>
          ))}
        </div>
        <div>
          <h3
            style={{ marginBottom: "20px", fontSize: "1.8rem", color: "#333" }}
          >
            Education:
          </h3>
          {Data.aboutMeSection.education.map((edu, index) => (
            <div
              key={index}
              style={{ marginBottom: "30px", textAlign: "left" }}
            >
              <h2 style={{ margin: "5px 0", fontSize: "2rem", color: "#222" }}>
                {edu.title}
              </h2>
              {Object.values(edu.majors).map((major, majorIndex) => (
                <div key={majorIndex} style={{ marginBottom: "20px" }}>
                  <h3
                    style={{
                      margin: "5px 0",
                      fontSize: "1.5rem",
                      color: "#444",
                    }}
                  >
                    Major: {major.title}
                  </h3>
                  <div
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    Relevant coursework:
                  </div>
                  <div style={{ marginTop: "10px", textAlign: "left" }}>
                    {major.courses.map((course, courseIndex) => (
                      <div
                        key={courseIndex}
                        style={{
                          margin: "5px 0",
                          fontSize: "1rem",
                          color: "#555",
                        }}
                      >
                        {course}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
