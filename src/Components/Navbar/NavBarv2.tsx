import HomeCard from "../Home/HomeCard";
import { useNavigate } from "react-router-dom";
import useDevice from "../../Hooks/useDevice";
import { useEffect, useState } from "react";

export default function Navbar2() {
  const navigate = useNavigate();
  const handleRouterClick = (page: string) => {
    navigate(page);
  };

  const [isMobile, isTablet, isDesktop] = useDevice();
  const [isHoverAbout, setIsHoverAbout] = useState(false);
  const [isHoverExit, setIsHoverExit] = useState(false);
  const [loading, setLoading] = useState(true); // New state for loading

  useEffect(() => {
    // Use a small delay to simulate waiting for the device detection
    const timeout = setTimeout(() => {
      setLoading(false); // Set loading to false after a small delay
    }, 50); // Adjust delay as needed (100ms in this case)

    return () => clearTimeout(timeout); // Cleanup timeout if the component unmounts
  }, [isMobile, isTablet, isDesktop]);

  // If still loading, you can return a placeholder or null to avoid early render
  if (loading) {
    return null; // Or you can add a loader/spinner here
  }

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
        <HomeCard />
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
          onMouseEnter={() => setIsHoverAbout(true)} // Handle hover in
          onMouseLeave={() => setIsHoverAbout(false)} // Handle hover out
          className="education-wrapper"
          onClick={() => handleRouterClick("/about")}
          style={{
            transition: "background-color 0.3s ease",
            cursor: "pointer", // Change cursor to pointer to indicate it's clickable
            background: isDesktop && isHoverAbout ? "#E6E6FA" : undefined, // Change color on hover
          }}
        >
          [ About ]
        </div>
        <div
          className="exit-wrapper"
          onMouseEnter={() => setIsHoverExit(true)} // Handle hover in
          onMouseLeave={() => setIsHoverExit(false)} // Handle hover out
          onClick={() => handleRouterClick("/")}
          style={{
            transition: "background-color 0.3s ease",
            cursor: "pointer", // Change cursor to pointer to indicate it's clickable
            background: isDesktop && isHoverExit ? "#E6E6FA" : undefined, // Change color on hover
            width: "fit-content",
          }}
        >
          [ Exit ]
        </div>
      </div>
    </div>
  );
}
