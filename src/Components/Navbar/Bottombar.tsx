import { useNavigate } from "react-router-dom";
import useDevice from "../../Hooks/useDevice";
import Data from "../../dataFile";
import { useState } from "react";

interface BottombarProps {
  index: number;
}

export default function Bottombar({ index }: BottombarProps) {
  const navigate = useNavigate();
  const handleDynamicClick = (targetIndex: number) => {
    navigate("/learnmore", {
      state: {
        imageSrc: Data.galleryCardInfo[targetIndex].img,
        altText: Data.galleryCardInfo[targetIndex].altText,
        title: Data.galleryCardInfo[targetIndex].title,
        index: targetIndex,
        info: Data.galleryCardInfo[targetIndex].info,
        plpImages: Data.galleryCardInfo[targetIndex].plpImages,
      },
    });
  };

  const [isMobile, isTablet, isDesktop] = useDevice();
  const [isHoverBack, setIsHoverBack] = useState(false);
  const [isHoverNext, setIsHoverNext] = useState(false);
  const [isHoverPrev, setIsHoverPrev] = useState(false);

  return (
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
          className="exit-wrapper"
          onClick={() => navigate("/home")}
          style={{
            transition: "background-color 0.3s ease",
            cursor: "pointer",
            background: isDesktop && isHoverBack ? "#E6E6FA" : undefined, // Change color on hover
          }}
          onMouseEnter={() => setIsHoverBack(true)}
          onMouseLeave={() => setIsHoverBack(false)}
        >
          [ Back ]
        </div>
      </div>
      <div
        className="experience-wrapper"
        style={{
          position: "fixed",
          bottom: "0",
          right: "0",
          margin: isMobile ? "10px" : "20px",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "3px" : "10px",
          zIndex: 2,
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
          alignItems: "flex-end",
        }}
      >
        <div
          className="exit-wrapper"
          onClick={() =>
            handleDynamicClick((index + 1) % Data.galleryCardInfo.length)
          }
          style={{
            transition: "background-color 0.3s ease",
            cursor: "pointer",
            background: isDesktop && isHoverNext ? "#E6E6FA" : undefined, // Change color on hover
            width: "fit-content",
          }}
          onMouseEnter={() => setIsHoverNext(true)}
          onMouseLeave={() => setIsHoverNext(false)}
        >
          [ Next ]
        </div>
        <div
          className="exit-wrapper"
          onClick={() =>
            handleDynamicClick(
              (index + Data.galleryCardInfo.length - 1) %
                Data.galleryCardInfo.length
            )
          }
          style={{
            transition: "background-color 0.3s ease",
            cursor: "pointer",
            background: isDesktop && isHoverPrev ? "#E6E6FA" : undefined, // Change color on hover
          }}
          onMouseEnter={() => setIsHoverPrev(true)}
          onMouseLeave={() => setIsHoverPrev(false)}
        >
          [ Previous ]
        </div>
      </div>
    </div>
  );
}
