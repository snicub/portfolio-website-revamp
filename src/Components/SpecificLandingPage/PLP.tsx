import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Collage from "./Collage";
import Bottombar from "../Navbar/Bottombar";
import "../../fonts.css";
import useScrollToTop from "../../Hooks/useTop";
import useDevice from "../../Hooks/useDevice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PLP: React.FC = () => {
  useScrollToTop();
  const [isMobile, isTablet, isDesktop] = useDevice(); // Assuming this hook adjusts for tablet/desktop too
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const location = useLocation();
  const { imageSrc, altText, title, index, info, plpImages } =
    location.state || {};

  // Image loading handler
  const handleImageLoaded = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Update loading status based on image load
  useEffect(() => {
    if (imageLoaded) {
      setLoading(false);
    }
  }, [imageLoaded]);

  useEffect(() => {
    // Reset states on location change
    setLoading(true);
    setImageLoaded(false);
  }, [location.state]);

  return (
    <div className="entire-plp" style={{ marginTop: "50px" }}>
      <div className="bottom-navbar-wrapper">
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
        {loading ? (
          <div
            className="skeleton-wrapper"
            style={{
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ width: "100%" }}>
              <Skeleton
                height={40}
                style={{ width: isMobile ? "55%" : isTablet ? "45%" : "40%" }}
              />
              <div style={{ height: "30px" }} />
              <Skeleton height={400} width="100%" />
            </span>
          </div>
        ) : (
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
        )}
        <div className="content-wrapper">
          <div
            className="image-and-info-wrapper"
            style={{
              display: loading ? "none" : "flex",
              flexDirection: isMobile ? "column" : "row", // Adjusts based on device
              alignItems: "center",
              gap: "10px",
            }}
          >
            {" "}
            <img
              className="mainImage"
              style={{
                maxWidth: !isMobile ? "50%" : undefined,
                height: "auto",
                display: "block",
                width: "100%",
              }}
              src={`${imageSrc}?${new Date().getTime()}`} // Force reload to avoid cache issue
              alt={altText}
              onLoad={handleImageLoaded}
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
        {!loading && <Collage plpImages={plpImages} />}
      </div>
    </div>
  );
};

export default PLP;
