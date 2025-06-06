import { useEffect, useState } from "react";
import useDevice from "../../Hooks/useDevice";

interface GoToTopBottomBarProps {
  showBelow: number;
}

export default function GoToTopBottomBar({ showBelow }: GoToTopBottomBarProps) {
  const [isMobile, isDesktop] = useDevice();
  const [show, setShow] = useState(false);
  const [isHover, setIsHover] = useState(false);

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
      <div
        className="entire-navbar"
        style={{
          opacity: show ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
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
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className="go-to-top-wrapper"
            onClick={handleClick}
            style={{
              cursor: "pointer",
              background: isDesktop && isHover ? "#E6E6FA" : "transparent",
            }}
          >
            [ Go to Top ]
          </div>
        </div>
      </div>
    </div>
  );
}
