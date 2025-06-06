import { useNavigate } from "react-router-dom";
import useDevice from "../../Hooks/useDevice";
import { useState } from "react";

export default function AboutBottomBar() {
  const navigate = useNavigate();
  const handleRouterClick = (page: string) => {
    navigate(page);
  };

  const [isMobile, isDesktop] = useDevice();

  const [isHoverBack, setIsHoverBack] = useState(false);
  return (
    <div className="entire-bottom-back-about-navbar">
      <div
        className="experience-wrapper"
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
          margin: isMobile ? "10px" : "20px",
          display: "flex",
          textAlign: isMobile ? "right" : undefined,
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "1px" : "10px",
          zIndex: 2,
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
        }}
      >
        <div
          className="education-wrapper"
          onClick={() => handleRouterClick("/home")}
          style={{
            transition: "background-color 0.3s ease",
            cursor: "pointer",
            background: isDesktop && isHoverBack ? "#E6E6FA" : undefined,
          }}
          onMouseEnter={() => setIsHoverBack(true)}
          onMouseLeave={() => setIsHoverBack(false)}
        >
          [ Back ]
        </div>
      </div>
    </div>
  );
}
