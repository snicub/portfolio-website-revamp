import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface CollageProps {
  plpImages: { src: string }[] | undefined;
}

const CollageImage: React.FC<{ src: string; index: number }> = ({
  src,
  index,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Image load handler
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      style={{
        width: "100%",
        paddingBottom: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {!isLoaded && (
        <Skeleton
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      )}
      <img
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: isLoaded ? 1 : 0, // Opacity transition
          transition: "opacity 1s ease-in-out", // Smooth fade-in effect
        }}
        src={src}
        alt={`Collage ${index}`}
        onLoad={handleImageLoad} // Update state when the image loads
        onError={() => setIsLoaded(true)} // Handle errors gracefully
      />
    </div>
  );
};

const Collage: React.FC<CollageProps> = ({ plpImages }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "10px",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {plpImages &&
        plpImages.map((image, index) => (
          <CollageImage key={index} src={image.src} index={index} />
        ))}
    </div>
  );
};

export default Collage;
