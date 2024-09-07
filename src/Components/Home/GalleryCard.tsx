import { useNavigate } from "react-router-dom";
import useDevice from "../../Hooks/useDevice";

import "../../fonts.css";

interface GalleryCardProps {
  imageSrc: string;
  altText: string;
  title: string;
  style?: React.CSSProperties; // Add style prop
  index?: number; // Add index prop
  info?: string;
  plpImages: { src: string }[] | undefined;
}

function GalleryCard({
  imageSrc,
  altText,
  title,
  index = 0,
  info,
  plpImages,
}: GalleryCardProps) {
  const [isMobile, isTablet] = useDevice();
  const navigate = useNavigate();

  const handleClick = () => {
    // Pass props using state
    navigate("/learnmore", {
      state: {
        imageSrc, // Pass image source
        altText, // Pass alt text
        title, // Pass title
        index, // Pass index or any other data you need
        info,
        plpImages,
      },
    });
  };

  return (
    <div
      className="gallery-card"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%", // Adjust card width to be responsive
        cursor: "pointer",
        boxSizing: "border-box",
        margin: "40px 0", // Adjust margins to control spacing between cards
      }}
      onClick={handleClick}
    >
      <div
        className="gallery-card-image-container"
        style={{
          width: "100%",
          height: isTablet ? "350px" : isMobile ? "300px" : "500px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          className="gallery-card-image"
          loading="eager"
          src={imageSrc}
          alt={altText}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            aspectRatio: "1/1",
          }}
        />
      </div>
      <div style={{ paddingTop: "10px", width: "100%" }}>
        <p
          style={{
            margin: 0,
            fontFamily: "favorit",
            fontSize: "1rem",
            fontStyle: "normal",
            fontWeight: "bold",
            textAlign: "left",
          }}
        >
          {title}
        </p>
      </div>
    </div>
  );
}

export default GalleryCard;
