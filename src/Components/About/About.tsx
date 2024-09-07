import Data from "../../dataFile";
import "../../fonts.css";
import resume from "/Resume.pdf";
import ScrollToTop from "../../Hooks/useTop";

export default function About() {
  return (
    <>
      <ScrollToTop />
      <div className="navbar-filler" style={{ height: "150px" }}></div>
      <div
        className="about-section"
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          width: "80%", // Adjust width for smaller screens
          maxWidth: "1200px", // Max width for larger screens
          margin: "0 auto", // Center horizontally
          padding: "40px 20px", // Add padding for better spacing
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", // Add subtle shadow
          fontFamily: "favorit",
          fontSize: "1rem",
          fontStyle: "normal",
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
          <p style={{ margin: "5px 0", fontSize: "1rem", color: "#555" }}>
            {Data.aboutMeSection.contact.location}
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
          <p style={{ display: "inline" }}>
            <a
              href={resume}
              style={{ margin: "5px 0", fontSize: "1rem", color: "#555" }}
              download="Resume-Daniel Han.pdf"
            >
              Resume
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
              <p style={{ margin: "5px 0", fontSize: "1rem", color: "#555" }}>
                {edu.date}
              </p>
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
