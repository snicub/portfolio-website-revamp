import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Collage from "./Collage";
import Bottombar from "../Navbar/Bottombar";
import "../../fonts.css";
import useScrollToTop from "../../Hooks/useTop";
import useDevice from "../../Hooks/useDevice";

const PLP: React.FC = () => {
  useScrollToTop();
  const [isMobile] = useDevice();
  const [fadeOut, setFadeOut] = useState(true);
  const [content, setContent] = useState<any>(null);

  const location = useLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const newContent = location.state || {};

  useEffect(() => {
    setContent(newContent);
    setFadeOut(false);

    const fadeTimeout = setTimeout(() => {
      setFadeOut(true);
    }, 0);

    return () => clearTimeout(fadeTimeout);
    // eslint-disable-next-line
  }, []);

  const preloadImage = (src: string) => {
    const img = new Image();
    img.src = src;
  };

  useEffect(() => {
    setFadeOut(true);

    preloadImage(newContent.imageSrc);

    const fadeTimeout = setTimeout(() => {
      setContent(newContent);
      setFadeOut(false);
    }, 1000);

    return () => clearTimeout(fadeTimeout);
  }, [location.state, newContent]);

  if (!content) return null;

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
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 1s ease-in-out",
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
                loading={content === newContent ? "eager" : "lazy"}
                className="mainImage"
                style={{
                  maxWidth: !isMobile ? "50%" : undefined,
                  height: "auto",
                  display: "block",
                  width: "100%",
                }}
                src={imageSrc}
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
