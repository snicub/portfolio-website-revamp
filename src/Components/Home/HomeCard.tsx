import Clock from "../Clock/Clock";
import DateComp from "../Date/DateComp";
import { useNavigate } from "react-router-dom";
import useDevice from "../../Hooks/useDevice";
import { useState, useEffect } from "react";

function HomeCard() {
  const navigate = useNavigate();
  const [fontSize, setFontSize] = useState("3rem");
  const [isHoverName, setIsHoverName] = useState(false); // track hover state
  const [isMobile, isDesktop] = useDevice();

  // effect to adjust font size based on mobile state
  useEffect(() => {
    if (isMobile) {
      setFontSize("1.25rem");
    } else {
      setFontSize("3rem");
    }
  }, [isMobile]);

  // handle click to navigate to a page
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
        onMouseEnter={() => setIsHoverName(true)}
        onMouseLeave={() => setIsHoverName(false)}
        style={{
          transition: "background-color 0.3s ease",
          fontSize: fontSize,
          cursor: "pointer",
          background: isDesktop && isHoverName ? "#E6E6FA" : undefined,
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
