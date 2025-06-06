import { useNavigate } from "react-router-dom";
import useDevice from "../../Hooks/useDevice";
import TextEffect from "../TextEffects/TextEffect";
import "../../fonts.css";

interface GalleryCardProps {
  imageSrc: string;
  altText: string;
  title: string;
  style?: React.CSSProperties;
  index?: number;
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
  const [isMobile, isTablet, isDesktop] = useDevice();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/learnmore", {
      state: {
        imageSrc,
        altText,
        title,
        index,
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
        width: "100%",
        cursor: "pointer",
        boxSizing: "border-box",
        margin: "40px 0",
        overflow: "hidden",
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
          transition: "transform 0.3s ease-in-out",
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
            transition: "transform 0.3s ease-in-out",
            aspectRatio: "1/1",
          }}
        />
      </div>
      <div style={{ paddingTop: "10px", width: "100%" }}>
        <TextEffect text={title} />
      </div>

      {/* Adding hover effect */}
      {isDesktop && (
        <style>
          {`
          .gallery-card-image-container:hover .gallery-card-image {
            transform: scale(1.1); /* Zoom effect */
          }
        `}
        </style>
      )}
    </div>
  );
}

export default GalleryCard;
