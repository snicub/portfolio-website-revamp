import Clock from "../Clock/Clock";
import DateComp from "../Date/DateComp";
import { useNavigate } from "react-router-dom";
import { useDevice } from "../../Context/DeviceContext";

import { useEffect, useState } from "react";

function HomeCard() {
  const { isMobile, isTablet, isDesktop } = useDevice();
  const [isReady, setIsReady] = useState(false);

  const [isHoverName, setIsHoverName] = useState(false);
  const navigate = useNavigate();
  const handleExperienceClick = (page: string) => {
    navigate(page);
  };

  useEffect(() => {
    if (isMobile !== undefined) {
      setIsReady(true); // Set ready to true once device detection is complete
    }
  }, [isMobile]);

  if (!isReady) return null; // Don't render until the device type is detected

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
          fontSize: isMobile ? "1.25rem" : "3rem",
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
