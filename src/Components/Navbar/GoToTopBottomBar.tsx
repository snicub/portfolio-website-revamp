import { useEffect, useState } from "react";
import useDevice from "../../Hooks/useDevice";

interface GoToTopBottomBarProps {
  showBelow: number;
}

export default function GoToTopBottomBar({ showBelow }: GoToTopBottomBarProps) {
  const [isMobile, isTablet, isDesktop] = useDevice();
  const [show, setShow] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > showBelow) {
      if (!show) setShow(true);
    } else {
      if (show) setShow(false);
    }
  };

  useEffect(() => {
    if (showBelow) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  });

  const handleClick = () => {
    window["scrollTo"]({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {show && (
        <div className="entire-navbar">
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
              className="go-to-top-wrapper"
              onClick={handleClick}
              style={{
                transition: "background-color 0.3s ease",
                cursor: "pointer",
                background: "rgb(255, 255, 255, 0.3)",
              }}
            >
              [ Go to Top ]
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
