import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Collage from "./Collage";
import Bottombar from "../Navbar/Bottombar";
import "../../fonts.css";
import useScrollToTop from "../../Hooks/useTop";
import useDevice from "../../Hooks/useDevice";

const PLP: React.FC = () => {
  useScrollToTop();
  const [isMobile, isTablet, isDesktop] = useDevice();
  const [fadeOut, setFadeOut] = useState(true); // Set initial state to true for fade-in on refresh
  const [content, setContent] = useState<any>(null); // Stores content for rendering

  const location = useLocation();
  const newContent = location.state || {};

  // Handle fade-in on component mount (for initial navigation)
  useEffect(() => {
    setContent(newContent); // Set initial content on mount
    setFadeOut(false); // Set fadeState to false (fade-in)

    const fadeTimeout = setTimeout(() => {
      setFadeOut(true); // Trigger fade-in
    }, 0); // Small delay for fade-in

    return () => clearTimeout(fadeTimeout); // Clean up the timer
  }, []); // Empty dependency ensures this runs only on mount (for page refresh)

  const preloadImage = (src: string) => {
    const img = new Image();
    img.src = src;
  };

  useEffect(() => {
    setFadeOut(true); // Start fade-out effect

    // Preload the next image
    preloadImage(newContent.imageSrc);

    const fadeTimeout = setTimeout(() => {
      setContent(newContent); // Update the content after fade-out completes
      setFadeOut(false); // Start the fade-in effect
    }, 1000); // Adjust the timing for the fade-out effect duration

    return () => clearTimeout(fadeTimeout); // Clean up the timer on unmount
  }, [location.state, newContent]);

  if (!content) return null; // Ensure content is defined before rendering

  const { imageSrc, altText, title, index, info, plpImages } = content;

  return (
    <>
      <div className="bottom-navbar-wrapper">
        <Bottombar index={index} />
      </div>

      <div
        className="entire-plp"
        style={{
          marginTop: "50px",
          opacity: fadeOut ? 0 : 1, // Fades out before content change, then fades in
          transition: "opacity 1s ease-in-out", // Smooth fade effect with ease-in timing
        }}
      >
        <div
          className="info-card"
          style={{
            display: "flex",
            gap: "60px",
            flexDirection: "column",
            padding: "30px",
          }}
        >
          <div
            className="title-wrapper"
            style={{
              justifyContent: "center",
              display: "flex",
              fontFamily: "favorit",
              fontSize: "2rem",
              fontStyle: "normal",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {title}
          </div>
          <div className="content-wrapper">
            <div
              className="image-and-info-wrapper"
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <img
                loading={content === newContent ? "eager" : "lazy"} // Only eager load on first load
                className="mainImage"
                style={{
                  maxWidth: !isMobile ? "50%" : undefined,
                  height: "auto",
                  display: "block",
                  width: "100%",
                }}
                src={`${imageSrc}?${new Date().getTime()}`} // Force reload to avoid cache issue
                alt={altText}
              />
              <div
                className="info-wrapper"
                style={{
                  fontFamily: "favorit",
                  fontSize: "1rem",
                  fontStyle: "normal",
                }}
              >
                {info}
              </div>
            </div>
          </div>
          <Collage plpImages={plpImages} />
        </div>
      </div>
    </>
  );
};

export default PLP;
