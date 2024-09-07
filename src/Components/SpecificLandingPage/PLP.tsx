import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar2 from "../Navbar/NavBarv2";
import Collage from "./Collage";
import Bottombar from "../Navbar/Bottombar";
import "../../fonts.css";
import ScrollToTop from "../../Hooks/useTop";
import useDevice from "../../Hooks/useDevice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PLP: React.FC = () => {
  const [isMobile, isTablet, isDesktop] = useDevice();
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const { imageSrc, altText, title, index, info, plpImages } =
    location.state || {};

  useEffect(() => {
    if (location.state) {
      // Simulate loading time
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1250);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="entire-plp">
        <Bottombar index={index} />
        <div className="info-card">
          <Skeleton height={500} width="100%" style={{ marginTop: "200px" }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <div className="entire-plp">
        <div className="navbar-filler" style={{ height: "150px" }}>
          <Bottombar index={index} />
        </div>

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
          <div
            className="info-wrapper"
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <img
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
          <Collage plpImages={plpImages} />
        </div>
      </div>
    </>
  );
};

export default PLP;
