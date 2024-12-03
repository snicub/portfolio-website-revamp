import Clock from "../Clock/Clock";
import DateComp from "../Date/DateComp";
import { useNavigate } from "react-router-dom";
import useDevice from "../../Hooks/useDevice";
import { useState, useEffect } from "react";

function HomeCard() {
  const navigate = useNavigate();
  const [fontSize, setFontSize] = useState("3rem"); // Default to desktop size
  const [isHoverName, setIsHoverName] = useState(false);
  const [isMobile, isTablet, isDesktop] = useDevice();

  useEffect(() => {
    // Set font size based on initial device type only on mount
    if (isMobile) {
      setFontSize("1.25rem");
    } else {
      setFontSize("3rem");
    }
  }, [isMobile]); // Runs only on the first mount and whenever isMobile changes

  const handleExperienceClick = (page: string) => {
    navigate(page);
  };

  return (
    <div
      style={{
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
        margin: "10px",
      }}
    >
      <div
        onMouseEnter={() => setIsHoverName(true)} // Handle hover in
        onMouseLeave={() => setIsHoverName(false)} // Handle hover out
        style={{
          transition: "background-color 0.3s ease",
          fontSize: fontSize,
          cursor: "pointer", // Change cursor to pointer to indicate it's clickable
          background: isDesktop && isHoverName ? "#E6E6FA" : undefined, // Change color on hover
          width: "fit-content",
        }}
        onClick={() => handleExperienceClick("/home")}
      >
        Daniel Han
      </div>
      <DateComp />
      <Clock />
    </div>
  );
}

export default HomeCard;
