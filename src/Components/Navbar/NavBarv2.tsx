import HomeCard from "../Home/HomeCard";
import { useNavigate } from "react-router-dom";
import useDevice from "../../Hooks/useDevice";
import { useState } from "react";

export default function Navbar2() {
  const navigate = useNavigate();

  //handle navigation
  const handleRouterClick = (page: string) => {
    navigate(page);
  };

  const [isMobile, isDesktop] = useDevice();
  const [isHoverAbout, setIsHoverAbout] = useState(false); //track hover on about
  const [isHoverExit, setIsHoverExit] = useState(false); // track hover on exit

  return (
    <div className="entire-navbar">
      <div
        className="homecard-wrapper"
        style={{
          position: "fixed",
          top: "0",
          zIndex: 2,
        }}
      >
        <HomeCard /> {/* render home card component */}
      </div>
      <div
        className="about-wrapper"
        style={{
          position: "fixed",
          top: "0",
          right: "0",
          margin: isMobile ? "10px" : "20px",
          display: "flex",
          alignItems: isMobile ? "flex-end" : undefined,
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "1px" : "10px",
          zIndex: 2,
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
        }}
      >
        <div
          onMouseEnter={() => setIsHoverAbout(true)}
          onMouseLeave={() => setIsHoverAbout(false)}
          className="education-wrapper"
          onClick={() => handleRouterClick("/about")}
          style={{
            transition: "background-color 0.3s ease",
            cursor: "pointer",
            background: isDesktop && isHoverAbout ? "#E6E6FA" : undefined,
          }}
        >
          [ About ]
        </div>
        <div
          className="exit-wrapper"
          onMouseEnter={() => setIsHoverExit(true)}
          onMouseLeave={() => setIsHoverExit(false)}
          onClick={() => handleRouterClick("/")}
          style={{
            transition: "background-color 0.3s ease",
            cursor: "pointer",
            background: isDesktop && isHoverExit ? "#E6E6FA" : undefined,
            width: "fit-content",
          }}
        >
          [ Exit ]
        </div>
      </div>
    </div>
  );
}
